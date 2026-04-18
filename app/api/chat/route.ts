import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are MindEase, a compassionate AI mental wellness companion designed for users in India. You provide emotional support, active listening, and evidence-based coping strategies.

IMPORTANT GUIDELINES:
1. Always respond with empathy and without judgment
2. Use simple, warm language that feels like talking to a caring friend
3. If someone mentions self-harm, suicide, or crisis situations, ALWAYS direct them to professional help (iCALL: 9152987821, Vandrevala Foundation: 1860-2662-345)
4. Suggest practical coping techniques when appropriate (breathing exercises, grounding, journaling)
5. Never diagnose conditions or replace professional therapy
6. Keep responses concise but meaningful (2-4 paragraphs max)
7. Use occasional emojis to add warmth but don't overdo it

FORMAT YOUR RESPONSE AS:
Emotion: [detected emotion word]
[Your caring response here]`;

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

    // For now, use a simple response system
    // This can be upgraded to use AI SDK with OpenAI/Anthropic later
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const response = generateResponse(lastUserMessage);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}

function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  // Crisis detection
  const crisisKeywords = [
    "suicide",
    "suicidal",
    "end my life",
    "want to die",
    "hurt myself",
    "kill myself",
  ];
  if (crisisKeywords.some((k) => lower.includes(k))) {
    return `Emotion: Crisis

I hear you, and I'm so glad you reached out. What you're feeling right now is incredibly difficult, but you don't have to face this alone.

Please reach out to someone who can help right now:
- iCALL: 9152987821 (Mon-Sat, 8am-10pm)
- Vandrevala Foundation: 1860-2662-345 (24/7)

You matter. Your life matters. There are people who care about you and want to help. Would you like me to share some grounding exercises while you consider reaching out?`;
  }

  // Stress/anxiety responses
  const stressKeywords = ["stressed", "stress", "anxious", "anxiety", "overwhelmed", "panic"];
  if (stressKeywords.some((k) => lower.includes(k))) {
    return `Emotion: Caring

I understand that feeling of being overwhelmed. It's really tough when everything feels like too much.

Let's try something together: Take a slow, deep breath in for 4 counts... hold for 4... and exhale for 6. This activates your body's calm-down response.

Would you like to talk about what's causing the stress? Sometimes just putting it into words can help lighten the load. I'm here to listen without judgment.`;
  }

  // Sad responses
  const sadKeywords = ["sad", "depressed", "lonely", "alone", "hopeless", "crying"];
  if (sadKeywords.some((k) => lower.includes(k))) {
    return `Emotion: Empathetic

I'm sorry you're going through this. Those feelings of sadness can be so heavy to carry.

It's okay to feel this way - you don't have to push through or pretend everything is fine. Sometimes we just need space to feel what we're feeling.

Is there something specific that's been weighing on you? Or would you prefer we try a gentle grounding exercise together? Either way, I'm here with you.`;
  }

  // Sleep issues
  const sleepKeywords = ["can't sleep", "insomnia", "sleepless", "tired", "exhausted"];
  if (sleepKeywords.some((k) => lower.includes(k))) {
    return `Emotion: Understanding

Sleep troubles can be so frustrating, and they affect everything else too.

Here's a gentle technique: Try the 4-7-8 breathing method. Breathe in for 4 counts, hold for 7, and exhale slowly for 8. It helps quiet the mind.

Also, try to avoid screens an hour before bed if possible. Would you like to talk about what's keeping your mind racing at night?`;
  }

  // Positive/grateful responses
  const positiveKeywords = ["better", "good", "happy", "grateful", "thanks", "helped"];
  if (positiveKeywords.some((k) => lower.includes(k))) {
    return `Emotion: Hopeful

That's wonderful to hear! Recognizing the good moments, even small ones, is so important.

I'm glad I could be here for you. Remember, you can always come back whenever you need support - whether you're feeling down or just want to check in.

Keep nurturing those positive feelings. You're doing great!`;
  }

  // Default supportive response
  return `Emotion: Caring

Thank you for sharing that with me. I'm here to listen and support you through whatever you're experiencing.

Would you like to tell me more about what's on your mind? Sometimes talking through our thoughts and feelings can bring a bit of clarity. There's no rush - take your time.

Remember, this is a safe space. Whatever you're feeling is valid.`;
}
