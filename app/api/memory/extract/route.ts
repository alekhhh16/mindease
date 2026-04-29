import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const MemorySchema = z.object({
  memories: z.array(z.object({
    key: z.string().describe("The type of information (e.g., 'name', 'college', 'location', 'age', 'interest', 'situation')"),
    value: z.string().describe("The actual value/information")
  }))
});

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

    // Use AI to extract personal information
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: MemorySchema,
      prompt: `Extract any personal information the user has shared in this conversation. Only extract CLEAR, EXPLICIT information - not assumptions.

Look for:
- name (user's actual name)
- college/university (if mentioned)
- location/city (if mentioned)
- age (if mentioned)
- interests/hobbies (if mentioned)
- current_situation (brief summary of any significant life situation they mentioned)
- occupation (student, job, etc.)

Conversation:
${conversationText}

Return only information that was EXPLICITLY stated by the user. If nothing personal was shared, return empty array.`
    });

    // Save extracted memories to database
    console.log("[v0] Memory extraction result:", object.memories);
    
    if (object.memories && object.memories.length > 0) {
      for (const memory of object.memories) {
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

    return NextResponse.json({ extracted: object.memories });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json({ extracted: [] });
  }
}
