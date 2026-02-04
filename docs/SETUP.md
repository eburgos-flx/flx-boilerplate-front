# 🚀 Guía de Setup Completa

Esta guía te llevará paso a paso por la configuración inicial del proyecto.

## 📋 Checklist previo

Antes de comenzar, verifica que tienes:

- [ ] **Node.js** ≥ 20 instalado (`node --version`)
- [ ] **pnpm** ≥ 9 instalado (`pnpm --version`)
- [ ] **Git** instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Conexión a internet estable

### Para desarrollo móvil

#### macOS (iOS)

- [ ] **Xcode** instalado desde App Store
- [ ] **CocoaPods** instalado
- [ ] **Xcode Command Line Tools** configurado

#### Windows/Linux/macOS (Android)

- [ ] **Android Studio** instalado
- [ ] **Android SDK** (API 33+)
- [ ] **Java JDK** 17+
- [ ] Variables de entorno configuradas

---

## 1️⃣ Instalación de requisitos

### Node.js

```bash
# Verificar versión
node --version  # Debe ser ≥ 20

# Si no tienes Node.js o version antigua:
# Opción 1: Con nvm (recomendado)
nvm install 20
nvm use 20

# Opción 2: Descargar desde nodejs.org
# https://nodejs.org/
```

### pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar instalación
pnpm --version  # Debe ser ≥ 9
```

### iOS - Xcode (solo macOS)

```bash
# 1. Instalar Xcode desde App Store (puede tardar ~1 hora)

# 2. Aceptar licencia
sudo xcodebuild -license accept

# 3. Instalar Command Line Tools
xcode-select --install

# 4. Verificar instalación
xcode-select --print-path
# Debe mostrar: /Applications/Xcode.app/Contents/Developer

# 5. Si es incorrecto, establecer manualmente:
sudo xcode-select --switch /Applications/Xcode.app

# 6. Instalar CocoaPods
sudo gem install cocoapods

# O con Homebrew (recomendado):
brew install cocoapods

# Verificar CocoaPods
pod --version
```

### Android - Android Studio

```bash
# 1. Descargar e instalar Android Studio
# https://developer.android.com/studio

# 2. Durante instalación, asegurarse de instalar:
#    - Android SDK
#    - Android SDK Platform
#    - Android Virtual Device

# 3. Configurar variables de entorno
# Agregar a ~/.zshrc o ~/.bashrc:

export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk       # Linux
# export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk  # Windows

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# 4. Recargar terminal
source ~/.zshrc  # o source ~/.bashrc

# 5. Verificar
adb --version
emulator -list-avds  # Lista emuladores disponibles
```

---

## 2️⃣ Clonar e instalar proyecto

```bash
# 1. Clonar repositorio
git clone https://github.com/eburgos-flx/flx-boilerplate-front.git
cd flx-boilerplate-front

# 2. Instalar dependencias (puede tardar 2-5 minutos)
pnpm install

# 3. Verificar instalación
pnpm nx --version
pnpm nx show projects  # Debe listar: web, mobile, shared-util, etc.
```

---

## 3️⃣ Configurar variables de entorno

```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env

# 2. Editar .env (opcional, valores por defecto funcionan)
# Para desarrollo local, los valores por defecto son suficientes
```

**Contenido de `.env` (opcional):**

```bash
# API Configuration
VITE_API_BASE_URL=              # Vacío usa proxy /api (desarrollo)
EXPO_PUBLIC_API_URL=https://dummyjson.com

# Environment
VITE_APP_ENV=development
EXPO_PUBLIC_APP_ENV=development
```

---

## 4️⃣ Configuración específica por plataforma

### iOS

```bash
# 1. Navegar a carpeta iOS
cd apps/mobile/ios

# 2. Instalar dependencias nativas (puede tardar 5-10 min)
pod install

# 3. Volver a raíz
cd ../../..

# 4. Verificar simuladores disponibles
xcrun simctl list devices available

# Deberías ver simuladores como:
# iPhone 15 (Booted)
# iPhone 15 Pro Max
# iPad Pro 12.9-inch (6th generation)
```

**Crear simulador si no existe:**

```bash
# Listar tipos de dispositivo
xcrun simctl list devicetypes

# Crear simulador (ejemplo iPhone 15)
xcrun simctl create "iPhone 15" "iPhone 15"

# Iniciar simulador
xcrun simctl boot "iPhone 15"
open -a Simulator
```

### Android

```bash
# 1. Abrir Android Studio
# 2. Tools > AVD Manager
# 3. Create Virtual Device
#    - Seleccionar: Pixel 6 (recomendado)
#    - System Image: Android 13 (API 33) o superior
#    - Finish

# 4. Verificar desde terminal
emulator -list-avds

# Debería mostrar tu AVD, ej:
# Pixel_6_API_33

# 5. Iniciar emulador (opcional, el script lo hace automático)
emulator -avd Pixel_6_API_33
```

---

## 5️⃣ Verificación de instalación

### Test web

```bash
# 1. Iniciar servidor de desarrollo
pnpm dev:web

# 2. Abrir navegador en http://localhost:4200

# 3. Deberías ver la home page del boilerplate

# 4. Probar login:
#    Username: emilys
#    Password: emilyspass

# 5. Verificar que navegas a /products correctamente

# Ctrl+C para detener
```

### Test mobile (iOS)

```bash
# 1. Iniciar app en simulador
pnpm run:ios

# 2. Esperar compilación (primera vez 5-10 min)
# 3. El simulador se abrirá automáticamente
# 4. Deberías ver la app corriendo

# Si hay error, ver sección "Troubleshooting"
```

### Test mobile (Android)

```bash
# 1. Asegurarse que emulador está corriendo
emulator -avd Pixel_6_API_33 &

# 2. Iniciar app
pnpm run:android

# 3. Esperar compilación (primera vez 3-5 min)
# 4. La app se instalará automáticamente
```

### Test con Expo Go

```bash
# 1. Instalar Expo Go en tu dispositivo
#    iOS: https://apps.apple.com/app/expo-go/id982107779
#    Android: https://play.google.com/store/apps/details?id=host.exp.exponent

# 2. Iniciar servidor de desarrollo
pnpm dev:mobile

# 3. Escanear QR que aparece en terminal
#    iOS: Usa la cámara del iPhone
#    Android: Usa Expo Go app

# 4. La app se cargará en Expo Go
```

---

## 6️⃣ Configuración del editor

### VS Code (recomendado)

**Extensiones recomendadas:**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "nrwl.angular-console",
    "expo.vscode-expo-tools"
  ]
}
```

**Settings.json:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]"]
  ]
}
```

---

## 7️⃣ Troubleshooting inicial

### Problema: `pnpm: command not found`

```bash
# Reinstalar pnpm
npm install -g pnpm

# O usar npx
npx pnpm install
```

### Problema: `pod: command not found` (iOS)

```bash
# Instalar CocoaPods
brew install cocoapods

# O con Ruby
sudo gem install cocoapods

# Verificar
pod --version
```

### Problema: Error en `pnpm install`

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Problema: Puerto 4200 ocupado (web)

```bash
# Matar proceso en puerto 4200
lsof -ti:4200 | xargs kill -9

# O cambiar puerto
VITE_PORT=3000 pnpm dev:web
```

### Problema: Simulador iOS no inicia

```bash
# Reiniciar Xcode Command Line Tools
sudo xcode-select --reset

# Limpiar build
cd apps/mobile/ios
rm -rf build DerivedData
pod deintegrate
pod install
cd ../../..
```

### Problema: Emulador Android no inicia

```bash
# Verificar que Android SDK está instalado
$ANDROID_HOME/emulator/emulator -list-avds

# Recrear AVD si está corrupto
# Abrir Android Studio > AVD Manager > Delete > Create New
```

---

## 8️⃣ Siguientes pasos

Una vez que todo esté funcionando:

1. ✅ Lee [DEVELOPMENT.md](./DEVELOPMENT.md) para workflow de desarrollo
2. ✅ Revisa [API_INTEGRATION.md](./API_INTEGRATION.md) para usar la API
3. ✅ Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comunes
4. ✅ Lee [FRONT_ARCHITECTURE.md](../FRONT_ARCHITECTURE.md) para entender decisiones técnicas

---

## 🆘 Ayuda adicional

- **Problemas de setup**: Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Preguntas de desarrollo**: Ver [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Issues en GitHub**: https://github.com/eburgos-flx/flx-boilerplate-front/issues
- **Documentación Expo**: https://docs.expo.dev/
- **Documentación Nx**: https://nx.dev/

---

**¡Listo! Ahora puedes comenzar a desarrollar. 🎉**
