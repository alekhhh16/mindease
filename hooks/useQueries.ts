"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MoodEntry, UserStats } from "@/types";

export function useMoodEntries(userId: string) {
  return useQuery<MoodEntry[]>({
    queryKey: ["mood_entries", userId],
    queryFn: async () => {
      const res = await fetch(`/api/mood?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch mood entries");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserStats(userId: string) {
  return useQuery<UserStats>({
    queryKey: ["user_stats", userId],
    queryFn: async () => {
      const res = await fetch(`/api/mood?userId=${userId}&type=stats`);
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useLatestMoodEntry(userId: string) {
  return useQuery<MoodEntry | null>({
    queryKey: ["latest_mood", userId],
    queryFn: async () => {
      const res = await fetch(`/api/mood?userId=${userId}&type=latest`);
      if (!res.ok) throw new Error("Failed to fetch latest mood");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useAddMoodEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      userId: string;
      moodScore: number;
      emoji: string;
      note: string | null;
    }) => {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!res.ok) throw new Error("Failed to add mood entry");
      return res.json();
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["mood_entries", vars.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["user_stats", vars.userId] });
      queryClient.invalidateQueries({ queryKey: ["latest_mood", vars.userId] });
    },
  });
}
