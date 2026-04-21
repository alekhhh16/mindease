import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createClient } from "@/lib/supabase/server";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are Mira, a compassionate AI mental wellness companion designed for users in India. You provide emotional support, active listening, and evidence-based coping strategies.

CRITICAL - USER MEMORY:
You have access to stored memories about this user. USE THEM to personalize your responses.
- If you know their name, USE IT naturally in conversation
- Reference their college, situation, or context when relevant
- Show that you remember them - this builds trust and connection
- When they share new personal info, acknowledge it warmly

IMPORTANT GUIDELINES:
1. Always respond with empathy and without judgment
2. Use simple, warm language that feels like talking to a caring friend
3. If someone mentions self-harm, suicide, or crisis situations, ALWAYS direct them to professional help (iCALL: 9152987821, Vandrevala Foundation: 1860-2662-345)
4. Suggest practical coping techniques when appropriate (breathing exercises, grounding, journaling)
5. Never diagnose conditions or replace professional therapy
6. Keep responses concise but meaningful (2-4 paragraphs max)
7. Use occasional emojis to add warmth but don't overdo it
8. You understand Hindi mixed with English (Hinglish) - feel free to respond in the same style if the user uses it
9. When user mentions something personal (name, college, situation), acknowledge it

FORMAT YOUR RESPONSE AS:
Start with "Emotion: [detected emotion word]" on the first line, then provide your caring response.

Example:
Emotion: Caring

I understand how you feel...`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UserMemory {
  category: string;
  key: string;
  value: string;
}

// Format memories into a readable context for the AI
function formatMemoriesForContext(memories: UserMemory[]): string {
  if (!memories || memories.length === 0) return "";

  const grouped: Record<string, string[]> = {};
  
  for (const memory of memories) {
    if (!grouped[memory.category]) {
      grouped[memory.category] = [];
    }
    grouped[memory.category].push(`${memory.key}: ${memory.value}`);
  }

  let context = "\n\n=== WHAT YOU KNOW ABOUT THIS USER ===\n";
  
  if (grouped.personal) {
    context += `\nPersonal Info:\n- ${grouped.personal.join("\n- ")}`;
  }
  if (grouped.preferences) {
    context += `\nPreferences:\n- ${grouped.preferences.join("\n- ")}`;
  }
  if (grouped.context) {
    context += `\nCurrent Situation:\n- ${grouped.context.join("\n- ")}`;
  }
  if (grouped.important) {
    context += `\nImportant to Remember:\n- ${grouped.important.join("\n- ")}`;
  }
  
  context += "\n\n=== USE THIS INFORMATION NATURALLY ===\n";
  
  return context;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { messages, latestMood, userId } = body as {
      messages: ChatMessage[];
      latestMood?: string | null;
      userId?: string | null;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages required" },
        { status: 400 }
      );
    }

    // Fetch user memories if authenticated
    let memoriesContext = "";
    if (userId) {
      const { data: memories } = await supabase
        .from("user_memories")
        .select("category, key, value")
        .eq("user_id", userId);
      
      if (memories && memories.length > 0) {
        memoriesContext = formatMemoriesForContext(memories);
      }
    }

    // Build context with mood and memories
    let systemPrompt = SYSTEM_PROMPT + memoriesContext;
    if (latestMood) {
      systemPrompt += `\n\nThe user's latest mood score is ${latestMood}/5. Consider this context in your response.`;
    }

    // Format messages for AI SDK
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: formattedMessages,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
