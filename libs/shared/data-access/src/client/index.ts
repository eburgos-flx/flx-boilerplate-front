/**
 * Shared API client (Axios + interceptors). TanStack Query wrappers (useQuery/useMutation) can be added per endpoint.
 * Apps create the client with createApiClient({ baseURL, getHeaders }) and pass getToken from auth store.
 */
export {
  createApiClient,
  type CreateApiClientOptions,
} from "./create-api-client";
