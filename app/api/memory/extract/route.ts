import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface Memory {
  key: string;
  value: string;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || messages.length < 2) {
      return NextResponse.json({ extracted: [] });
    }

    // Get last few messages for context
    const recentMessages = messages.slice(-6);
    const conversationText = recentMessages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    // Use AI to extract personal information with text generation
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are a memory extraction assistant. Extract personal information from this conversation.

IMPORTANT: Respond ONLY with a valid JSON array. No explanations, no markdown, just the JSON.

Format: [{"key": "type", "value": "info"}, ...]

Keys to look for:
- "name" - user's actual name
- "college" - college/university name
- "location" - city/location
- "age" - age if mentioned
- "interest" - hobbies/interests
- "occupation" - student/job
- "situation" - current life situation

Conversation:
${conversationText}

If no personal info found, respond with: []
Only extract EXPLICITLY stated information. Do not assume.

JSON Response:`
    });

    // Parse the response
    let memories: Memory[] = [];
    try {
      // Clean the response - remove any markdown or extra text
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```json?\n?/g, "").replace(/```/g, "");
      }
      cleanedText = cleanedText.trim();
      
      const parsed = JSON.parse(cleanedText);
      if (Array.isArray(parsed)) {
        memories = parsed.filter((m: Memory) => m.key && m.value);
      }
    } catch {
      console.log("[v0] Failed to parse memory extraction response:", text);
      return NextResponse.json({ extracted: [] });
    }

    // Save extracted memories to database
    console.log("[v0] Memory extraction result:", memories);
    
    if (memories.length > 0) {
      for (const memory of memories) {
        console.log("[v0] Saving memory:", memory.key, "=", memory.value, "for user:", user.id);
        const { error } = await supabase
          .from("user_memory")
          .upsert({
            user_id: user.id,
            key: memory.key,
            value: memory.value,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,key" });
        
        if (error) {
          console.error("[v0] Memory save error:", error.message);
        }
      }
    }

    return NextResponse.json({ extracted: memories });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json({ extracted: [] });
  }
}
