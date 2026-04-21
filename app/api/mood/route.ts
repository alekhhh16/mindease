import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "30");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return empty data for unauthenticated users (guest mode)
    if (type === "stats") {
      return NextResponse.json({ badges: [], currentStreak: 0 });
    }
    if (type === "latest") {
      return NextResponse.json(null);
    }
    return NextResponse.json([]);
  }

  const { data: entries, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform to match frontend expected format
  const transformed = entries.map((entry) => ({
    id: entry.id,
    userId: entry.user_id,
    moodScore: entry.mood_score,
    emoji: getMoodEmoji(entry.mood_score),
    note: entry.note,
    timestamp: new Date(entry.created_at).getTime(),
  }));

  if (type === "stats") {
    return NextResponse.json(calculateStats(transformed));
  }

  if (type === "latest") {
    return NextResponse.json(transformed[0] || null);
  }

  return NextResponse.json(transformed);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { moodScore, note } = body;

  if (!moodScore || moodScore < 1 || moodScore > 5) {
    return NextResponse.json(
      { error: "Valid mood score (1-5) required" },
      { status: 400 }
    );
  }

  const { data: entry, error } = await supabase
    .from("mood_entries")
    .insert({
      user_id: user.id,
      mood_score: moodScore,
      note: note || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: entry.id,
    userId: entry.user_id,
    moodScore: entry.mood_score,
    emoji: getMoodEmoji(entry.mood_score),
    note: entry.note,
    timestamp: new Date(entry.created_at).getTime(),
  });
}

function getMoodEmoji(score: number): string {
  const emojis: Record<number, string> = {
    1: "😢",
    2: "😕",
    3: "😐",
    4: "🙂",
    5: "😊",
  };
  return emojis[score] || "😐";
}

interface MoodEntryTransformed {
  timestamp: number;
}

function calculateStats(entries: MoodEntryTransformed[]) {
  const badges: string[] = [];

  if (entries.length >= 1) badges.push("first_entry");
  if (entries.length >= 10) badges.push("10_entries");

  // Calculate streak
  const dates = [
    ...new Set(entries.map((e) => new Date(e.timestamp).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;

  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date(Date.now() - i * 86_400_000).toDateString();
    if (dates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 3) badges.push("3_day_streak");
  if (streak >= 7) badges.push("7_day_streak");
  if (streak >= 30) badges.push("30_day_streak");

  return { badges, currentStreak: streak };
}
