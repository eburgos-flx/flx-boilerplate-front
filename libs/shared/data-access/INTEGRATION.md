# Integración de Data Access en las Apps

## Configuración en App Web (React + Vite)

### 1. Crear el cliente API

Crea un archivo `src/lib/api-client.ts`:

```tsx
import { createApiClient } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  getHeaders: () => {
    const token = authStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  onResponseError: (status) => {
    if (status === 401) {
      authStore.getState().logout();
      window.location.href = "/login";
    }
  },
});
```

### 2. Configurar QueryProvider

En `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@flx-front/shared/data-access";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);
```

### 3. Usar en componentes

```tsx
// src/pages/Login.tsx
import { useState } from "react";
import { useLogin } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";
import { apiClient } from "../lib/api-client";

export function LoginPage() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const loginMutation = useLogin(apiClient, {
    onSuccess: (data) => {
      authStore.getState().setToken(data.token);
      authStore.getState().setUser({
        id: data.id.toString(),
        email: data.email,
        roles: [],
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      {loginMutation.error && <p>Error: {loginMutation.error.message}</p>}
    </form>
  );
}
```

```tsx
// src/pages/Products.tsx
import { useProductsQuery } from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";

export function ProductsPage() {
  const { data, isLoading, error } = useProductsQuery(apiClient, {
    limit: 20,
    skip: 0,
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Products ({data?.total})</h1>
      <div className="grid">
        {data?.products.map((product) => (
          <div key={product.id} className="card">
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Configuración en App Mobile (Expo)

### 1. Crear el cliente API

Crea un archivo `app/lib/api-client.ts`:

```tsx
import { createApiClient } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";
import Constants from "expo-constants";

export const apiClient = createApiClient({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "https://dummyjson.com",
  getHeaders: () => {
    const token = authStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  onResponseError: (status) => {
    if (status === 401) {
      authStore.getState().logout();
      // Navigate to login screen
    }
  },
});
```

### 2. Configurar QueryProvider

En `app/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
import { QueryProvider } from "@flx-front/shared/data-access";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="products" options={{ title: "Products" }} />
      </Stack>
    </QueryProvider>
  );
}
```

### 3. Usar en pantallas

```tsx
// app/login.tsx
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useLogin } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";
import { apiClient } from "./lib/api-client";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const router = useRouter();

  const loginMutation = useLogin(apiClient, {
    onSuccess: (data) => {
      authStore.getState().setToken(data.token);
      authStore.getState().setUser({
        id: data.id.toString(),
        email: data.email,
        roles: [],
      });
      router.push("/products");
    },
  });

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        title={loginMutation.isPending ? "Logging in..." : "Login"}
        onPress={() => loginMutation.mutate({ username, password })}
        disabled={loginMutation.isPending}
      />
      {loginMutation.error && <Text>Error: {loginMutation.error.message}</Text>}
    </View>
  );
}
```

## Resumen

✅ **Cliente Axios configurado** con interceptores para JWT
✅ **React Query** integrado con QueryProvider
✅ **Hooks tipados** para todas las operaciones
✅ **Invalidación automática** de queries después de mutations
✅ **Misma API** para web y mobile
✅ **DummyJSON** como API de demostración funcional

### Credenciales de prueba:

- Username: `emilys`
- Password: `emilyspass`

### Endpoints disponibles:

- `POST /auth/login` - Login
- `GET /auth/me` - Usuario actual (requiere token)
- `GET /products` - Lista de productos
- `GET /products/:id` - Detalle de producto
- `POST /products/add` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

Ver más en: https://dummyjson.com/docs
