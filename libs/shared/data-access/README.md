# Shared Data Access

Librería de consumo de APIs compartida por web y mobile, implementada según el documento de arquitectura del boilerplate.

## Estructura

```
src/
├── client/          # Cliente Axios configurado con interceptores
├── components/      # QueryProvider para React Query
├── types/           # Tipos TypeScript de la API
├── api/             # Funciones de API (Axios wrappers)
└── hooks/           # Hooks de React Query (useQuery/useMutation)
```

## API de Ejemplo: DummyJSON

Este boilerplate usa [DummyJSON](https://dummyjson.com/) como API de demostración, que incluye:

- ✅ Autenticación con JWT
- ✅ CRUD completo de productos
- ✅ Usuarios, posts, comentarios, todos, carritos, recetas
- ✅ Paginación y búsqueda

### Credenciales de prueba

```
username: emilys
password: emilyspass
```

Otros usuarios disponibles: https://dummyjson.com/users

## Uso

### 1. Configurar el cliente API

```tsx
import { createApiClient } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";

// En tu app (main.tsx o _layout.tsx)
const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  getHeaders: () => {
    const token = authStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  onResponseError: (status) => {
    if (status === 401) {
      authStore.getState().logout();
      // Redirigir a login
    }
  },
});
```

### 2. Usar hooks de React Query

#### Login

```tsx
import { useLogin } from "@flx-front/shared/data-access";
import { authStore } from "@flx-front/shared/store";

function LoginForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      username: "emilys",
      password: "emilyspass",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

#### Listar productos

```tsx
import { useProductsQuery } from "@flx-front/shared/data-access";

function ProductList() {
  const { data, isLoading, error } = useProductsQuery(apiClient, {
    limit: 10,
    skip: 0,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Crear producto

```tsx
import { useCreateProduct } from "@flx-front/shared/data-access";

function CreateProductForm() {
  const createMutation = useCreateProduct(apiClient, {
    onSuccess: () => {
      console.log("Product created!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title: "New Product",
      description: "A great product",
      price: 99.99,
    });
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

#### Actualizar producto

```tsx
import { useUpdateProduct } from "@flx-front/shared/data-access";

function EditProduct({ productId }) {
  const updateMutation = useUpdateProduct(apiClient);

  const handleUpdate = () => {
    updateMutation.mutate({
      id: productId,
      data: {
        title: "Updated Title",
        price: 149.99,
      },
    });
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

#### Eliminar producto

```tsx
import { useDeleteProduct } from "@flx-front/shared/data-access";

function DeleteProduct({ productId }) {
  const deleteMutation = useDeleteProduct(apiClient);

  const handleDelete = () => {
    deleteMutation.mutate(productId);
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Hooks Disponibles

### Auth

- `useLogin(client, options)` - Login mutation
- `useMeQuery(client, options)` - Get current user (requires auth)

### Products

- `useProductsQuery(client, params, options)` - List products with pagination
- `useProductQuery(client, id, options)` - Get product by ID
- `useCreateProduct(client, options)` - Create product mutation
- `useUpdateProduct(client, options)` - Update product mutation
- `useDeleteProduct(client, options)` - Delete product mutation

## Tipos

Todos los tipos están exportados desde `@flx-front/shared/data-access`:

```tsx
import type {
  LoginRequest,
  LoginResponse,
  User,
  Product,
  ProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "@flx-front/shared/data-access";
```

## Interceptores

El cliente Axios incluye interceptores automáticos:

1. **Request interceptor**: Inyecta headers (Authorization, etc.) usando la función `getHeaders` proporcionada
2. **Response interceptor**: Maneja errores HTTP usando el callback `onResponseError`

Esto permite que el token JWT se inyecte automáticamente en todas las peticiones sin acoplar esta librería al store de auth.

## Invalidación de Queries

Las mutations invalidan automáticamente las queries relacionadas:

- `useCreateProduct` → invalida `["products"]`
- `useUpdateProduct` → invalida `["products"]` y `["products", id]`
- `useDeleteProduct` → invalida `["products"]`

Esto asegura que los datos se refresquen automáticamente después de las mutaciones.
