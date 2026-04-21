import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get messages for a specific session
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID required" },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(messages);
}

// Add a message to a session
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { sessionId, role, content } = body;

  if (!sessionId || !role || !content) {
    return NextResponse.json(
      { error: "sessionId, role, and content are required" },
      { status: 400 }
    );
  }

  const { data: message, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update session's updated_at
  await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  return NextResponse.json(message);
}
