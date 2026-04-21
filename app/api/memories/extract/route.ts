import { createClient } from "@/lib/supabase/server";
import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const MemoryExtractionSchema = z.object({
  memories: z.array(
    z.object({
      category: z.enum(["personal", "preferences", "context", "important"]),
      key: z.string().describe("A short, specific key like 'name', 'college', 'hobby', 'fear'"),
      value: z.string().describe("The actual value/information"),
      confidence: z.number().min(0).max(1).describe("How confident (0-1) that this is correct"),
    })
  ),
});

const EXTRACTION_PROMPT = `You are a memory extraction system for a mental wellness AI companion called MindEase.

Analyze the conversation and extract important personal information that should be remembered across sessions.

Categories:
- "personal": Name, age, location, college/school, job, family members
- "preferences": Communication style, topics they like/dislike, how they want to be addressed
- "context": Ongoing situations (exams, relationships, health issues)
- "important": Mental health related info, triggers, coping strategies that work for them

Rules:
1. Only extract EXPLICIT information - never assume or infer
2. Be very specific with keys (e.g., "name" not "user_info")
3. Keep values concise but complete
4. High confidence (0.9-1.0) for directly stated facts
5. Medium confidence (0.6-0.8) for implied but clear info
6. Skip anything vague or uncertain
7. Focus on info that would help personalize future conversations

Examples of good extractions:
- {category: "personal", key: "name", value: "Rahul", confidence: 1.0}
- {category: "personal", key: "college", value: "IIT Delhi", confidence: 0.95}
- {category: "context", key: "upcoming_exam", value: "semester exams in 2 weeks", confidence: 0.9}
- {category: "preferences", key: "language", value: "prefers Hinglish", confidence: 0.85}
- {category: "important", key: "anxiety_trigger", value: "public speaking", confidence: 0.9}`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { messages, sessionId } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "Messages required" }, { status: 400 });
  }

  try {
    // Format conversation for extraction
    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    // Use AI to extract memories
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: MemoryExtractionSchema,
      system: EXTRACTION_PROMPT,
      prompt: `Extract memorable information from this conversation:\n\n${conversationText}`,
    });

    // Save extracted memories to database
    const savedMemories = [];
    for (const memory of object.memories) {
      if (memory.confidence >= 0.7) {
        const { data, error } = await supabase
          .from("user_memories")
          .upsert(
            {
              user_id: user.id,
              category: memory.category,
              key: memory.key,
              value: memory.value,
              confidence: memory.confidence,
              source_session_id: sessionId || null,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,category,key",
            }
          )
          .select()
          .single();

        if (!error && data) {
          savedMemories.push(data);
        }
      }
    }

    return NextResponse.json({
      extracted: object.memories,
      saved: savedMemories,
    });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract memories" },
      { status: 500 }
    );
  }
}
