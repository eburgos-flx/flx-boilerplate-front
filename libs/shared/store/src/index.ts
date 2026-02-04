/**
 * Shared Zustand stores (auth, settings). Consumed by web and mobile apps.
 * Use useAuthStore / useSettingsStore from 'zustand' in React components.
 */
export {
  authStore,
  createAuthStore,
  type AuthState,
  type User,
} from "./auth-store";
export {
  settingsStore,
  createSettingsStore,
  type SettingsState,
  type Theme,
} from "./settings-store";
