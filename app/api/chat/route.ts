import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const SYSTEM_PROMPT = `You are Mira, a compassionate AI mental wellness companion designed for users in India. You provide emotional support, active listening, and evidence-based coping strategies.

IMPORTANT GUIDELINES:
1. Always respond with empathy and without judgment
2. Use simple, warm language that feels like talking to a caring friend
3. If someone mentions self-harm, suicide, or crisis situations, ALWAYS direct them to professional help (iCALL: 9152987821, Vandrevala Foundation: 1860-2662-345)
4. Suggest practical coping techniques when appropriate (breathing exercises, grounding, journaling)
5. Never diagnose conditions or replace professional therapy
6. Keep responses concise but meaningful (2-4 paragraphs max)
7. Use occasional emojis to add warmth but don't overdo it
8. You understand Hindi mixed with English (Hinglish) - feel free to respond in the same style if the user uses it

FORMAT YOUR RESPONSE AS:
Start with "Emotion: [detected emotion word]" on the first line, then provide your caring response.

Example:
Emotion: Caring

I understand how you feel...`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, latestMood } = body as {
      messages: ChatMessage[];
      latestMood?: string | null;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages required" },
        { status: 400 }
      );
    }

    // Build context with mood if available
    let systemPrompt = SYSTEM_PROMPT;
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
