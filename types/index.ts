export interface MoodEntry {
  id: string;
  userId: string;
  moodScore: number;
  emoji: string;
  note?: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  timestamp: number;
}

export interface UserStats {
  badges: string[];
  currentStreak: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
