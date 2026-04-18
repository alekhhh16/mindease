import { NextResponse } from "next/server";

// In-memory stats storage (in production, use a database)
let userStats = {
  moodEntries: 0,
  journalEntries: 0,
  chatSessions: 0,
  meditationMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split("T")[0],
  badges: [] as string[],
  joinedDate: new Date().toISOString(),
};

// Badge definitions
const badges = [
  {
    id: "first_mood",
    name: "First Step",
    description: "Logged your first mood",
    condition: (stats: typeof userStats) => stats.moodEntries >= 1,
  },
  {
    id: "mood_tracker",
    name: "Mood Tracker",
    description: "Logged 10 moods",
    condition: (stats: typeof userStats) => stats.moodEntries >= 10,
  },
  {
    id: "journal_starter",
    name: "Journal Starter",
    description: "Wrote your first journal entry",
    condition: (stats: typeof userStats) => stats.journalEntries >= 1,
  },
  {
    id: "journal_regular",
    name: "Regular Writer",
    description: "Wrote 7 journal entries",
    condition: (stats: typeof userStats) => stats.journalEntries >= 7,
  },
  {
    id: "chat_friend",
    name: "Chat Friend",
    description: "Had 5 chat sessions with Mira",
    condition: (stats: typeof userStats) => stats.chatSessions >= 5,
  },
  {
    id: "streak_3",
    name: "3 Day Streak",
    description: "Used the app 3 days in a row",
    condition: (stats: typeof userStats) => stats.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "7 day streak achieved",
    condition: (stats: typeof userStats) => stats.currentStreak >= 7,
  },
  {
    id: "meditation_5",
    name: "Mindful Start",
    description: "5 minutes of meditation",
    condition: (stats: typeof userStats) => stats.meditationMinutes >= 5,
  },
  {
    id: "meditation_30",
    name: "Meditation Master",
    description: "30 minutes of meditation",
    condition: (stats: typeof userStats) => stats.meditationMinutes >= 30,
  },
];

function checkAndAwardBadges() {
  const newBadges: string[] = [];
  
  badges.forEach((badge) => {
    if (!userStats.badges.includes(badge.id) && badge.condition(userStats)) {
      userStats.badges.push(badge.id);
      newBadges.push(badge.id);
    }
  });
  
  return newBadges;
}

function updateStreak() {
  const today = new Date().toISOString().split("T")[0];
  const lastActive = userStats.lastActiveDate;
  
  if (lastActive === today) {
    // Already active today
    return;
  }
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    // Consecutive day
    userStats.currentStreak += 1;
    if (userStats.currentStreak > userStats.longestStreak) {
      userStats.longestStreak = userStats.currentStreak;
    }
  } else if (diffDays > 1) {
    // Streak broken
    userStats.currentStreak = 1;
  }
  
  userStats.lastActiveDate = today;
}

export async function GET() {
  // Calculate earned badges
  const earnedBadges = badges
    .filter((b) => userStats.badges.includes(b.id))
    .map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
    }));

  return NextResponse.json({
    ...userStats,
    earnedBadges,
    totalBadges: badges.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, value } = body;
    
    updateStreak();
    
    switch (action) {
      case "mood_logged":
        userStats.moodEntries += 1;
        break;
      case "journal_added":
        userStats.journalEntries += 1;
        break;
      case "chat_session":
        userStats.chatSessions += 1;
        break;
      case "meditation_completed":
        userStats.meditationMinutes += value || 5;
        break;
      default:
        break;
    }
    
    const newBadges = checkAndAwardBadges();
    
    return NextResponse.json({
      success: true,
      stats: userStats,
      newBadges: newBadges.map((id) => badges.find((b) => b.id === id)),
    });
  } catch (error) {
    console.error("Error updating stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
