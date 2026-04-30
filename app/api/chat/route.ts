import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createClient } from "@/lib/supabase/server";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are Mira, a calm and emotionally intelligent mental wellness companion. You are warm, understanding, and feel like a caring friend who truly listens.

PERSONALITY:
- Warm, gentle, and non-judgmental
- You speak like a supportive friend, not a robot
- You validate feelings before offering advice

CRITICAL - USER MEMORY:
You may receive stored memories about this user below. 
- ONLY use information that is EXPLICITLY provided in the memories section
- If memories section says "No memories stored yet" - DO NOT mention any personal details
- NEVER make up or assume information about the user (college, location, friends, etc.)
- If you don't know their name, just say "Hey" or "Hi there"
- If you don't know their college, DO NOT mention any college name

RESPONSE STYLE:
1. Start by acknowledging/validating their feelings
2. ONLY reference things the user told you in THIS conversation or in memories
3. Keep responses SHORT (2-3 paragraphs max) and human-like
4. End with ONE thoughtful follow-up question
5. Use 1-2 emojis naturally (not too many)
6. Match their language style - if they use Hinglish, respond in Hinglish

STRICT RULES - NEVER DO THESE:
- NEVER make up information you don't have (no fake colleges, locations, friends)
- NEVER say "I remember you mentioned X" unless X is in memories or this conversation
- NEVER assume the user is a student unless they said so
- If unsure about something, ASK instead of assuming

CRISIS PROTOCOL:
If someone mentions self-harm, suicide, or crisis, respond with compassion AND direct them to:
- iCALL: 9152987821
- Vandrevala Foundation: 1860-2662-345
- Emergency: 112

FORMAT YOUR RESPONSE AS:
Start with "Emotion: [one word]" on line 1, then your warm response.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UserMemory {
  key: string;
  value: string;
}

// Format memories into a readable context for the AI
function formatMemoriesForContext(memories: UserMemory[]): string {
  if (!memories || memories.length === 0) {
    return "\n\n=== USER MEMORIES ===\nNo memories stored yet. Do not assume any personal information.\n";
  }

  let context = "\n\n=== USER MEMORIES (ONLY use these facts) ===\n";
  
  for (const memory of memories) {
    context += `- ${memory.key}: ${memory.value}\n`;
  }
  
  context += "\n=== USE THIS INFORMATION NATURALLY ===\n";
  
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
        .from("user_memory")
        .select("key, value")
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

    // Format messages for AI SDK - limit to last 20 for performance
    const recentMessages = messages.slice(-20);
    const formattedMessages = recentMessages.map((msg) => ({
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
