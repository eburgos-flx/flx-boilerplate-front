import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export interface CreateApiClientOptions {
  baseURL: string;
  getHeaders?: () => Record<string, string>;
  onResponseError?: (status: number) => void;
}

/**
 * Creates an Axios instance with request interceptors for auth (e.g. JWT) and optional response error handling.
 * Apps inject getHeaders (e.g. reading token from auth store) so data-access stays decoupled from the store.
 */
export function createApiClient(
  options: CreateApiClientOptions
): AxiosInstance {
  const { baseURL, getHeaders, onResponseError } = options;
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const headers = getHeaders?.() ?? {};
    Object.entries(headers).forEach(([key, value]) => {
      config.headers.set(key, value);
    });
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status != null && onResponseError) {
        onResponseError(status);
      }
      return Promise.reject(error);
    }
  );

  return client;
}
