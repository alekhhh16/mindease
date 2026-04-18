import { create } from "zustand";

interface AppState {
  stressReliefOpen: boolean;
  setStressReliefOpen: (open: boolean) => void;

  currentMood: number | null;
  setCurrentMood: (mood: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  stressReliefOpen: false,
  setStressReliefOpen: (open) => set({ stressReliefOpen: open }),

  currentMood: null,
  setCurrentMood: (mood) => set({ currentMood: mood }),
}));
