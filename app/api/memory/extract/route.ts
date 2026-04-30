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
      prompt: `Extract ONLY explicitly stated personal info from this conversation.

CRITICAL RULES:
- ONLY extract info the USER directly stated (not AI responses)
- DO NOT infer, assume, or guess anything
- DO NOT make up information
- If unsure, DO NOT include it
- Return [] if no clear personal info found

Format: [{"key": "type", "value": "exact info stated"}]

Keys (only use if USER explicitly stated):
- "name" - their actual name they said
- "location" - city they said they are from
- "college" - college name they mentioned
- "friends" - friend names they mentioned
- "age" - age they stated

WRONG examples (DO NOT DO THIS):
- User says "I feel stressed" -> DO NOT extract college or location
- User says "I'm from Kanpur" -> DO NOT add "Delhi University"
- User says "hi" -> Return []

Conversation:
${conversationText}

JSON (only explicit facts, or empty array):`
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
