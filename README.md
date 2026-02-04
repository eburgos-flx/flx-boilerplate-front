# Flx Boilerplate Front

Monorepo Nx moderno con aplicación web (React + Vite) y aplicación móvil (Expo), compartiendo librerías de UI, utilidades, store y acceso a datos. Incluye demo completa con autenticación JWT, gestión de productos y persistencia de sesión.

## 🎯 Características

- ✅ **Monorepo Nx 22** con workspaces y caché optimizado
- ✅ **App Web**: React 19 + Vite 6 + React Router 7 + Tailwind v4
- ✅ **App Mobile**: Expo SDK 54 + React Native 0.81.5 + Expo Router 6
- ✅ **UI Compartida**: Design system con Tailwind v4 (web) y NativeWind v5 (mobile)
- ✅ **Data Access**: TanStack Query v5 + Axios con interceptores JWT
- ✅ **State Management**: Zustand v5 con persistencia cross-platform
- ✅ **Type Safety**: TypeScript strict en todo el monorepo
- ✅ **Demo API**: Integración completa con DummyJSON (auth + productos CRUD)
- ✅ **Persistencia**: localStorage (web) y AsyncStorage (mobile)
- ✅ **Testing**: Vitest + React Testing Library (web), Jest (mobile)

## 📋 Requisitos

### Obligatorios

- **Node.js** ≥ 20 (LTS recomendado)
- **pnpm** ≥ 9.14 (`npm install -g pnpm`)

### Para desarrollo móvil

#### iOS (macOS únicamente)

- **Xcode** (última versión desde App Store)
- **CocoaPods** – Gestor de dependencias nativo

  ```bash
  # Con Homebrew (recomendado)
  brew install cocoapods

  # O con Ruby
  sudo gem install cocoapods
  ```

- **Simulador iOS** – Incluido con Xcode
- Verificar instalación:
  ```bash
  xcode-select --print-path  # Debe mostrar /Applications/Xcode.app/Contents/Developer
  xcrun simctl list devices available  # Lista simuladores disponibles
  ```

#### Android

- **Android Studio** (última versión)
- **Android SDK** (API Level 33+)
- **Java JDK** 17 o superior
- **Emulador Android** (AVD Manager en Android Studio)
- Variables de entorno:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

## 🚀 Instalación

### 1. Clonar e instalar dependencias

```bash
# Clonar repositorio
git clone <repo-url>
cd flx-boilerplate-front

# Instalar dependencias (puede tardar 2-3 minutos)
pnpm install

# Instalar CocoaPods para iOS (solo macOS, solo primera vez)
cd apps/mobile/ios && pod install && cd ../../..
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores (opcional, ya tiene valores por defecto)
# Para desarrollo local los valores por defecto funcionan
```

**Variables de entorno:**

| Variable              | Descripción               | Valor por defecto        |
| --------------------- | ------------------------- | ------------------------ |
| `VITE_API_BASE_URL`   | Base URL del API (web)    | Vacío (usa proxy `/api`) |
| `EXPO_PUBLIC_API_URL` | Base URL del API (mobile) | `https://dummyjson.com`  |

### 3. Verificar instalación

```bash
# Verificar que Nx está funcionando
pnpm nx --version

# Listar todos los proyectos
pnpm nx show projects

# Verificar estado del monorepo
pnpm nx graph
```

## 🎮 Scripts principales

### Desarrollo

```bash
# App web (abre en http://localhost:4200)
pnpm dev:web

# App mobile (abre Metro en http://localhost:8081)
pnpm dev:mobile

# Ambas apps simultáneamente (en terminales separadas)
pnpm dev:web
pnpm dev:mobile
```

### Ejecución en dispositivos/simuladores

```bash
# iOS Simulator (macOS)
pnpm run:ios

# Android Emulator
pnpm run:android

# iOS en dispositivo físico
pnpm run:ios --device

# Android en dispositivo físico
pnpm run:android --device
```

### Build

```bash
# Build web (output en apps/web/dist)
pnpm build:web

# Build todos los proyectos
pnpm build:all

# Build solo las libs
nx run-many -t build -p @flx-front/shared-util @flx-front/shared-store @flx-front/shared-data-access
```

### Testing

```bash
# Todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Tests con coverage
pnpm test:coverage

# Test específico de un proyecto
nx run web:test
nx run shared-data-access:test
```

### Linting y formateo

```bash
# Lint todos los proyectos
pnpm lint

# Lint y fix automático
pnpm lint:fix

# Lint solo archivos modificados
nx affected -t lint
```

### Nx comandos útiles

```bash
# Ver grafo de dependencias interactivo
pnpm nx graph

# Ver qué proyectos se afectan por cambios
pnpm nx affected:graph

# Ejecutar comando en todos los proyectos
pnpm nx run-many -t <target>

# Ejecutar comando en proyecto específico
pnpm nx run <proyecto>:<target>
```

## 📱 Probar la app móvil

### Opción 1: Expo Go (desarrollo rápido)

1. Instala **Expo Go** en tu dispositivo:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ejecuta el servidor de desarrollo:

   ```bash
   pnpm dev:mobile
   ```

3. **Escanea el QR** que aparece en la terminal:
   - iOS: Abre la cámara y escanea
   - Android: Abre Expo Go y escanea

4. **Alternativa - Conectar manualmente**:
   - Mismo Wi-Fi: `exp://192.168.1.X:8081` (tu IP local)
   - Red diferente: `pnpm dev:mobile --tunnel` (usa ngrok)

### Opción 2: Simuladores/Emuladores (desarrollo nativo)

```bash
# iOS Simulator
pnpm run:ios
# Presiona 'i' en la terminal de Metro

# Android Emulator
pnpm run:android
# Presiona 'a' en la terminal de Metro
```

**Primera ejecución:**

- iOS: Puede tardar 5-10 min (CocoaPods + compilación)
- Android: Puede tardar 3-5 min (Gradle + compilación)
- Ejecuciones posteriores son más rápidas (< 1 min)

### Solución de problemas comunes

Ver [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) para guía completa.

#### iOS

```bash
# Error: "pod: command not found"
brew install cocoapods

# Error: "xcrun: error: SDK 'iphoneos' cannot be located"
sudo xcode-select --switch /Applications/Xcode.app

# Limpiar caché y reinstalar
cd apps/mobile/ios
rm -rf Pods Podfile.lock
pod install
cd ../../..
```

#### Android

```bash
# Error: "ANDROID_HOME not set"
export ANDROID_HOME=$HOME/Library/Android/sdk

# Limpiar build
cd apps/mobile/android
./gradlew clean
cd ../../..
```

## 📁 Estructura del proyecto

```
flx-boilerplate-front/
├── apps/
│   ├── web/                          # App React + Vite
│   │   ├── src/
│   │   │   ├── pages/                # Páginas (home, login, products, product-detail)
│   │   │   ├── lib/                  # API client configurado
│   │   │   ├── App.tsx               # Router principal
│   │   │   └── main.tsx              # Entry point
│   │   ├── index.html
│   │   ├── vite.config.ts            # Config Vite + Tailwind + proxy
│   │   └── project.json
│   └── mobile/                       # App Expo
│       ├── app/                      # Expo Router (file-based)
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── app.json                  # Config Expo
│       ├── metro.config.js
│       └── project.json
├── libs/
│   ├── shared/
│   │   ├── data-access/              # API + TanStack Query
│   │   │   ├── src/
│   │   │   │   ├── api/              # Funciones API (auth, products)
│   │   │   │   ├── hooks/            # React Query hooks
│   │   │   │   ├── types/            # TypeScript types
│   │   │   │   ├── client/           # Axios client factory
│   │   │   │   └── index.ts
│   │   │   ├── README.md             # Documentación de uso
│   │   │   └── INTEGRATION.md        # Guía de integración
│   │   ├── store/                    # Zustand stores
│   │   │   ├── src/
│   │   │   │   ├── auth-store.ts     # Auth state (JWT, user)
│   │   │   │   ├── settings-store.ts # Settings (theme, lang)
│   │   │   │   ├── storage.ts        # Adapter cross-platform
│   │   │   │   └── index.ts
│   │   │   └── README.md
│   │   └── util/                     # Utilidades puras
│   │       └── src/
│   └── ui/                           # Design system compartido
│       └── src/
│           ├── web/                  # Componentes web (Tailwind v4)
│           │   └── components/
│           │       ├── button.tsx
│           │       ├── input.tsx
│           │       ├── card.tsx
│           │       ├── layout.tsx    # Layout con dropdown de usuario
│           │       ├── container.tsx
│           │       ├── loading.tsx
│           │       └── error-message.tsx
│           └── mobile/               # Componentes mobile (NativeWind v5)
│               └── components/       # Por implementar
├── tools/
│   └── api-config/                   # Config API unificada
│       └── src/
│           └── config.ts             # Proxy + base URLs
├── docs/                             # Documentación
│   ├── SETUP.md                      # Guía de instalación detallada
│   ├── DEVELOPMENT.md                # Guía de desarrollo
│   ├── TROUBLESHOOTING.md            # Solución de problemas
│   └── API_INTEGRATION.md            # Uso de la API
├── package.json                      # Dependencias centralizadas
├── pnpm-workspace.yaml
├── nx.json                           # Config Nx
├── tsconfig.base.json                # TypeScript base
├── .env.example                      # Variables de entorno
├── FRONT_ARCHITECTURE.md             # Arquitectura completa
└── README.md                         # Este archivo
```

## 🎨 Demo App - Funcionalidades

La demo incluye una aplicación completa de e-commerce con:

### Autenticación

- ✅ Login con JWT (DummyJSON API)
- ✅ Persistencia de sesión (localStorage/AsyncStorage)
- ✅ Auto-logout en 401
- ✅ Dropdown de usuario con avatar
- **Credenciales demo**: `emilys` / `emilyspass`

### Productos

- ✅ Listado con paginación (12 por página)
- ✅ Detalles completos (imágenes, specs, precios)
- ✅ Búsqueda y filtros
- ✅ CRUD completo (crear, leer, actualizar, eliminar)
- ✅ Badges de stock y rating

### UI/UX

- ✅ Diseño moderno con gradientes
- ✅ Navbar fixed con backdrop blur
- ✅ Cards con hover effects
- ✅ Loading states y error handling
- ✅ Responsive design (mobile-first)
- ✅ Dark mode ready (settings store)

## 🛠️ Tecnologías

### Core

| Tecnología | Versión | Uso                    |
| ---------- | ------- | ---------------------- |
| Node.js    | ≥ 20    | Runtime                |
| pnpm       | 9.14.2  | Package manager        |
| Nx         | 22.3.0  | Monorepo orchestration |
| TypeScript | 5.6.3   | Type safety            |

### Web

| Tecnología     | Versión | Uso              |
| -------------- | ------- | ---------------- |
| React          | 19.1.0  | UI framework     |
| Vite           | 6.0.1   | Build tool       |
| React Router   | 7.0.1   | Routing          |
| TanStack Query | 5.62.0  | Data fetching    |
| Zustand        | 5.0.1   | State management |
| Tailwind CSS   | 4.0.0   | Styling          |
| Axios          | 1.7.9   | HTTP client      |
| Vitest         | 2.1.8   | Testing          |

### Mobile

| Tecnología   | Versión | Uso         |
| ------------ | ------- | ----------- |
| Expo SDK     | 54.x    | Framework   |
| React Native | 0.81.5  | Runtime     |
| Expo Router  | 6.x     | Navigation  |
| NativeWind   | 5.x     | Styling     |
| AsyncStorage | Latest  | Persistence |

## 📚 Documentación adicional

### Guías

- [🚀 Setup completo](./docs/SETUP.md) - Instalación paso a paso
- [💻 Desarrollo](./docs/DEVELOPMENT.md) - Workflow y mejores prácticas
- [🔧 Troubleshooting](./docs/TROUBLESHOOTING.md) - Solución de problemas
- [🔌 Integración API](./docs/API_INTEGRATION.md) - Uso de data-access

### Arquitectura

- [📐 FRONT_ARCHITECTURE.md](./FRONT_ARCHITECTURE.md) - Decisiones técnicas completas

### Libs

- [📦 shared/data-access](./libs/shared/data-access/README.md) - Documentación API
- [📦 shared/store](./libs/shared/store/README.md) - Documentación stores

## 🔐 Seguridad

- ✅ JWT tokens en memoria (no en localStorage permanente en producción)
- ✅ Interceptores Axios para headers automáticos
- ✅ Variables de entorno para secrets
- ✅ `.env` en `.gitignore`
- ⚠️ Demo usa DummyJSON (API pública) - No usar en producción

## 🚢 Despliegue

### Web

```bash
# Build de producción
pnpm build:web

# Output en apps/web/dist
# Deployar en Vercel, Netlify, AWS S3, etc.
```

### Mobile

```bash
# Build con EAS (Expo Application Services)
# Requiere cuenta Expo y configuración EAS
eas build --platform ios
eas build --platform android

# Submit a stores
eas submit --platform ios
eas submit --platform android
```

Ver [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) para guía completa (por crear).

## 🤝 Contribuir

Este es un boilerplate de referencia. Para contribuir:

1. Fork el repositorio
2. Crea una branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

[MIT](./LICENSE) - Ver archivo LICENSE para detalles

## 🆘 Soporte

- **Issues**: Reportar bugs en GitHub Issues
- **Docs**: Ver carpeta `docs/` para guías específicas
- **Architecture**: Ver `FRONT_ARCHITECTURE.md` para decisiones técnicas

---

**Desarrollado con ❤️ usando Nx, React, Expo y las mejores prácticas de 2026**
