# 🔌 API Integration - Integración con API

Guía completa para trabajar con la capa de datos del proyecto.

## 📊 Arquitectura de datos

```
┌─────────────────────────────────────────┐
│          UI Components/Pages            │
│  (apps/web/src | apps/mobile/app)      │
└───────────────┬─────────────────────────┘
                │ useQuery, useMutation
┌───────────────▼─────────────────────────┐
│        React Query Hooks                │
│  (libs/shared/data-access/src/hooks)   │
└───────────────┬─────────────────────────┘
                │ apiClient.get/post/put/delete
┌───────────────▼─────────────────────────┐
│           API Functions                 │
│  (libs/shared/data-access/src/api)     │
└───────────────┬─────────────────────────┘
                │ axios instance with interceptors
┌───────────────▼─────────────────────────┐
│           API Client                    │
│  (apps/web/src/lib/api-client.ts)      │
└───────────────┬─────────────────────────┘
                │ HTTP requests with JWT
┌───────────────▼─────────────────────────┐
│          DummyJSON API                  │
│      https://dummyjson.com              │
└─────────────────────────────────────────┘
```

---

## 🔧 Configuración del API Client

### Web

```typescript
// apps/web/src/lib/api-client.ts
import axios from "axios";
import { authStore } from "@flx-front/shared/store";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Agregar JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
```

### Mobile

```typescript
// apps/mobile/src/lib/api-client.ts (por implementar)
import axios from "axios";
import Constants from "expo-constants";
import { authStore } from "@flx-front/shared/store";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "https://dummyjson.com";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors idénticos a web
```

---

## 📡 API Functions

### Estructura

```
libs/shared/data-access/src/
├── api/
│   ├── auth.api.ts          # Login, register, refresh
│   ├── products.api.ts      # CRUD productos
│   └── users.api.ts         # User profile, update
├── hooks/
│   ├── useLogin.ts          # Mutation para login
│   ├── useProductsQuery.ts  # Query para listar productos
│   └── useProductQuery.ts   # Query para un producto
└── types/
    ├── auth.types.ts        # LoginRequest, AuthResponse
    ├── product.types.ts     # Product, ProductsResponse
    └── user.types.ts        # User, UserProfile
```

### Crear nueva API function

```typescript
// libs/shared/data-access/src/api/resource.api.ts
import { AxiosInstance } from "axios";
import { Resource, ResourcesResponse } from "../types/resource.types";

/**
 * Obtener listado de recursos
 */
export async function getResources(
  client: AxiosInstance,
  params: {
    limit?: number;
    skip?: number;
    search?: string;
  },
): Promise<ResourcesResponse> {
  const { data } = await client.get<ResourcesResponse>("/resources", {
    params,
  });
  return data;
}

/**
 * Obtener recurso por ID
 */
export async function getResource(
  client: AxiosInstance,
  id: number,
): Promise<Resource> {
  const { data } = await client.get<Resource>(`/resources/${id}`);
  return data;
}

/**
 * Crear nuevo recurso
 */
export async function createResource(
  client: AxiosInstance,
  payload: Partial<Resource>,
): Promise<Resource> {
  const { data } = await client.post<Resource>("/resources", payload);
  return data;
}

/**
 * Actualizar recurso existente
 */
export async function updateResource(
  client: AxiosInstance,
  id: number,
  payload: Partial<Resource>,
): Promise<Resource> {
  const { data } = await client.put<Resource>(`/resources/${id}`, payload);
  return data;
}

/**
 * Eliminar recurso
 */
export async function deleteResource(
  client: AxiosInstance,
  id: number,
): Promise<void> {
  await client.delete(`/resources/${id}`);
}
```

---

## 🎣 React Query Hooks

### Query Hooks (GET)

```typescript
// libs/shared/data-access/src/hooks/useResourcesQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { getResources } from "../api/resource.api";
import { ResourcesResponse } from "../types/resource.types";

export function useResourcesQuery(
  client: AxiosInstance,
  params: {
    limit?: number;
    skip?: number;
    search?: string;
  },
  options?: UseQueryOptions<ResourcesResponse>,
) {
  return useQuery({
    queryKey: ["resources", params],
    queryFn: () => getResources(client, params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}
```

```typescript
// libs/shared/data-access/src/hooks/useResourceQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { getResource } from "../api/resource.api";
import { Resource } from "../types/resource.types";

export function useResourceQuery(
  client: AxiosInstance,
  id: number,
  options?: UseQueryOptions<Resource>,
) {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResource(client, id),
    enabled: !!id, // Solo ejecutar si id existe
    staleTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}
```

### Mutation Hooks (POST, PUT, DELETE)

```typescript
// libs/shared/data-access/src/hooks/useCreateResource.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createResource } from "../api/resource.api";
import { Resource } from "../types/resource.types";

export function useCreateResource(client: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Resource>) => createResource(client, payload),
    onSuccess: () => {
      // Invalidar caché de listado para refetch
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
```

```typescript
// libs/shared/data-access/src/hooks/useUpdateResource.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { updateResource } from "../api/resource.api";
import { Resource } from "../types/resource.types";

export function useUpdateResource(client: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Resource> }) =>
      updateResource(client, id, payload),
    onSuccess: (data) => {
      // Invalidar caché específica
      queryClient.invalidateQueries({ queryKey: ["resource", data.id] });
      // Invalidar listado
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
```

```typescript
// libs/shared/data-access/src/hooks/useDeleteResource.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { deleteResource } from "../api/resource.api";

export function useDeleteResource(client: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteResource(client, id),
    onSuccess: (_, id) => {
      // Remover del caché
      queryClient.removeQueries({ queryKey: ["resource", id] });
      // Invalidar listado
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
```

---

## 💼 Uso en componentes

### Listado con paginación

```tsx
// apps/web/src/pages/resources.tsx
import { useState } from "react";
import { useResourcesQuery } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";
import { Loading, ErrorMessage } from "@flx-front/ui-web";

export function ResourcesPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, error, refetch } = useResourcesQuery(apiClient, {
    limit,
    skip: page * limit,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  return (
    <div>
      <h1>Resources ({data?.total})</h1>

      <div className="grid grid-cols-3 gap-4">
        {data?.resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data!.total / limit)}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Detalle con loading state

```tsx
// apps/web/src/pages/resource-detail.tsx
import { useParams } from "react-router-dom";
import { useResourceQuery } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const resourceId = Number(id);

  const { data, isLoading, error } = useResourceQuery(apiClient, resourceId);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return <div>Resource not found</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      {/* ... más campos */}
    </div>
  );
}
```

### Crear recurso con formulario

```tsx
// apps/web/src/pages/create-resource.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateResource } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";
import { Button, Input } from "@flx-front/ui-web";

export function CreateResourcePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useCreateResource(apiClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newResource = await createMutation.mutateAsync({
        title,
        description,
      });
      navigate(`/resources/${newResource.id}`);
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Resource</h1>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Button
        type="submit"
        isLoading={createMutation.isPending}
        disabled={createMutation.isPending}
      >
        Create
      </Button>

      {createMutation.isError && (
        <ErrorMessage message={createMutation.error.message} />
      )}
    </form>
  );
}
```

### Actualizar recurso

```tsx
// apps/web/src/pages/edit-resource.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useResourceQuery,
  useUpdateResource,
} from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";

export function EditResourcePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resourceId = Number(id);

  const { data, isLoading } = useResourceQuery(apiClient, resourceId);
  const updateMutation = useUpdateResource(apiClient);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: resourceId,
        payload: { title, description },
      });
      navigate(`/resources/${resourceId}`);
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Resource</h1>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button type="submit" isLoading={updateMutation.isPending}>
        Update
      </Button>
    </form>
  );
}
```

### Eliminar con confirmación

```tsx
// apps/web/src/components/resource-card.tsx
import { useState } from "react";
import { useDeleteResource } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";
import { Button, Modal } from "@flx-front/ui-web";

export function ResourceCard({ resource }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteMutation = useDeleteResource(apiClient);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(resource.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  return (
    <div className="card">
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>

      <Button variant="danger" onClick={() => setShowConfirm(true)}>
        Delete
      </Button>

      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete "{resource.title}"?</p>

          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Yes, Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
        </Modal>
      )}
    </div>
  );
}
```

---

## 🔄 Caché y sincronización

### Configurar React Query Client

```typescript
// apps/web/src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000,   // 10 minutos (antes cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### Invalidar caché manualmente

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidar queries específicas
    queryClient.invalidateQueries({ queryKey: ["resources"] });

    // Invalidar todas las queries
    queryClient.invalidateQueries();

    // Refetch activas
    queryClient.refetchQueries({ active: true });
  };
}
```

### Optimistic updates

```typescript
export function useUpdateResource(client: AxiosInstance) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Resource> }) =>
      updateResource(client, id, payload),

    // Actualización optimista
    onMutate: async ({ id, payload }) => {
      // Cancelar refetches en progreso
      await queryClient.cancelQueries({ queryKey: ["resource", id] });

      // Snapshot del valor anterior
      const previousResource = queryClient.getQueryData(["resource", id]);

      // Actualizar optimistamente
      queryClient.setQueryData(["resource", id], (old: Resource) => ({
        ...old,
        ...payload,
      }));

      // Retornar contexto para rollback
      return { previousResource };
    },

    // Rollback en error
    onError: (err, { id }, context) => {
      queryClient.setQueryData(["resource", id], context?.previousResource);
    },

    // Sincronizar después de success/error
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["resource", id] });
    },
  });
}
```

---

## 🔐 Autenticación

### Login flow

```typescript
// libs/shared/data-access/src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { login } from "../api/auth.api";
import { authStore } from "@flx-front/shared/store";

export function useLogin(client: AxiosInstance) {
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      login(client, credentials),
    onSuccess: (data) => {
      // Guardar token y user en store (persiste automáticamente)
      authStore.getState().setToken(data.accessToken);
      authStore.getState().setUser(data);
    },
  });
}
```

### Uso en componente

```tsx
// apps/web/src/pages/login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin(apiClient);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" isLoading={loginMutation.isPending}>
        Login
      </Button>

      {loginMutation.isError && <ErrorMessage message="Invalid credentials" />}
    </form>
  );
}
```

---

## 📚 Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Axios Docs](https://axios-http.com/docs/intro)
- [DummyJSON API](https://dummyjson.com/docs)

---

**¡Listo para consumir APIs! 🚀**
