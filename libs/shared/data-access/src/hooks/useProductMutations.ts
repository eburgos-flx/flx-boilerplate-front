import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosInstance, AxiosError } from "axios";
import { productsApi } from "../api/products.api";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product.types";

export const useCreateProduct = (
  client: AxiosInstance,
  options?: Omit<
    UseMutationOptions<Product, AxiosError, CreateProductRequest>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<Product, AxiosError, CreateProductRequest>({
    mutationFn: (data) => productsApi.create(client, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    ...options,
  });
};

export const useUpdateProduct = (
  client: AxiosInstance,
  options?: Omit<
    UseMutationOptions<
      Product,
      AxiosError,
      { id: number; data: UpdateProductRequest }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    AxiosError,
    { id: number; data: UpdateProductRequest }
  >({
    mutationFn: ({ id, data }) => productsApi.update(client, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
    ...options,
  });
};

export const useDeleteProduct = (
  client: AxiosInstance,
  options?: Omit<UseMutationOptions<Product, AxiosError, number>, "mutationFn">,
) => {
  const queryClient = useQueryClient();

  return useMutation<Product, AxiosError, number>({
    mutationFn: (id) => productsApi.delete(client, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    ...options,
  });
};
