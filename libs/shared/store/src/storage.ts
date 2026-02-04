import { StateStorage } from "zustand/middleware";

/**
 * Storage adapter that works in both web and React Native.
 * - Web: uses localStorage
 * - React Native: uses AsyncStorage (must be imported dynamically)
 */
function createUniversalStorage(): StateStorage {
  // Check if we're in a browser environment
  if (typeof window !== "undefined" && window.localStorage) {
    return {
      getItem: (name: string) => {
        const value = localStorage.getItem(name);
        return value ?? null;
      },
      setItem: (name: string, value: string) => {
        localStorage.setItem(name, value);
      },
      removeItem: (name: string) => {
        localStorage.removeItem(name);
      },
    };
  }

  // React Native environment - AsyncStorage will be loaded dynamically
  let AsyncStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  } | null = null;

  // Try to load AsyncStorage
  try {
    // In React Native, this will work (dynamic require for conditional loading)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  } catch {
    // Not in React Native, use fallback
  }

  if (AsyncStorage) {
    return {
      getItem: async (name: string) => {
        try {
          const value = await AsyncStorage.getItem(name);
          return value ?? null;
        } catch {
          return null;
        }
      },
      setItem: async (name: string, value: string) => {
        try {
          await AsyncStorage.setItem(name, value);
        } catch {
          // Ignore errors
        }
      },
      removeItem: async (name: string) => {
        try {
          await AsyncStorage.removeItem(name);
        } catch {
          // Ignore errors
        }
      },
    };
  }

  // Fallback in-memory storage (for SSR or other environments)
  const storage = new Map<string, string>();
  return {
    getItem: (name: string) => {
      return storage.get(name) ?? null;
    },
    setItem: (name: string, value: string) => {
      storage.set(name, value);
    },
    removeItem: (name: string) => {
      storage.delete(name);
    },
  };
}

export const universalStorage = createUniversalStorage();
