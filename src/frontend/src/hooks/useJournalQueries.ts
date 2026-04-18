import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { JournalEntry } from "../backend";
import { createActor } from "../backend";

export function useJournalEntries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<JournalEntry[]>({
    queryKey: ["journal_entries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJournalEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJournalEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addJournalEntry(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries"] });
    },
  });
}

export function useDailyQuote() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string>({
    queryKey: ["daily_quote"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getDailyQuote();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour — quotes are daily
  });
}
