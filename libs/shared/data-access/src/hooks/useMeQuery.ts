import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosInstance, AxiosError } from "axios";
import { authApi } from "../api/auth.api";
import type { User } from "../types/auth.types";

export const useMeQuery = (
  client: AxiosInstance,
  options?: Omit<UseQueryOptions<User, AxiosError>, "queryKey" | "queryFn">,
) => {
  return useQuery<User, AxiosError>({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(client),
    ...options,
  });
};
