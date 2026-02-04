import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosInstance, AxiosError } from "axios";
import { authApi } from "../api/auth.api";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const useLogin = (
  client: AxiosInstance,
  options?: Omit<
    UseMutationOptions<LoginResponse, AxiosError, LoginRequest>,
    "mutationFn"
  >,
) => {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: (data) => authApi.login(client, data),
    ...options,
  });
};
