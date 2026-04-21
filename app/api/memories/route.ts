import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export interface UserMemory {
  id: string;
  user_id: string;
  category: "personal" | "preferences" | "context" | "important";
  key: string;
  value: string;
  confidence: number;
  created_at: string;
  updated_at: string;
}

// GET - Fetch all memories for the authenticated user
export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: memories, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_id", user.id)
    .order("category")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(memories);
}

// POST - Add or update a memory
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { category, key, value, sessionId } = body;

  if (!category || !key || !value) {
    return NextResponse.json(
      { error: "Category, key, and value are required" },
      { status: 400 }
    );
  }

  // Upsert - update if exists, insert if not
  const { data, error } = await supabase
    .from("user_memories")
    .upsert(
      {
        user_id: user.id,
        category,
        key,
        value,
        source_session_id: sessionId || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,category,key",
      }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Remove a memory
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const memoryId = searchParams.get("id");

  if (!memoryId) {
    return NextResponse.json({ error: "Memory ID required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
