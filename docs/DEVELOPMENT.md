# 💻 Guía de Desarrollo

Esta guía cubre el workflow de desarrollo diario y las mejores prácticas.

## 🎯 Workflow diario

### 1. Iniciar el día

```bash
# 1. Actualizar desde main
git checkout main
git pull origin main

# 2. Crear/cambiar a tu branch
git checkout -b feature/nombre-feature
# o
git checkout feature/nombre-feature

# 3. Actualizar dependencias si hay cambios
pnpm install

# 4. Iniciar servidor de desarrollo
pnpm dev:web
# o
pnpm dev:mobile
```

### 2. Durante desarrollo

```bash
# Terminal 1: Servidor de desarrollo
pnpm dev:web

# Terminal 2: Tests en watch mode
pnpm test:watch

# Terminal 3: Lint automático
# VS Code hace esto automáticamente con las extensiones
```

### 3. Antes de commit

```bash
# 1. Lint y fix
pnpm lint:fix

# 2. Ejecutar tests
pnpm test

# 3. Build local para verificar
pnpm build:web

# 4. Verificar archivos modificados
git status

# 5. Commit
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-feature
```

---

## 📂 Estructura y organización

### Librerías compartidas

```
libs/
├── shared/
│   ├── data-access/    # API + React Query
│   ├── store/          # Zustand stores
│   └── util/           # Utilidades puras
└── ui/                 # Componentes UI
    ├── web/            # Componentes web
    └── mobile/         # Componentes mobile
```

### Apps

```
apps/
├── web/
│   ├── src/
│   │   ├── pages/      # Páginas (cada archivo = ruta)
│   │   ├── lib/        # Configuración específica
│   │   ├── App.tsx     # Router
│   │   └── main.tsx    # Entry point
│   └── vite.config.ts
└── mobile/
    ├── app/            # Expo Router (file-based)
    └── app.json        # Config Expo
```

---

## 🔧 Comandos útiles de Nx

### Ver proyectos

```bash
# Listar todos los proyectos
pnpm nx show projects

# Ver dependencias de un proyecto
pnpm nx graph

# Ver solo proyectos afectados por cambios
pnpm nx affected:graph
```

### Ejecutar tasks

```bash
# Ejecutar task en proyecto específico
pnpm nx run <proyecto>:<task>

# Ejemplos:
pnpm nx run web:dev
pnpm nx run web:build
pnpm nx run shared-data-access:test

# Ejecutar en múltiples proyectos
pnpm nx run-many -t <task>

# Ejemplos:
pnpm nx run-many -t build
pnpm nx run-many -t test
pnpm nx run-many -t lint

# Solo en proyectos afectados
pnpm nx affected -t test
pnpm nx affected -t build
```

### Caché

```bash
# Ver información de caché
pnpm nx show cache

# Limpiar caché local
pnpm nx reset

# Ejecutar sin caché
pnpm nx run web:build --skip-nx-cache
```

---

## 🎨 Desarrollo de UI

### Web (Tailwind v4)

```tsx
// Ejemplo de componente web
import { Button, Card } from "@flx-front/ui-web";

export function MyPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">Título</h1>
      <Button variant="primary">Acción</Button>
    </Card>
  );
}
```

**Clases Tailwind disponibles:**

- Layout: `container`, `flex`, `grid`, `hidden`, `block`
- Spacing: `p-*`, `m-*`, `gap-*`, `space-*`
- Typography: `text-*`, `font-*`, `leading-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Effects: `shadow-*`, `rounded-*`, `opacity-*`
- Responsive: `sm:*`, `md:*`, `lg:*`, `xl:*`
- Gradients: `bg-linear-to-*` (v4 syntax)

**Custom config en index.css:**

```css
@import "tailwindcss";

/* Escanear libs para clases */
@source "../../../libs/ui/src/**/*.{ts,tsx}";
@source "../../../libs/shared/*/src/**/*.{ts,tsx}";
@source "./**/*.{ts,tsx}";

/* Custom theme (opcional) */
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

### Mobile (NativeWind v5)

```tsx
// Ejemplo de componente mobile (por implementar)
import { View, Text, Pressable } from "react-native";

export function MyScreen() {
  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold mb-4">Título</Text>
      <Pressable className="px-4 py-2 bg-blue-600 rounded-lg">
        <Text className="text-white">Acción</Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔌 Uso de la API

### Consumir hooks existentes

```tsx
import {
  useProductsQuery,
  useProductQuery,
} from "@flx-front/shared/data-access";
import { apiClient } from "../lib/api-client";

export function ProductsPage() {
  // Listar productos
  const { data, isLoading, error } = useProductsQuery(apiClient, {
    limit: 10,
    skip: 0,
  });

  // Producto individual
  const { data: product } = useProductQuery(apiClient, productId);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {data?.products.map((product) => (
        <Card key={product.id}>{product.title}</Card>
      ))}
    </div>
  );
}
```

### Crear nuevos hooks

```tsx
// libs/shared/data-access/src/api/new-resource.api.ts
import { AxiosInstance } from "axios";

export async function getResource(client: AxiosInstance, id: number) {
  const response = await client.get(`/resource/${id}`);
  return response.data;
}

// libs/shared/data-access/src/hooks/useResource.ts
import { useQuery } from "@tanstack/react-query";
import { getResource } from "../api/new-resource.api";

export function useResource(client: AxiosInstance, id: number) {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResource(client, id),
  });
}
```

---

## 🗄️ Uso de stores

### Auth store

```tsx
import { useStore } from "zustand";
import { authStore } from "@flx-front/shared/store";

function MyComponent() {
  // Leer estado
  const user = useStore(authStore, (state) => state.user);
  const isLoggedIn = useStore(authStore, (state) => state.isLoggedIn);

  // Acciones
  const logout = useStore(authStore, (state) => state.logout);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Hola, {user?.firstName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
```

### Settings store

```tsx
import { useStore } from "zustand";
import { settingsStore } from "@flx-front/shared/store";

function ThemeToggle() {
  const theme = useStore(settingsStore, (state) => state.theme);
  const setTheme = useStore(settingsStore, (state) => state.setTheme);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle theme: {theme}
    </button>
  );
}
```

---

## 🧪 Testing

### Unit tests (Vitest)

```tsx
// Component.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText("Click").click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Tests con React Query

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useProductsQuery } from "./useProductsQuery";

describe("useProductsQuery", () => {
  it("fetches products", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useProductsQuery(mockClient, { limit: 10 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toHaveLength(10);
  });
});
```

---

## 🐛 Debugging

### Web

```tsx
// Usar React Query Devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Chrome DevTools:**

- Sources > Breakpoints
- Console > Logs
- Network > XHR/Fetch requests
- Application > Storage (localStorage)

### Mobile

```tsx
// Console logs en terminal
console.log('Debug:', data);

// React Native Debugger (opcional)
# Instalar: brew install --cask react-native-debugger

// Flipper (opcional)
# Incluido con React Native, abrir desde Android Studio o Xcode
```

**Expo Dev Tools:**

- Shake device > Show Dev Menu
- Enable Fast Refresh
- Enable Performance Monitor

---

## 📦 Agregar dependencias

### Dependencias de producción

```bash
# Web y mobile
pnpm add nombre-paquete

# Solo web
pnpm add nombre-paquete -w --filter web

# Solo mobile
pnpm add nombre-paquete -w --filter mobile
```

### Dependencias de desarrollo

```bash
pnpm add -D nombre-paquete
```

### Actualizar dependencias

```bash
# Ver outdated
pnpm outdated

# Actualizar todas (cuidado)
pnpm update

# Actualizar una específica
pnpm update nombre-paquete

# Actualizar a última versión (breaking changes)
pnpm update nombre-paquete --latest
```

---

## 🔄 Hot Reload y Fast Refresh

### Web (Vite HMR)

- **Automático**: Cambios en componentes se reflejan instantáneamente
- **Preserva estado**: useState, useReducer se mantienen
- **Fallback**: Si HMR falla, recarga completa

**Forzar recarga:**

```tsx
// Agregar este comentario para forzar HMR
// @refresh reset
```

### Mobile (Fast Refresh)

- **Automático**: Guardar archivo refresca app
- **Preserva navegación**: No vuelve a home
- **Shake menu**: Shake device para debugging

**Deshabilitar temporalmente:**

```bash
# En terminal de Metro, presiona:
r  # Reload app
d  # Open dev menu
```

---

## 🎯 Mejores prácticas

### Estructura de archivos

```
✅ Bueno:
feature/
├── components/
│   ├── feature-list.tsx
│   └── feature-item.tsx
├── hooks/
│   └── use-feature.ts
├── types/
│   └── feature.types.ts
└── index.tsx

❌ Malo:
feature.tsx
featureComponent.tsx
feature-utils.tsx
```

### Nombres de archivos

```
✅ Bueno:
user-profile.tsx
use-auth.ts
auth.types.ts
api-client.ts

❌ Malo:
UserProfile.tsx
useAuth.ts
AuthTypes.ts
apiClient.ts
```

### Imports

```tsx
// ✅ Bueno: Path aliases
import { Button } from "@flx-front/ui-web";
import { authStore } from "@flx-front/shared/store";

// ❌ Malo: Rutas relativas largas
import { Button } from "../../../libs/ui/src/web/components/button";
```

### Componentes

```tsx
// ✅ Bueno: Props tipadas, export named
export interface ButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({ variant = "primary", children }: ButtonProps) {
  return <button className={styles[variant]}>{children}</button>;
}

// ❌ Malo: Props sin tipar, export default
export default function Button(props) {
  return <button>{props.children}</button>;
}
```

### Hooks

```tsx
// ✅ Bueno: Hooks reutilizables, tipados
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // ...
  return debouncedValue;
}

// ❌ Malo: Lógica en componentes
function MyComponent() {
  const [value, setValue] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      // debounce logic inline
    }, 500);
    return () => clearTimeout(timeout);
  }, [value]);
}
```

---

## 📚 Recursos

- [Nx Docs](https://nx.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Expo Docs](https://docs.expo.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)

---

**¡Happy coding! 🚀**
