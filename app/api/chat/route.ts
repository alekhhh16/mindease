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
- You remember what users tell you and reference it naturally

CRITICAL - USER MEMORY:
You have stored memories about this user. USE THEM to personalize EVERY response:
- ALWAYS use their name if you know it
- Reference their college, friends, situation when relevant
- Say things like "How are things at [college]?" or "How's [friend name]?"
- This builds trust and shows you genuinely care

RESPONSE STYLE:
1. Start by acknowledging/validating their feelings
2. Reference something from the conversation or their memories
3. Keep responses SHORT (2-3 paragraphs max) and human-like
4. ALWAYS end with ONE thoughtful follow-up question
5. Use 1-2 emojis naturally (not too many)
6. Match their language style - if they use Hinglish, respond in Hinglish

WHAT TO AVOID:
- Generic responses that could apply to anyone
- Long lectures or too much advice
- Medical diagnoses or clinical language
- Robotic or formal tone
- Ignoring what they previously shared

CRISIS PROTOCOL:
If someone mentions self-harm, suicide, or crisis, respond with compassion AND direct them to:
- iCALL: 9152987821
- Vandrevala Foundation: 1860-2662-345
- Emergency: 112

FORMAT YOUR RESPONSE AS:
Start with "Emotion: [one word]" on line 1, then your warm response.

Example:
Emotion: Caring

Hey [name], I can hear that you're feeling overwhelmed right now. That's completely valid - exams can be really stressful. Remember, it's okay to take breaks. What's been the hardest part for you today?`;

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
  if (!memories || memories.length === 0) return "";

  let context = "\n\n=== WHAT YOU KNOW ABOUT THIS USER ===\n";
  
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
