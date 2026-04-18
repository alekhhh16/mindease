"use client";

import { useMutation } from "@tanstack/react-query";
import type { ChatMessage } from "@/types";

interface SendChatParams {
  messages: ChatMessage[];
  latestMood?: string | null;
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: async ({ messages, latestMood }: SendChatParams) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, latestMood }),
      });
      if (!res.ok) throw new Error("Failed to send chat message");
      const data = await res.json();
      return data.response as string;
    },
  });
}
