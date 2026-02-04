import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosInstance, AxiosError } from "axios";
import { productsApi } from "../api/products.api";
import type { Product } from "../types/product.types";

export const useProductQuery = (
  client: AxiosInstance,
  id: number,
  options?: Omit<UseQueryOptions<Product, AxiosError>, "queryKey" | "queryFn">,
) => {
  return useQuery<Product, AxiosError>({
    queryKey: ["products", id],
    queryFn: () => productsApi.getById(client, id),
    enabled: id > 0,
    ...options,
  });
};
