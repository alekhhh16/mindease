import { NextRequest, NextResponse } from "next/server";
import type { JournalEntry } from "@/types";

// In-memory storage (will be replaced with Supabase later)
const journalEntries: Map<string, JournalEntry[]> = new Map();

function getUserEntries(userId: string): JournalEntry[] {
  if (!journalEntries.has(userId)) {
    journalEntries.set(userId, []);
  }
  return journalEntries.get(userId)!;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "default";
  
  const entries = getUserEntries(userId);
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId = "default", content } = body;
  
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }
  
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    userId,
    content,
    timestamp: Date.now(),
  };
  
  const entries = getUserEntries(userId);
  entries.push(entry);
  
  return NextResponse.json(entry);
}
