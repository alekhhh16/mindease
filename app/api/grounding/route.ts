import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST - Save grounding session
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { see_items, feel_items, hear_items, smell_items, taste_items, completed } = await req.json();

    const { data, error } = await supabase
      .from("grounding_sessions")
      .insert({
        user_id: user.id,
        see_items: see_items || [],
        feel_items: feel_items || [],
        hear_items: hear_items || [],
        smell_items: smell_items || [],
        taste_items: taste_items || [],
        completed: completed || false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error("Grounding session error:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}

// GET - Fetch user's grounding history
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("grounding_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessions: data });
  } catch (error) {
    console.error("Grounding fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
