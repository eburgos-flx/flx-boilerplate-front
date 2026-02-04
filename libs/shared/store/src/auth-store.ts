import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { universalStorage } from "./storage";

export interface User {
  id: string;
  email: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  image?: string;
  username?: string;
  gender?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const createAuthStore = () =>
  createStore<AuthState>()(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoggedIn: false,
        setUser: (user) => set({ user, isLoggedIn: !!user }),
        setToken: (token) => set({ token }),
        logout: () => set({ user: null, token: null, isLoggedIn: false }),
        clearAuth: () => set({ user: null, token: null, isLoggedIn: false }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => universalStorage),
      },
    ),
  );

export const authStore = createAuthStore();
