"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { JournalEntry } from "@/types";

export function useJournalEntries(userId: string = "default") {
  return useQuery<JournalEntry[]>({
    queryKey: ["journal_entries", userId],
    queryFn: async () => {
      const res = await fetch(`/api/journal?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch journal entries");
      return res.json();
    },
  });
}

export function useAddJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { userId?: string; content: string }) => {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!res.ok) throw new Error("Failed to add journal entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries"] });
    },
  });
}

export function useDailyQuote() {
  return useQuery<string>({
    queryKey: ["daily_quote"],
    queryFn: async () => {
      const res = await fetch("/api/quote");
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      return data.quote;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
