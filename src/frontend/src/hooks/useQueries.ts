import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MoodEntry, UserStats } from "../backend";
import { createActor } from "../backend";

export function useMoodEntries(userId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MoodEntry[]>({
    queryKey: ["mood_entries", userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodEntries(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserStats(userId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserStats>({
    queryKey: ["user_stats", userId],
    queryFn: async () => {
      if (!actor) return { badges: [], currentStreak: BigInt(0) };
      return actor.getUserStats(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMoodEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      userId: string;
      moodScore: bigint;
      emoji: string;
      note: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMoodEntry(
        args.userId,
        args.moodScore,
        args.emoji,
        args.note,
      );
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["mood_entries", vars.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["user_stats", vars.userId] });
    },
  });
}
