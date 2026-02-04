# 🔧 Troubleshooting - Solución de Problemas

Guía completa para resolver problemas comunes en desarrollo.

## 📱 Problemas iOS

### Error: "pod install" falla

**Síntomas:**

```
[!] Unable to find a specification for `...`
[!] CocoaPods could not find compatible versions for pod "..."
```

**Soluciones:**

```bash
# 1. Limpiar caché de CocoaPods
cd apps/mobile/ios
pod cache clean --all
rm -rf Pods Podfile.lock
pod install

# 2. Si sigue fallando, actualizar repos
pod repo update
pod install

# 3. Si persiste, reinstalar CocoaPods
sudo gem uninstall cocoapods
sudo gem install cocoapods
pod setup
pod install
```

### Error: "Unable to boot simulator"

**Síntomas:**

```
Unable to boot device in current state: Booted
Unable to boot device because it cannot be located on disk
```

**Soluciones:**

```bash
# 1. Listar dispositivos
xcrun simctl list devices

# 2. Borrar simulador problemático
xcrun simctl delete <device-uuid>

# 3. Crear nuevo simulador
xcrun simctl create "iPhone 15" "iPhone 15"

# 4. Reset todos los simuladores (último recurso)
xcrun simctl erase all

# 5. Reset contenido y configuración
# Simulator > Device > Erase All Content and Settings
```

### Error: "Command PhaseScriptExecution failed"

**Síntomas:**

```
error: Build input file cannot be found: '...'
Command PhaseScriptExecution failed with a nonzero exit code
```

**Soluciones:**

```bash
# 1. Limpiar build folders
cd apps/mobile/ios
rm -rf build DerivedData
cd ~/Library/Developer/Xcode/DerivedData
rm -rf *

# 2. Reinstalar pods
pod deintegrate
pod install

# 3. Abrir Xcode y limpiar
# Product > Clean Build Folder (Cmd+Shift+K)
# Product > Build (Cmd+B)
```

### Error: "No matching provisioning profile found"

**Síntomas:**

```
error: No profiles for '...' were found
Xcode couldn't find any provisioning profiles matching '...'
```

**Soluciones:**

```bash
# Para desarrollo local (sin publicar en App Store):

# 1. Abrir Xcode
# 2. Seleccionar proyecto > Signing & Capabilities
# 3. Cambiar Team a tu equipo personal
# 4. Cambiar Bundle Identifier a uno único
#    Ejemplo: com.tuempresa.flxboilerplate

# 5. Enable "Automatically manage signing"

# 6. Rebuild
```

---

## 🤖 Problemas Android

### Error: "SDK location not found"

**Síntomas:**

```
SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable
```

**Soluciones:**

```bash
# 1. Verificar instalación de Android SDK
ls $ANDROID_HOME  # Debe listar carpetas

# 2. Si no existe, configurar variable de entorno
# Agregar a ~/.zshrc o ~/.bashrc:

# macOS
export ANDROID_HOME=$HOME/Library/Android/sdk

# Linux
export ANDROID_HOME=$HOME/Android/Sdk

# Windows (cmd)
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"

# 3. Agregar al PATH
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 4. Recargar terminal
source ~/.zshrc

# 5. Verificar
echo $ANDROID_HOME
adb --version
```

### Error: "Unable to load script from assets 'index.android.bundle'"

**Síntomas:**

```
Unable to load script. Make sure you're either running Metro or that your bundle 'index.android.bundle' is packaged correctly for release.
```

**Soluciones:**

```bash
# 1. Limpiar caché de Metro
pnpm nx run mobile:start -- --reset-cache

# 2. Limpiar build Android
cd apps/mobile/android
./gradlew clean
cd ../../..

# 3. Desinstalar app del emulador
adb uninstall com.flxboilerplate.mobile

# 4. Reinstalar
pnpm run:android
```

### Error: "Execution failed for task ':app:mergeDexDebug'"

**Síntomas:**

```
Execution failed for task ':app:mergeDexDebug'
Cannot fit requested classes in a single dex file
```

**Soluciones:**

```bash
# 1. Habilitar multidex (ya debería estar)
# Verificar en apps/mobile/android/app/build.gradle:

android {
  defaultConfig {
    multiDexEnabled true
  }
}

# 2. Limpiar y rebuildar
cd apps/mobile/android
./gradlew clean
cd ../../..
pnpm run:android
```

### Error: Emulador no inicia / se congela

**Síntomas:**

```
Emulator se queda en logo de Android
No responde después de 10+ minutos
```

**Soluciones:**

```bash
# 1. Cerrar todos los emuladores
adb kill-server
adb start-server

# 2. Eliminar y recrear AVD
# Android Studio > AVD Manager > Delete AVD
# Create Virtual Device
#   - Pixel 6
#   - Android 13 (API 33)
#   - Finish

# 3. Iniciar con más RAM
emulator -avd Pixel_6_API_33 -memory 2048

# 4. Deshabilitar aceleración de hardware (último recurso)
# AVD Manager > Edit AVD > Emulated Performance > Software
```

---

## 🌐 Problemas Web

### Error: "Failed to resolve import"

**Síntomas:**

```
[vite] Failed to resolve import "@flx-front/shared/data-access"
Could not resolve "@flx-front/ui-web"
```

**Soluciones:**

```bash
# 1. Verificar que paths están configurados en tsconfig.base.json
cat tsconfig.base.json | grep paths

# 2. Reinstalar dependencias
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# 3. Limpiar caché de Vite
rm -rf apps/web/node_modules/.vite
pnpm dev:web

# 4. Verificar exports en libs
# Asegurarse que libs/shared/data-access/src/index.ts exporta todo
```

### Error: Tailwind classes no funcionan

**Síntomas:**

```
Clases como px-4, sm:px-6 no se aplican
Solo se ven estilos básicos
```

**Soluciones:**

```bash
# 1. Verificar @source en apps/web/src/index.css
# Debe incluir paths a libs:

@import "tailwindcss";

@source "../../../libs/ui/src/**/*.{ts,tsx}";
@source "../../../libs/shared/*/src/**/*.{ts,tsx}";
@source "./**/*.{ts,tsx}";

# 2. Reiniciar servidor
pnpm dev:web

# 3. Verificar que @tailwindcss/vite está en vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Error: "Port 4200 already in use"

**Síntomas:**

```
Port 4200 is already in use
Failed to start dev server
```

**Soluciones:**

```bash
# Opción 1: Matar proceso en puerto
lsof -ti:4200 | xargs kill -9

# Opción 2: Cambiar puerto
VITE_PORT=3000 pnpm dev:web

# Opción 3: Configurar puerto fijo en vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
});
```

### Error: Proxy no funciona / CORS

**Síntomas:**

```
Access to fetch at 'https://dummyjson.com' has been blocked by CORS policy
Network error when trying to call API
```

**Soluciones:**

```bash
# 1. Verificar configuración de proxy en vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});

# 2. Verificar que API client usa /api
# libs/shared/data-access/src/client/api-client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

# 3. Reiniciar servidor
pnpm dev:web
```

---

## 🔄 Problemas de persistencia (Storage)

### Storage no persiste en web

**Síntomas:**

```
Al recargar página, se pierde login
Settings vuelven a valores por defecto
```

**Soluciones:**

```bash
# 1. Verificar localStorage en DevTools
# Chrome > F12 > Application > Local Storage > localhost:4200
# Debería ver: "auth-storage" y "settings-storage"

# 2. Si no existen, verificar store usa persist
# libs/shared/store/src/auth-store.ts
export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // state
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => universalStorage),
    }
  )
);

# 3. Limpiar localStorage y probar de nuevo
localStorage.clear();
location.reload();
```

### Storage no persiste en mobile

**Síntomas:**

```
Al cerrar app y reabrir, se pierde login
AsyncStorage no guarda datos
```

**Soluciones:**

```bash
# 1. Verificar que AsyncStorage está instalado
pnpm list @react-native-async-storage/async-storage

# 2. Si no está, instalar
pnpm add @react-native-async-storage/async-storage -w --filter mobile

# 3. Reinstalar pods (iOS)
cd apps/mobile/ios
pod install
cd ../../..

# 4. Rebuild app
pnpm run:ios
# o
pnpm run:android

# 5. Verificar datos en Flipper o React Native Debugger
# AsyncStorage > Keys > "auth-storage"
```

---

## 🧪 Problemas de Tests

### Tests fallan con "Cannot find module"

**Síntomas:**

```
Cannot find module '@flx-front/shared/data-access'
Error: Cannot find module 'zustand'
```

**Soluciones:**

```bash
# 1. Verificar que vitest.config.ts tiene resolve.alias
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@flx-front/shared/data-access': path.resolve(__dirname, '../libs/shared/data-access/src/index.ts'),
      // ... otros aliases
    }
  }
});

# 2. Reinstalar dependencias
pnpm install

# 3. Limpiar caché de Vitest
pnpm test -- --clearCache
```

### Tests pasan localmente pero fallan en CI

**Síntomas:**

```
Tests OK en local
Tests fail en GitHub Actions / CI
```

**Soluciones:**

```yaml
# 1. Verificar versiones de Node en CI
# .github/workflows/ci.yml
- uses: actions/setup-node@v3
  with:
    node-version: "20" # Misma versión que local

# 2. Usar pnpm en CI
- uses: pnpm/action-setup@v2
  with:
    version: 9

# 3. Agregar timeout más largo
- run: pnpm test --testTimeout=10000

# 4. Asegurarse que cache se limpia
- run: pnpm nx reset
- run: pnpm test
```

---

## 📦 Problemas de dependencias

### "Cannot resolve dependency tree"

**Síntomas:**

```
ERESOLVE unable to resolve dependency tree
Found: react@19.1.0
Could not resolve dependency: peer react@"^18.0.0"
```

**Soluciones:**

```bash
# Opción 1: Forzar instalación (con cuidado)
pnpm install --force

# Opción 2: Usar overrides en package.json
{
  "pnpm": {
    "overrides": {
      "react": "19.1.0",
      "react-dom": "19.1.0"
    }
  }
}

# Opción 3: Downgrade de React (último recurso)
pnpm remove react react-dom
pnpm add react@18 react-dom@18
```

### Dependencias desactualizadas

**Síntomas:**

```
Warnings sobre dependencias deprecated
Vulnerabilidades de seguridad
```

**Soluciones:**

```bash
# 1. Ver dependencias outdated
pnpm outdated

# 2. Actualizar interactivamente
pnpm update --interactive

# 3. Actualizar todas (cuidado con breaking changes)
pnpm update --latest

# 4. Auditar seguridad
pnpm audit

# 5. Fix automático de vulnerabilidades
pnpm audit --fix
```

---

## 🚀 Problemas de Build

### Build falla en producción

**Síntomas:**

```
pnpm build:web fails
Type errors in production build
```

**Soluciones:**

```bash
# 1. Ejecutar type check
pnpm nx run web:type-check

# 2. Ejecutar lint
pnpm lint

# 3. Fix de tipos
pnpm nx run web:build --skipLibCheck

# 4. Verificar variables de entorno
cat .env
# VITE_API_BASE_URL debe estar definido para producción

# 5. Limpiar todo y rebuild
pnpm nx reset
pnpm build:web
```

### Build mobile falla (EAS Build)

**Síntomas:**

```
eas build fails
Cannot find module in production build
```

**Soluciones:**

```bash
# 1. Verificar eas.json existe
cat eas.json

# 2. Verificar app.json tiene correcto name y slug
cat apps/mobile/app.json

# 3. Limpiar build cache
eas build --platform ios --clear-cache
eas build --platform android --clear-cache

# 4. Local build para debugging
eas build --platform ios --local
eas build --platform android --local
```

---

## 🔍 Debugging avanzado

### Inspeccionar red (Network)

```bash
# Web: Chrome DevTools > Network
# Filtrar: Fetch/XHR
# Ver: Request/Response headers, payload, timing

# Mobile iOS: Charles Proxy o Proxyman
# Mobile Android: Chrome > chrome://inspect
```

### Inspeccionar estado (State)

```bash
# Web: React Query Devtools
# Ver: Queries, mutations, cache

# Zustand: Usar Redux DevTools extension
# Ver: State tree, actions, time travel

# Mobile: Flipper
# Ver: Redux, Network, Logs, Layout
```

### Performance profiling

```bash
# Web: Chrome DevTools > Performance
# Record > Interact > Stop
# Analizar: FPS, CPU, Memory

# Mobile: Xcode Instruments (iOS)
# React Native: Performance Monitor
# Shake device > Show Perf Monitor
```

---

## 🆘 Último recurso - Reset completo

Si nada más funciona:

```bash
# 1. Backup de cambios importantes
git stash

# 2. Limpiar TODO
rm -rf node_modules
rm -rf apps/mobile/ios/Pods
rm -rf apps/mobile/ios/build
rm -rf apps/mobile/android/build
rm -rf apps/mobile/android/.gradle
rm pnpm-lock.yaml
pnpm nx reset

# 3. Reinstalar desde cero
pnpm install
cd apps/mobile/ios
pod install
cd ../../..

# 4. Probar
pnpm dev:web
pnpm run:ios
pnpm run:android

# 5. Recuperar cambios
git stash pop
```

---

## 📞 Obtener ayuda

### Logs útiles

```bash
# Logs de Metro (mobile)
pnpm dev:mobile --verbose

# Logs de iOS
npx react-native log-ios

# Logs de Android
npx react-native log-android
adb logcat

# Logs de build
pnpm build:web --verbose
```

### Información del sistema

```bash
# Crear reporte del sistema
npx envinfo --system --binaries --npmPackages

# Incluye: OS, Node, pnpm, dependencies versions
```

### Reportar issues

Al reportar un problema, incluye:

1. **Descripción**: Qué intentaste hacer
2. **Error exacto**: Mensaje completo de error
3. **Pasos para reproducir**: Cómo llegar al error
4. **Entorno**: OS, Node version, pnpm version
5. **Logs**: Output completo de terminal
6. **Screenshots**: Si aplica

---

**Si el problema persiste, abre un issue en GitHub con esta información. 🔧**
