import type { AxiosInstance } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  User,
} from "../types/auth.types";

export const authApi = {
  login: async (
    client: AxiosInstance,
    data: LoginRequest
  ): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  getMe: async (client: AxiosInstance): Promise<User> => {
    const response = await client.get<User>("/auth/me");
    return response.data;
  },

  refreshToken: async (
    client: AxiosInstance,
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> => {
    const response = await client.post<{
      token: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken, expiresInMins: 30 });
    return response.data;
  },
};
