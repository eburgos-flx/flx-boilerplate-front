# 🚀 Deployment - Despliegue

Guía completa para desplegar las aplicaciones web y mobile en diferentes entornos.

## 📋 Checklist pre-deployment

### Web

- [ ] Variables de entorno configuradas
- [ ] Build exitoso localmente (`pnpm build:web`)
- [ ] Tests pasando (`pnpm test`)
- [ ] Lint sin errores (`pnpm lint`)
- [ ] API backend corriendo en producción
- [ ] Dominio configurado (opcional)

### Mobile

- [ ] App name y bundle ID configurados
- [ ] Variables de entorno configuradas
- [ ] Build exitoso localmente
- [ ] Tests pasando
- [ ] Íconos y splash screen configurados
- [ ] Permisos declarados correctamente
- [ ] Cuenta de Apple Developer (iOS)
- [ ] Google Play Console configurada (Android)

---

## 🌐 Web Deployment

### Opción 1: Vercel (Recomendado)

**Características:**

- ✅ Deploy automático desde Git
- ✅ Preview deployments en PRs
- ✅ CDN global
- ✅ Configuración de dominio simple
- ✅ Analytics incluido
- ✅ Gratis para proyectos personales

**Setup:**

```bash
# 1. Instalar Vercel CLI
pnpm add -g vercel

# 2. Login
vercel login

# 3. Link proyecto
cd apps/web
vercel link

# 4. Deploy a preview
vercel

# 5. Deploy a producción
vercel --prod
```

**Configuración (vercel.json):**

```json
{
  "buildCommand": "cd ../.. && pnpm build:web",
  "outputDirectory": "dist",
  "devCommand": "cd ../.. && pnpm dev:web",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://dummyjson.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

**Variables de entorno en Vercel:**

```bash
# Dashboard > Settings > Environment Variables
VITE_API_BASE_URL=https://api.tubackend.com
VITE_APP_ENV=production
```

**Deploy automático con GitHub:**

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Seleccionar tu repo
4. Root Directory: `apps/web`
5. Build Command: `cd ../.. && pnpm build:web`
6. Output Directory: `dist`
7. Install Command: `cd ../.. && pnpm install`
8. Deploy

---

### Opción 2: Netlify

**Setup:**

```bash
# 1. Instalar Netlify CLI
pnpm add -g netlify-cli

# 2. Login
netlify login

# 3. Link proyecto
cd apps/web
netlify link

# 4. Deploy
netlify deploy

# 5. Deploy a producción
netlify deploy --prod
```

**Configuración (netlify.toml):**

```toml
[build]
  command = "cd ../.. && pnpm build:web"
  publish = "dist"
  base = "apps/web"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "https://dummyjson.com/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

### Opción 3: AWS S3 + CloudFront

**Setup:**

```bash
# 1. Build
pnpm build:web

# 2. Instalar AWS CLI
brew install awscli  # macOS
# o descargar desde: https://aws.amazon.com/cli/

# 3. Configurar credenciales
aws configure

# 4. Crear bucket S3
aws s3 mb s3://mi-app-web

# 5. Subir archivos
aws s3 sync apps/web/dist s3://mi-app-web --delete

# 6. Configurar como sitio web
aws s3 website s3://mi-app-web --index-document index.html --error-document index.html

# 7. Configurar CloudFront (opcional, para CDN y HTTPS)
# Seguir guía: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html
```

---

### Opción 4: Self-hosted (VPS)

**Setup con Nginx:**

```bash
# 1. Conectar a servidor
ssh user@tu-servidor.com

# 2. Instalar Nginx
sudo apt update
sudo apt install nginx

# 3. Crear directorio para app
sudo mkdir -p /var/www/mi-app

# 4. Desde local, build y subir
pnpm build:web
scp -r apps/web/dist/* user@tu-servidor.com:/var/www/mi-app/

# 5. En servidor, configurar Nginx
sudo nano /etc/nginx/sites-available/mi-app

# Contenido:
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/mi-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://dummyjson.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 6. Activar sitio
sudo ln -s /etc/nginx/sites-available/mi-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. Configurar HTTPS con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📱 Mobile Deployment

### Opción 1: EAS Build (Recomendado)

**Características:**

- ✅ Build en la nube
- ✅ Configuración simple
- ✅ Submit a stores desde CLI
- ✅ Update OTA con EAS Update
- ✅ Gratis para proyectos pequeños

**Setup inicial:**

```bash
# 1. Instalar EAS CLI
pnpm add -g eas-cli

# 2. Login
eas login

# 3. Configurar proyecto
cd apps/mobile
eas build:configure

# 4. Crear eas.json (generado automáticamente)
```

**Configuración (eas.json):**

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.tubackend.com",
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "tu-email@apple.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD1234EF"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

### iOS - App Store

**Requisitos previos:**

1. **Apple Developer Account** ($99/año)
   - Registro: [developer.apple.com/programs](https://developer.apple.com/programs/)

2. **App ID configurado**
   - [developer.apple.com/account](https://developer.apple.com/account/resources/identifiers/list)
   - Create > App IDs > App
   - Bundle ID: `com.tuempresa.flxboilerplate`

3. **App creada en App Store Connect**
   - [appstoreconnect.apple.com](https://appstoreconnect.apple.com/)
   - My Apps > + > New App
   - Platform: iOS
   - Name: Flx Boilerplate
   - Bundle ID: (seleccionar el creado)

**Build y submit:**

```bash
# 1. Build para iOS
eas build --platform ios --profile production

# Proceso tarda ~15-20 minutos
# Al finalizar, descarga IPA y/o sube a TestFlight automáticamente

# 2. Submit a App Store (opcional, si no se hizo en build)
eas submit --platform ios --profile production

# 3. Seguir prompts:
#    - Apple ID
#    - App-specific password (generar en appleid.apple.com)
#    - Seleccionar build
```

**Preparar para review:**

En App Store Connect:

1. **App Information**
   - Name: Flx Boilerplate Front
   - Category: Developer Tools (o tu categoría)
   - Content Rights: (completar)

2. **Pricing and Availability**
   - Price: Free
   - Availability: All countries

3. **App Privacy**
   - Privacy Policy URL
   - Data types collected (completar según tu app)

4. **Prepare for Submission**
   - Screenshots (required para cada tamaño de pantalla)
   - Description
   - Keywords
   - Support URL
   - Marketing URL (opcional)

5. **Submit for Review**

---

### Android - Google Play

**Requisitos previos:**

1. **Google Play Developer Account** ($25 única vez)
   - Registro: [play.google.com/console/signup](https://play.google.com/console/signup)

2. **App creada en Google Play Console**
   - [play.google.com/console](https://play.google.com/console/)
   - Create app
   - App name: Flx Boilerplate Front
   - Default language: Spanish
   - App or game: App
   - Free or paid: Free

3. **Service Account Key (para automatizar submit)**
   - Google Cloud Console > IAM & Admin > Service Accounts
   - Create Service Account
   - Grant "Service Account User" role
   - Keys > Add Key > JSON
   - Guardar JSON en `apps/mobile/google-service-account.json`
   - ⚠️ Agregar a `.gitignore`

**Build y submit:**

```bash
# 1. Build para Android
eas build --platform android --profile production

# Proceso tarda ~10-15 minutos
# Al finalizar, descarga AAB

# 2. Submit a Google Play (internal track)
eas submit --platform android --profile production

# 3. Seguir prompts:
#    - Service account key path
#    - Track: internal/alpha/beta/production
```

**Preparar para release:**

En Google Play Console:

1. **Store presence > Main store listing**
   - App name
   - Short description (80 chars)
   - Full description (4000 chars)
   - App icon (512x512 PNG)
   - Feature graphic (1024x500)
   - Screenshots (mínimo 2 por tipo de dispositivo)

2. **Store settings**
   - App category
   - Contact details
   - Privacy policy URL

3. **Release > Production**
   - Create new release
   - Upload AAB from EAS Build
   - Release name and notes
   - Review and rollout

---

### Opción 2: Expo Go (Solo desarrollo)

⚠️ **No usar para producción**

```bash
# Publicar a Expo servers (para testing con Expo Go)
cd apps/mobile
npx expo publish

# Usuarios pueden escanear QR con Expo Go
```

---

### Opción 3: EAS Update (OTA Updates)

**Características:**

- ✅ Actualizar JS/assets sin nueva build
- ✅ Deploy instantáneo
- ✅ Rollback fácil
- ❌ No actualiza código nativo

**Setup:**

```bash
# 1. Configurar en app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}

# 2. Build inicial con updates habilitado
eas build --platform all --profile production

# 3. Publicar update
eas update --branch production --message "Fix login bug"

# App automáticamente descarga update en próximo cold start
```

---

## 🔐 Secrets y Variables

### Web

**Local (.env):**

```bash
VITE_API_BASE_URL=/api
VITE_APP_ENV=development
```

**Production (Vercel/Netlify Dashboard):**

```bash
VITE_API_BASE_URL=https://api.tubackend.com
VITE_APP_ENV=production
```

### Mobile

**Local (.env):**

```bash
EXPO_PUBLIC_API_URL=https://dummyjson.com
EXPO_PUBLIC_APP_ENV=development
```

**Production (eas.json > build > production > env):**

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.tubackend.com",
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    }
  }
}
```

**Secrets sensibles (eas secret):**

```bash
# Crear secret
eas secret:create --scope project --name API_KEY --value "tu-api-key"

# Usar en eas.json
{
  "build": {
    "production": {
      "env": {
        "API_KEY": "@API_KEY"
      }
    }
  }
}
```

---

## 🔄 CI/CD con GitHub Actions

### Web

```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web

on:
  push:
    branches: [main]
    paths:
      - "apps/web/**"
      - "libs/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build:web
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web
```

### Mobile

```yaml
# .github/workflows/deploy-mobile.yml
name: Deploy Mobile

on:
  push:
    branches: [main]
    paths:
      - "apps/mobile/**"
      - "libs/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: "pnpm"

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: pnpm install

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive
        working-directory: ./apps/mobile

      - name: Build Android
        run: eas build --platform android --profile production --non-interactive
        working-directory: ./apps/mobile

      - name: Submit to stores
        run: |
          eas submit --platform ios --profile production --non-interactive
          eas submit --platform android --profile production --non-interactive
        working-directory: ./apps/mobile
```

---

## 📊 Monitoring y Analytics

### Web

**Vercel Analytics:**

```tsx
// apps/web/src/main.tsx
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Analytics />
  </>,
);
```

**Google Analytics:**

```bash
pnpm add react-ga4
```

```tsx
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXXXXX");

// Track pageviews
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

### Mobile

**Expo Analytics (Firebase):**

```bash
pnpm add expo-firebase-analytics -w --filter mobile
```

```tsx
import * as Analytics from "expo-firebase-analytics";

// Track events
Analytics.logEvent("login", { method: "email" });
```

---

## 🐛 Error Tracking

### Sentry

```bash
# Web
pnpm add @sentry/react -w --filter web

# Mobile
pnpm add @sentry/react-native -w --filter mobile
```

**Web:**

```tsx
// apps/web/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
```

**Mobile:**

```tsx
// apps/mobile/App.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.EXPO_PUBLIC_APP_ENV,
});

export default Sentry.wrap(App);
```

---

## ✅ Post-deployment Checklist

### Web

- [ ] App carga correctamente en producción
- [ ] API calls funcionan
- [ ] Login/logout funciona
- [ ] Todas las rutas accesibles
- [ ] Performance > 90 en Lighthouse
- [ ] SEO básico configurado
- [ ] Analytics tracking
- [ ] Error tracking configurado

### Mobile

- [ ] App instala correctamente
- [ ] Login funciona
- [ ] API calls funcionan
- [ ] Navegación fluida
- [ ] Permisos solicitados correctamente
- [ ] Push notifications (si aplica)
- [ ] Deep links (si aplica)
- [ ] App no crashea

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**¡Listo para producción! 🚀**
