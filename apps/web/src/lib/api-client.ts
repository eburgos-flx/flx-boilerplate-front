import { createApiClient } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  getHeaders: (): Record<string, string> => {
    const token = authStore.getState().token;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },
  onResponseError: (status) => {
    if (status === 401) {
      authStore.getState().logout();
      window.location.href = "/login";
    }
  },
});
