# @flx-front/shared-store

Stores de Zustand compartidos entre web y mobile con persistencia multiplataforma.

## Características

- ✅ **Persistencia universal**: Funciona en web (localStorage) y React Native (AsyncStorage)
- ✅ **Type-safe**: Totalmente tipado con TypeScript
- ✅ **Vanilla stores**: Pueden usarse fuera de React
- ✅ **Hidratación automática**: Los datos se restauran al iniciar la app

## Stores disponibles

### Auth Store

Maneja autenticación y sesión del usuario.

```typescript
import { authStore } from "@flx-front/shared-store";

// Obtener estado actual
const token = authStore.getState().token;
const user = authStore.getState().user;
const isLoggedIn = authStore.getState().isLoggedIn;

// Acciones
authStore.getState().setToken("jwt-token");
authStore.getState().setUser({ id: "1", email: "user@example.com" });
authStore.getState().logout();
```

### Settings Store

Maneja configuración de tema y lenguaje.

```typescript
import { settingsStore } from "@flx-front/shared-store";

// Obtener estado actual
const theme = settingsStore.getState().theme;
const language = settingsStore.getState().language;

// Acciones
settingsStore.getState().setTheme("dark");
settingsStore.getState().setLanguage("es");
```

## Uso en React (Web)

```tsx
import { useStore } from "zustand";
import { authStore } from "@flx-front/shared-store";

function MyComponent() {
  const user = useStore(authStore, (state) => state.user);
  const logout = useStore(authStore, (state) => state.logout);

  return (
    <div>
      <p>Usuario: {user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

## Uso en React Native (Mobile)

**Importante**: Para mobile, debes instalar AsyncStorage:

```bash
npx expo install @react-native-async-storage/async-storage
```

Uso en componentes:

```tsx
import { useStore } from "zustand";
import { authStore } from "@flx-front/shared-store";
import { Text, Button } from "react-native";

function MyScreen() {
  const user = useStore(authStore, (state) => state.user);
  const logout = useStore(authStore, (state) => state.logout);

  return (
    <>
      <Text>Usuario: {user?.email}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </>
  );
}
```

## Storage multiplataforma

El módulo `storage.ts` proporciona un adaptador que detecta automáticamente el entorno:

- **Web**: Usa `localStorage`
- **React Native**: Usa `@react-native-async-storage/async-storage`
- **Fallback**: Almacenamiento en memoria (SSR u otros entornos)

No necesitas configurar nada, funciona automáticamente en ambas plataformas.

## Persistencia

Ambos stores usan `persist` de Zustand:

- **auth-storage**: Persiste token y usuario
- **settings-storage**: Persiste tema y lenguaje

Los datos se guardan automáticamente y se restauran al iniciar la aplicación.

## Desarrollo

Este es un vanilla Zustand store, no depende de React. Puedes usarlo en:

- Componentes React (web)
- Componentes React Native (mobile)
- Funciones utilitarias
- API clients
- Middleware

## Ejemplo: Integración con API client

```typescript
import { authStore } from "@flx-front/shared-store";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

// Interceptor para agregar JWT en cada request
apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para limpiar sesión si hay error 401
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
