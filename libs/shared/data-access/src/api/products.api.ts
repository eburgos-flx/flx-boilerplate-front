import type { AxiosInstance } from "axios";
import type {
  Product,
  ProductsResponse,
  ProductsQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product.types";

export const productsApi = {
  getAll: async (
    client: AxiosInstance,
    params?: ProductsQueryParams,
  ): Promise<ProductsResponse> => {
    const response = await client.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  getById: async (client: AxiosInstance, id: number): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

  search: async (
    client: AxiosInstance,
    query: string,
  ): Promise<ProductsResponse> => {
    const response = await client.get<ProductsResponse>(
      `/products/search?q=${query}`,
    );
    return response.data;
  },

  create: async (
    client: AxiosInstance,
    data: CreateProductRequest,
  ): Promise<Product> => {
    const response = await client.post<Product>("/products/add", data);
    return response.data;
  },

  update: async (
    client: AxiosInstance,
    id: number,
    data: UpdateProductRequest,
  ): Promise<Product> => {
    const response = await client.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (client: AxiosInstance, id: number): Promise<Product> => {
    const response = await client.delete<Product>(`/products/${id}`);
    return response.data;
  },
};
