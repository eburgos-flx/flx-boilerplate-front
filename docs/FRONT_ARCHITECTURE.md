# Boilerplate Front

## Objetivo

El objetivo de este proyecto es generar un boilerplate para un proyecto front que esté constituido con la última versión estable de Nx y las siguientes características no negociables:

1. **pnpm** como gestor de paquetes.
2. **Centralización de dependencias**: apps y libs consumen de un único `package.json` en la raíz (single version policy).
3. **Monorepo Nx**: apps, libs, tools y configuraciones bajo un mismo repo.
4. **App web de ejemplo** con stack JS estable:
   - React
   - TypeScript
   - Vite
   - React Router v7
   - TanStack Query (React Query)
   - React Hook Form + Zod + @hookform/resolvers (validación tipada)
   - Vitest + React Testing Library
   - Tailwind CSS v4
   - Zustand
5. **App mobile de ejemplo** con stack JS estable:
   - React Native
   - TypeScript
   - Expo (EAS Build)
   - Expo Router
   - TanStack Query
   - React Hook Form + Zod + @hookform/resolvers (validación tipada)
   - Jest + React Native Testing Library (unit/integration); Maestro (E2E)
   - NativeWind v5 (compatible con Tailwind CSS v4)
   - Zustand
   - Zod
6. **Librería de componentes compartida** consumible por web y mobile, con Tailwind CSS v4 y NativeWind v5, y un sistema de diseño consistente.
7. **Librería de consumo de APIs** compartida (web + mobile): clientes HTTP basados en Axios, configuración de TanStack Query, wrappers por llamada (hooks useQuery/useMutation), interceptores para inyectar headers (p. ej. JWT). App web: proxy en Vite para evitar CORS en desarrollo.
8. **Archivos `.env`** son necesarios para consolidar este proyecto: base URL del API, variables por entorno (desarrollo, staging, producción) y alineación entre web y mobile; la fuente única en `tools/api-config` puede generar o documentar estos `.env` para que no se dupliquen valores.
9. **Store compartido (Zustand)** para **auth** y **settings**, consumido por las apps web y mobile desde una lib compartida (`shared/store`), de modo que autenticación y preferencias tengan la misma fuente de verdad en ambas apps.

---

## Marco técnico (tecnologías y versiones)

### Entorno y herramienting

| Tecnología     | Versión / Notas                                                |
| -------------- | -------------------------------------------------------------- |
| **Node.js**    | ≥ 20 (LTS recomendado; requerido por Tailwind v4 y Vitest)     |
| **pnpm**       | ≥ 9 (workspaces, single `package.json` en raíz)                |
| **Nx**         | 22.x estable (ej. 22.3+)                                       |
| **TypeScript** | 5.x (strict, mismo `tsconfig.base.json` para todo el monorepo) |

### Plugins Nx

- `nx` – core
- `@nx/vite` – builds y dev server para la app web (Vite)
- `@nx/vitest` – tests para proyectos Vite (reemplaza `@nx/vite:test`; requerido Vite ≥ 6)
- `@nx/react` – generadores y soporte React
- `@nx/expo` – app Expo: generadores, executors (start, build, submit, etc.)

### App web (React + Vite)

| Dependencia               | Uso                                                           |
| ------------------------- | ------------------------------------------------------------- |
| **React**                 | 19.x (o última 18.x estable según política)                   |
| **Vite**                  | ≥ 6.0 (requerido por @nx/vitest)                              |
| **React Router**          | 7.x (React Router DOM)                                        |
| **TanStack Query**        | v5 (`@tanstack/react-query`)                                  |
| **React Hook Form**       | v7.x                                                          |
| **Zod**                   | 3.x (validación; integrable con RHF vía resolver)             |
| **@hookform/resolvers**   | Última estable (puente RHF + Zod/Yup)                         |
| **Vitest**                | 2.x (con @nx/vitest)                                          |
| **React Testing Library** | Última estable (`@testing-library/react`)                     |
| **Tailwind CSS**          | v4.x                                                          |
| **Zustand**               | v5.x                                                          |
| **Axios**                 | Última estable (cliente HTTP; usado desde shared/data-access) |

### App mobile (Expo + React Native)

| Dependencia                      | Uso                                                                   |
| -------------------------------- | --------------------------------------------------------------------- |
| **Expo SDK**                     | 54.x (React Native 0.81.5)                                            |
| **Expo Router**                  | 6.x (file-based routing)                                              |
| **TanStack Query**               | v5 (`@tanstack/react-query`)                                          |
| **React Hook Form**              | v7.x                                                                  |
| **Zod**                          | 3.x (validación; integrable con RHF vía resolver)                     |
| **@hookform/resolvers**          | Última estable (puente RHF + Zod)                                     |
| **Jest**                         | Con preset Expo / React Native (unit/integration)                     |
| **React Native Testing Library** | Última estable                                                        |
| **Maestro**                      | E2E (fuera del repo o en `tools/`)                                    |
| **NativeWind**                   | v5.x (pre-release; compatible con Tailwind v4 y recomendado por Expo) |
| **Zustand**                      | v5.x                                                                  |
| **Axios**                        | Última estable (cliente HTTP; usado desde shared/data-access)         |

### Librería de consumo de APIs (shared/data-access)

- **Ubicación**: `libs/shared/data-access`. Consumida por las apps web y mobile y por features que necesiten llamadas HTTP.
- **Axios**: una o varias instancias configuradas (p. ej. `createApiClient(baseURL, getHeaders)`).
  - **Interceptores de request**: inyectar headers (p. ej. `Authorization: Bearer <token>`, `X-Request-Id`, idioma). El token JWT (u otro) se obtiene desde un store, contexto o función inyectada por la app para no acoplar la lib al origen del token.
  - **Interceptores de response**: manejo de errores (401, 403, 503), opcionalmente lógica de refresh de token o redirección a login; todo delegable vía callbacks/config para que cada app defina el comportamiento.
- **TanStack Query**: cada llamada al backend se expone como **wrapper** que combina Axios + React Query:
  - **Queries (GET)**: función que ejecuta `axios.get(...)` + hook `useQuery` que usa esa función como `queryFn`, con opciones (queryKey, staleTime, etc.) configurables.
  - **Mutations (POST/PUT/PATCH/DELETE)**: función que ejecuta el método Axios correspondiente + hook `useMutation` con esa función como `mutationFn`, e invalidación de queries relacionadas si aplica.
  - Las apps solo consumen los hooks; la instancia Axios (con interceptores) es la única que hace HTTP, de modo que todas las peticiones pasan por los mismos interceptores.
- **Tipado**: tipos de request/response por endpoint (interfaces o tipos generados) para TypeScript estricto.
- **Consumo**: tanto la app React (Vite) como la app React Native (Expo) usan la misma lib; la única diferencia es la base URL (y en web, en dev, el proxy de Vite para evitar CORS).
- **Token (JWT)**: los interceptores de request pueden obtener el token desde el **store compartido de auth** (`shared/store`), de modo que web y mobile usen la misma fuente para el header `Authorization`.

### Librería de store compartido (shared/store)

- **Ubicación**: `libs/shared/store`. Consumida por las apps web y mobile y por features que necesiten auth o settings.
- **Zustand v5**: stores ligeros, sin React como dependencia en la definición del store; las apps usan los hooks (`useAuthStore`, `useSettingsStore`) en componentes.
- **Auth store**:
  - Estado: usuario (id, email, roles, etc.), token (JWT u otro), estado de sesión (logged in / logged out).
  - Acciones: `setUser`, `setToken`, `logout`, `clearAuth`; opcionalmente `login` (llamada que delega en data-access y luego actualiza el store).
  - Persistencia opcional: persistir token o usuario en AsyncStorage (mobile) / localStorage (web) vía middleware de Zustand o adapter por plataforma, para mantener sesión entre reinicios.
- **Settings store**:
  - Estado: tema (light/dark), idioma, preferencias de UI (notificaciones, etc.).
  - Acciones: `setTheme`, `setLanguage`, `setPreference`.
  - Persistencia opcional: persistir en AsyncStorage / localStorage para que las preferencias se mantengan entre sesiones.
- **Consumo**: tanto la app web como la mobile importan los mismos stores desde `@flx-front/shared/store`; la API (selectores y acciones) es la misma en ambas. La lib no depende de React ni de React Native en su API pública; solo Zustand y tipos.
- **Integración con data-access**: el cliente Axios en `shared/data-access` puede recibir una función `getToken` inyectada por la app que lee desde `useAuthStore.getState().token` (o equivalente), de modo que los interceptores usen el store compartido sin acoplar data-access al store.

### Librería de componentes compartida

- **Tailwind CSS v4** en web; **NativeWind v5** en React Native.
- Diseño: tokens (colores, espaciado, tipografía) definidos en CSS/theme compartido cuando sea posible.
- Componentes presentacionales (UI) sin lógica de negocio; consumo desde `ui-*` y `feature-*`.

### Nomenclatura de paquetes

- **TanStack Query**: nombre oficial del paquete; “React Query” se mantiene como nombre de producto. En código y docs usar `@tanstack/react-query`.
- **React Hook Form**: paquete `react-hook-form` (v7).
- **Zod + @hookform/resolvers**: Zod define esquemas de validación; `@hookform/resolvers` (p. ej. `zodResolver`) adapta esos esquemas a React Hook Form. Usar en web y mobile para validación tipada y consistente.
- **NativeWind**: paquete `nativewind` (v5; revisar estado pre-release antes de producción).

---

## Estructura del monorepo Nx

### Árbol de directorios propuesto

```
flx-boilerplate-front/
├── apps/
│   ├── web/                    # App React + Vite (implementada)
│   └── mobile/                 # App Expo (implementada)
├── libs/
│   ├── shared/
│   │   ├── data-access/        # Clientes API (Axios + TanStack Query), interceptores (implementada)
│   │   ├── store/              # Stores Zustand compartidos: auth, settings (implementada)
│   │   └── util/               # Utilidades puras (formato, fechas, etc.) (implementada)
│   └── ui/                     # Componentes compartidos (implementada)
│       └── src/
│           ├── mobile/         # Componentes para React Native
│           └── web/            # Componentes para web
├── tools/                      # Scripts, generators, E2E, etc.
│   ├── api-config/             # Fuente única de configuración proxy/API (implementada con enfoque de importación)
│   ├── e2e/                    # E2E web (Playwright/Cypress) o referencias a Maestro (no implementado en boilerplate base)
│   └── scripts/                # Scripts de build, release, etc. (opcional)
├── package.json                # Único package.json; todas las deps aquí
├── pnpm-workspace.yaml         # Workspaces de pnpm
├── nx.json
├── tsconfig.base.json
├── eslint.config.mjs          # Flat config
├── .env.example               # Variables de entorno documentadas (implementado)
└── README.md
```

### Apps (`apps/`)

| Proyecto   | Stack                                                                        | Descripción                                                                                  |
| ---------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **web**    | React, Vite, React Router, TanStack Query, RHF, Tailwind v4, Zustand         | App web de ejemplo; sirve de referencia de consumo de `libs/ui` y de estructura de features. |
| **mobile** | Expo (SDK 54), Expo Router, TanStack Query, RHF, NativeWind v5, Zustand, Zod | App mobile de ejemplo; consume la misma librería de UI y utilidades compartidas.             |

Cada app tiene su `project.json` o configuración inferida por plugins (`@nx/vite`, `@nx/expo`). No llevan `package.json` propio si se sigue single-version policy en la raíz.

### Libs (`libs/`)

Organizadas por **scope** (shared, web, mobile) y por **tipo** (ui, feature, data-access, util), siguiendo las convenciones de Nx.

#### Scope `shared/`

- **`shared/data-access`**: librería de consumo de APIs compartida por web y mobile (implementada).
  - **Ubicación**: `libs/shared/data-access/`
  - **Export**: `@flx-front/shared/data-access`
  - **createApiClient**: función que crea instancias Axios con baseURL, getHeaders (inyectada por app), y onResponseError (callback opcional).
  - **Interceptores**: request (inyección de headers vía getHeaders); response (manejo de errores vía onResponseError).
  - **QueryProvider**: componente React que envuelve la app con QueryClientProvider de TanStack Query.
  - Wrappers específicos por endpoint (useQuery/useMutation) se añaden según necesidad del proyecto.
- **`shared/store`**: stores **Zustand** compartidos por web y mobile (implementada).
  - **Ubicación**: `libs/shared/store/`
  - **Export**: `@flx-front/shared/store`
  - **Auth store** (`auth-store.ts`): usuario, token (JWT), estado de sesión (isLoggedIn); acciones: setUser, setToken, logout, clearAuth; persistencia opcional.
  - **Settings store** (`settings-store.ts`): tema ('light'|'dark'|'system'), idioma, preferencias; acciones: setTheme, setLanguage, setPreference, clearSettings; persistencia opcional.
  - Las apps y features consumen los mismos stores; `shared/data-access` recibe función inyectada para leer el token.
- **`shared/util`**: funciones puras, formateo, constantes, tipos compartidos (implementada).
  - **Ubicación**: `libs/shared/util/`
  - **Export**: `@flx-front/shared/util`
  - Sin dependencias de React/React Native salvo utilidades muy genéricas.
- **`ui`**: design system compartido (implementada).
  - **Ubicación**: `libs/ui/src/` con subdirectorios `mobile/` y `web/`.
  - **Exports**: `@flx-front/ui-web` y `@flx-front/ui-mobile`
  - Componentes presentacionales separados por plataforma.
  - Estilos: Tailwind v4 (web) y NativeWind v5 (native; verificar estado en producción).

#### Extensibilidad futura

El boilerplate puede extenderse con:

- **`web/feature-*`**: contenedores y lógica de negocio por pantalla o flujo específicos de la app web (ej. `feature-home`, `feature-auth`).
  - Pueden depender de `ui`, `shared/util`, `shared/data-access` y `shared/store`.
- **`web/data-access`** (opcional): APIs y estado específicos de la app web.
- **`mobile/feature-*`**: equivalente a web pero para la app Expo.
- **`mobile/data-access`** (opcional): APIs y estado específicos de la app mobile.

#### Tipos de librería y restricciones (tags Nx)

| Tipo            | Prefijo / tag                      | Puede depender de                     |
| --------------- | ---------------------------------- | ------------------------------------- |
| **feature**     | `feature-*`, `type:feature`        | feature, ui, data-access, store, util |
| **ui**          | `ui*`, `type:ui`                   | ui, util                              |
| **data-access** | `data-access*`, `type:data-access` | data-access, util                     |
| **store**       | `store`, `type:store`              | util                                  |
| **util**        | `util*`, `type:util`               | util                                  |

Se recomienda configurar `@nx/enforce-module-boundaries` en ESLint con estos tags para mantener el grafo de dependencias ordenado.

---

## Configuraciones del monorepo

### `package.json` (raíz)

- Todas las dependencias de producción y desarrollo en la raíz.
- Scripts de Nx: `nx run-many`, `nx run web dev`, `nx run mobile start`, etc.
- `engines`: `node` ≥ 20 y `pnpm` ≥ 9.
- Sin workspaces internos con múltiples `package.json` si se elige single-version policy estricta; en ese caso `pnpm-workspace.yaml` puede listar solo el root o los paquetes publicables si más adelante se añaden.

### `pnpm-workspace.yaml`

- Definir paquetes del workspace. Para solo root: `packages: ['']` o equivalente según documentación de pnpm.
- Si más adelante se añaden libs publicables con `package.json`, incluirlas en `packages: ['apps/*', 'libs/*']` (o la convención que se use).

### `nx.json`

- `plugins`: `@nx/vite`, `@nx/vitest`, `@nx/react`, `@nx/expo` con opciones por plugin (nombres de targets, etc.).
- Caching y pipelines para `build`, `test`, `lint`, `e2e` según necesidad.
- Nx Cloud opcional para cache distribuido y CI.

### TypeScript

- `tsconfig.base.json` en raíz: `paths` con alias `@flx-front/shared/ui`, `@flx-front/shared/util`, `@flx-front/shared/store`, `@flx-front/shared/data-access`, etc., apuntando a las entradas de cada lib.
- Cada app/lib extiende la base y ajusta `include`/`exclude` según corresponda.

### ESLint

- Configuración flat (`eslint.config.mjs`).
- Presets de Nx: `@nx/configs/base`, TypeScript, JavaScript.
- Regla `@nx/enforce-module-boundaries` con `depConstraints` según los tipos feature / ui / data-access / util.

### Archivos `.env` (consolidación del proyecto)

- Los archivos **`.env`** son **necesarios para consolidar** este proyecto: centralizan la configuración por entorno (desarrollo, staging, producción) y evitan valores duplicados o desalineados entre web y mobile.

**Variables de entorno necesarias**

| Variable              | App    | Obligatoria | Descripción                                                                                                                             | Ejemplo (desarrollo)    | Ejemplo (producción)      |
| --------------------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------- |
| `VITE_API_BASE_URL`   | Web    | Sí          | Base URL del API consumida por la app web. En dev suele ser vacía o `/api` para usar el proxy de Vite; en prod la URL real del backend. | ``o`/api`               | `https://api.ejemplo.com` |
| `EXPO_PUBLIC_API_URL` | Mobile | Sí          | Base URL del API consumida por la app Expo. Mismo valor conceptual que la web; en dev suele ser la URL del backend local o tunnel.      | `http://localhost:3001` | `https://api.ejemplo.com` |
| `VITE_APP_ENV`        | Web    | No          | Entorno de ejecución (desarrollo, staging, producción). Útil para lógica condicional o analytics.                                       | `development`           | `production`              |
| `EXPO_PUBLIC_APP_ENV` | Mobile | No          | Mismo que `VITE_APP_ENV` para la app mobile.                                                                                            | `development`           | `production`              |

- **Web (Vite)**: se usan variables con prefijo `VITE_` (p. ej. `VITE_API_BASE_URL`), inyectadas en build y accesibles en el cliente; típicamente `.env`, `.env.development`, `.env.production` (o equivalentes por entorno).
- **Mobile (Expo)**: se usan variables con prefijo `EXPO_PUBLIC_` (p. ej. `EXPO_PUBLIC_API_URL`), cargadas por Expo CLI y accesibles en la app; típicamente `.env` en la raíz de la app mobile o del monorepo.
- **Consolidación**: los valores (base URL del API, prefijo, target del proxy en dev) deben ser los mismos en este aspecto para web y mobile; la fuente única en `tools/api-config` define esos valores y, opcionalmente, un script genera los `.env` desde ella, o se documenta un `.env.example` que cada desarrollador copia y rellena. Los `.env` no se versionan con datos sensibles; sí se versiona `.env.example` con las claves necesarias para consolidar el proyecto.

### Proxy y CORS (Vite – app web) y configuración unificada

- **Regla**: la configuración de proxy y API (prefijo, target, base URL, variables de entorno) debe ser **la misma** para web y mobile en este aspecto; una única fuente de verdad evita duplicación y desajustes.
- **Objetivo**: en desarrollo (web), las llamadas al backend van por proxy para evitar CORS; en producción se usa la URL real del API. En mobile se usan las mismas variables/valores (base URL, prefijo) según corresponda al entorno.
- **Fuente única**: la configuración canonónica (prefijo `/api`, target del backend en dev, base URL en prod, etc.) vive en **`tools/api-config`** (p. ej. un archivo JSON o TS). No se duplica en cada app.
- **Tool `tools/api-config`**: herramienta que **transporta** esta configuración a los archivos que la consumen:
  - **Web**: escribe o actualiza la sección `server.proxy` y, si aplica, variables de entorno en el `vite.config.ts` de la app web (p. ej. `apps/web/vite.config.ts`). Puede generar o actualizar `.env.development` / `.env.production` con `VITE_API_BASE_URL` etc.
  - **Mobile**: aplica los mismos valores (base URL, prefijo) al lugar que use la app mobile (p. ej. `.env`, `app.config.js` o variables de entorno de EAS), de modo que web y mobile compartan la misma definición de API.
  - La tool puede ser un script (Node/TS) invocable con `pnpm` o un target Nx (ej. `nx run api-config:apply`), que lee la fuente única y escribe en los destinos según corresponda.
- **Configuración en `vite.config.ts`** (resultado de la tool para la app web):
  - `server.proxy`: mapear el prefijo definido en la fuente única (p. ej. `/api`) al target del backend (p. ej. `http://localhost:3001`), con `changeOrigin: true`.
  - Las variables (p. ej. `VITE_API_BASE_URL`) deben coincidir con lo definido en `tools/api-config` para desarrollo y producción.
- La lib `shared/data-access` recibe la base URL al crear el cliente; las apps web y mobile inyectan la base URL (que proviene de la misma configuración canonónica) al inicializar.

### Tool `tools/api-config` (configuración proxy/API)

- **Propósito**: mantener una **única fuente de verdad** para la configuración de proxy y API (prefijo, target, base URL) y que web y mobile la consuman de la misma forma.
- **Contenido sugerido**:
  - Archivo de configuración canonónica (p. ej. `config.ts` o `config.json`) que exporta: prefijo del API (ej. `/api`), target del backend en desarrollo (ej. `http://localhost:3001`), base URL por entorno, y nombres de variables de entorno (ej. `VITE_API_BASE_URL`, `EXPO_PUBLIC_API_URL`).
  - **Implementación recomendada (importación)**:
    - **Web**: `apps/web/vite.config.ts` **importa** la config desde `tools/api-config` (path relativo o alias) y asigna `server.proxy` y env desde ella; no se escribe en `vite.config.ts` desde un script.
    - **Mobile**: `apps/mobile/app.config.js` (o `.ts`) **importa** la misma config y expone los valores (p. ej. en `extra` o para `EXPO_PUBLIC_*`).
    - Opcionalmente, un script que **genere** `.env.development` / `.env.production` (y el `.env` de mobile) desde la misma fuente, para que `VITE_*` y `EXPO_PUBLIC_*` no se dupliquen a mano.
  - **Implementación alternativa (script que escribe)**: un script o target Nx que lee la config y escribe en `vite.config.ts` y en archivos `.env`; posible pero más frágil para el config TS (véase “Verificación de viabilidad”).
- **Regla**: no duplicar valores de proxy/API en cada app; toda definición sale de `tools/api-config`; las apps la consumen por importación (recomendado) o la tool la transporta por script.

### Verificación de viabilidad (proxy/API unificada)

La práctica descrita es **viable** y se puede implementar de dos maneras, ambas válidas:

1. **Enfoque por importación (recomendado)**
   - `tools/api-config` expone un módulo (p. ej. `config.ts` o `config.json`) con la configuración canonónica (prefijo, target, base URL, nombres de variables).
   - **Web**: `apps/web/vite.config.ts` **importa** ese módulo (path relativo al monorepo, p. ej. `../../tools/api-config/config`) y asigna `server.proxy` y, si aplica, `env` desde la config. Vite ejecuta el config en Node, por lo que importar desde `tools/` es posible.
   - **Mobile**: `apps/mobile/app.config.js` (o `.ts`) **importa** la misma config y expone los valores en `extra` o usa las mismas variables para generar `EXPO_PUBLIC_*`; Expo permite config dinámico que lee `process.env` o imports.
   - Ventaja: una única fuente de verdad, siempre en sync, sin script de “aplicar”. Para variables de entorno (`.env` con `VITE_*` / `EXPO_PUBLIC_*`), se puede seguir usando un pequeño script que **genere** los `.env` desde `tools/api-config` si se quiere que los valores no se dupliquen en archivos manuales.

2. **Enfoque por script que escribe**
   - Un script (Node/TS) o target Nx lee `tools/api-config` y **escribe** en `apps/web/vite.config.ts` (merge o reemplazo de la sección `server.proxy`) y en `.env` o en el config de mobile.
   - Es posible, pero mantener y parsear/editar `vite.config.ts` (TS) desde un script es más frágil que hacer que el propio `vite.config.ts` importe la config.
   - Tiene sentido si se quiere que `vite.config.ts` sea generado por completo y no tocar código; en ese caso el script debe generar el archivo completo a partir de una plantilla.

**Conclusión**: la configuración unificada de proxy/API para web y mobile es **posible**. Se recomienda el enfoque por **importación** en `vite.config.ts` y en `app.config.js` (Expo), con la fuente única en `tools/api-config`; opcionalmente un script que genere `.env` desde la misma fuente para mantener `VITE_*` y `EXPO_PUBLIC_*` alineados.

### Herramientas opcionales

- **Prettier**: raíz; integrado con ESLint y con el formato que use el equipo.
- **Storybook**: en `libs/ui` (o en una app de documentación bajo `apps/`) para documentar el design system.
- **E2E web**: proyecto bajo `tools/e2e` o `apps/web-e2e` con Playwright o Cypress; invocable desde Nx.
- **Maestro**: E2E mobile; config y flujos en repo o en carpeta `tools/maestro`; ejecución vía CLI o CI.

### Elementos adicionales recomendados para el boilerplate

Para cerrar el boilerplate y que cualquier equipo pueda usarlo sin huecos, se recomienda tener en cuenta lo siguiente:

| Elemento                  | Descripción                                                                                                                                                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`.gitignore`**          | Incluir: `node_modules`, `dist`, `.nx/cache`, `.env` (y variantes `.env.local`, `.env.*.local`), `*.log`, builds de Expo, IDE. No versionar secretos ni `.env` con valores reales.                                                                                                             |
| **`.env.example`**        | Archivo versionado en la raíz (o por app) con las **mismas claves** que la tabla “Variables de entorno necesarias”, sin valores sensibles; descripción breve por variable. Cada desarrollador copia a `.env` y rellena.                                                                        |
| **README.md**             | Mínimo: objetivo del repo, requisitos (Node ≥ 20, pnpm ≥ 9), cómo instalar (`pnpm install`), scripts principales (ej. `pnpm nx run web dev`, `pnpm nx run mobile start`), estructura de carpetas (enlace o resumen), referencia a este documento (`FRONT_ARCHITECTURE.md`) y a `.env.example`. |
| **Scripts de raíz**       | En `package.json` raíz: scripts que deleguen en Nx (ej. `dev:web`, `dev:mobile`, `build:web`, `build:all`, `test`, `lint`) para no depender solo de `nx run <project> <target>`.                                                                                                               |
| **Estrategia de testing** | Unit: Vitest en web (libs y app), Jest en mobile (libs y app). Integration: RTL en ambos. E2E: Playwright/Cypress en `tools/e2e` o app dedicada (web); Maestro (mobile). Definir qué se ejecuta en CI (p. ej. `nx run-many -t test,lint`).                                                     |
| **CI/CD (opcional)**      | Pipeline mínimo: install, lint, test, build web y/o mobile. Definir en GitHub Actions / GitLab CI / etc.; usar cache de pnpm y Nx. EAS Build/Submit para mobile si aplica.                                                                                                                     |
| **Seguridad**             | No commitear JWT, API keys ni secretos en código ni en `.env` versionado. Token JWT en interceptores desde store/contexto inyectado por la app; `.env` solo con valores no sensibles o usar variables de CI.                                                                                   |
| **Despliegue**            | Web: artefacto de build en `apps/web/dist` (o equivalente); mobile: builds con EAS Build, distribución con EAS Submit. Documentar en README o en un doc de despliegue si el boilerplate incluye ejemplos de deploy.                                                                            |

Si alguno de estos puntos ya está cubierto por convención del equipo o por otro documento, puede omitirse; este listado sirve como checklist para no dejar nada pendiente.

---

## Resumen de decisiones

1. **Un solo `package.json`** en la raíz y pnpm para instalar y lockear dependencias.
2. **Nx 22** con plugins oficiales para Vite, Vitest, React y Expo.
3. **App web**: Vite 6, React 19 (o 18), Vitest + RTL, Tailwind v4, TanStack Query v5, React Hook Form v7, Zustand v5.
4. **App mobile**: Expo SDK 54, Expo Router, NativeWind v5, TanStack Query v5, RHF v7, Zustand v5, Zod; Jest + RTL Native; Maestro para E2E.
5. **Design system** en `libs/ui` con Tailwind v4 (web) y NativeWind v5 (mobile) y tokens compartidos.
6. **Store compartido (Zustand)** en `libs/shared/store`: auth (usuario, token, login/logout) y settings (tema, idioma, preferencias); consumido por web y mobile; misma API en ambas apps; data-access recibe `getToken` inyectado por la app (que puede leer del auth store).
7. **Estructura de libs** por scope (shared, web, mobile) y por tipo (ui, feature, data-access, store, util) con reglas de dependencias vía tags Nx y ESLint.
8. **Configuración compartida**: TypeScript base, ESLint flat, Nx plugins y, opcionalmente, Prettier, Storybook y E2E en `tools/` o apps dedicadas.
9. **Librería de consumo de APIs** (`libs/shared/data-access`): Axios + TanStack Query; clientes con interceptores (JWT, headers); cada llamada expuesta como wrapper (useQuery/useMutation); consumida por web y mobile; base URL inyectable por app.
10. **Proxy y API (web y mobile)**: configuración de proxy/API **única** para web y mobile; fuente de verdad en `tools/api-config`; una tool transporta esa configuración a `vite.config.ts` (web) y al config de mobile, sin duplicar valores.
11. **Tool `tools/api-config`**: lee la configuración canonónica (prefijo, target, base URL) y la escribe en los archivos correspondientes (p. ej. `apps/web/vite.config.ts` y config/env de mobile); los `vite.config.ts` no se editan a mano en lo relativo a proxy/API.
12. **Archivos `.env`**: son necesarios para consolidar el proyecto (base URL del API, variables por entorno, alineación web/mobile); se usan `VITE_*` en web y `EXPO_PUBLIC_*` en mobile; la fuente en `tools/api-config` puede generar o documentar `.env`; se versiona `.env.example`, no los `.env` con datos sensibles.
13. **Checklist de cierre del boilerplate**: `.gitignore`, `.env.example` (claves de la tabla de env), README mínimo, scripts de raíz, estrategia de testing, CI/CD opcional, seguridad (no commitear secretos), despliegue (artefactos y EAS); ver sección “Elementos adicionales recomendados”.

Este documento sirve como referencia para implementar el boilerplate y puede ajustarse cuando se fijen versiones exactas (p. ej. en `package.json`) o se añadan más apps o libs.
