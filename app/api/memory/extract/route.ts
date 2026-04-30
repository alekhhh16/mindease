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

    if (!messages || messages.length === 0) {
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

Keys to use (ONE entry per key, combine multiple values with commas):
- "name" - user's full name
- "nickname" - any nickname they prefer
- "college" - college/university name
- "course" - what they are studying (BTech, MBA, etc.)
- "semester" - current semester if mentioned
- "location" - city/location
- "age" - age if mentioned
- "friends" - ALL friend names combined (e.g., "Anmol, Arpit, Alekh")
- "family" - family members mentioned (e.g., "mom, dad, sister Priya")
- "interests" - ALL hobbies/interests combined (e.g., "music, coding, gaming")
- "occupation" - student/job
- "relationship" - relationship status if mentioned
- "feelings" - current emotional state/struggles
- "goals" - any goals or aspirations mentioned

RULES:
1. Only extract EXPLICITLY stated information
2. Combine multiple values of same type with commas
3. If nothing found, respond with: []

Conversation:
${conversationText}

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
      return NextResponse.json({ extracted: [] });
    }

    // Save extracted memories to database
    if (memories.length > 0) {
      for (const memory of memories) {
        // For fields that can have multiple values, merge with existing
        if (["friends", "interests", "family"].includes(memory.key)) {
          const { data: existing } = await supabase
            .from("user_memory")
            .select("value")
            .eq("user_id", user.id)
            .eq("key", memory.key)
            .single();
          
          if (existing?.value) {
            // Merge existing and new values, remove duplicates
            const existingValues = existing.value.split(",").map((v: string) => v.trim().toLowerCase());
            const newValues = memory.value.split(",").map(v => v.trim());
            const uniqueNew = newValues.filter(v => !existingValues.includes(v.toLowerCase()));
            if (uniqueNew.length > 0) {
              memory.value = existing.value + ", " + uniqueNew.join(", ");
            } else {
              continue; // Skip if no new values
            }
          }
        }
        
        await supabase
          .from("user_memory")
          .upsert({
            user_id: user.id,
            key: memory.key,
            value: memory.value,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id,key" });
      }
    }

    return NextResponse.json({ extracted: memories });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json({ extracted: [] });
  }
}
