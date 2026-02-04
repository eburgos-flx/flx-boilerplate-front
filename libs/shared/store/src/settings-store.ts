import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { universalStorage } from "./storage";

export type Theme = "light" | "dark";

export interface SettingsState {
  theme: Theme;
  language: string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  setPreference: (key: string, value: unknown) => void;
}

const defaultState = {
  theme: "light" as Theme,
  language: "en",
};

export const createSettingsStore = (initial = defaultState) =>
  createStore<SettingsState>()(
    persist(
      (set) => ({
        ...initial,
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setPreference: (key, value) =>
          set((state) => ({ ...state, [key]: value })),
      }),
      {
        name: "settings-storage",
        storage: createJSONStorage(() => universalStorage),
      },
    ),
  );

export const settingsStore = createSettingsStore();
