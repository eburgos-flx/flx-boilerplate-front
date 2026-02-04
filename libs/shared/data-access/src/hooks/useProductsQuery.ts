import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosInstance, AxiosError } from "axios";
import { productsApi } from "../api/products.api";
import type {
  ProductsResponse,
  ProductsQueryParams,
} from "../types/product.types";

export const useProductsQuery = (
  client: AxiosInstance,
  params?: ProductsQueryParams,
  options?: Omit<
    UseQueryOptions<ProductsResponse, AxiosError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ProductsResponse, AxiosError>({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAll(client, params),
    ...options,
  });
};
