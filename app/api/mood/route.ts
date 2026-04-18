import { NextRequest, NextResponse } from "next/server";
import type { MoodEntry, UserStats } from "@/types";

// In-memory storage (will be replaced with Supabase later)
const moodEntries: Map<string, MoodEntry[]> = new Map();

function getUserEntries(userId: string): MoodEntry[] {
  if (!moodEntries.has(userId)) {
    moodEntries.set(userId, []);
  }
  return moodEntries.get(userId)!;
}

function calculateStats(entries: MoodEntry[]): UserStats {
  const badges: string[] = [];
  
  if (entries.length >= 1) badges.push("first_entry");
  if (entries.length >= 10) badges.push("10_entries");
  
  // Calculate streak
  const dates = [...new Set(
    entries.map(e => new Date(e.timestamp).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  
  const entries = getUserEntries(userId);
  
  if (type === "stats") {
    return NextResponse.json(calculateStats(entries));
  }
  
  if (type === "latest") {
    const latest = entries[entries.length - 1] || null;
    return NextResponse.json(latest);
  }
  
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, moodScore, emoji, note } = body;
  
  if (!userId || moodScore === undefined || !emoji) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  const entry: MoodEntry = {
    id: crypto.randomUUID(),
    userId,
    moodScore: Number(moodScore),
    emoji,
    note: note || undefined,
    timestamp: Date.now(),
  };
  
  const entries = getUserEntries(userId);
  entries.push(entry);
  
  return NextResponse.json(entry);
}
