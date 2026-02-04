/**
 * Canonical API/proxy configuration. Imported by apps/web/vite.config.ts and apps/mobile app.config.
 * Single source of truth for prefix, target, and base URLs.
 */
export const apiConfig = {
  /** API path prefix (e.g. requests to /api/* are proxied to target in dev). */
  prefix: "/api",
  /** Backend target in development (Vite proxy and mobile dev). Using DummyJSON for demo. */
  target: "https://dummyjson.com",
  proxy: {
    "/api": {
      target: "https://dummyjson.com",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ""),
    },
  },
  apiBaseUrl: {
    dev: "" as string, // Empty to use Vite proxy in web; in mobile use target directly
    prod: "https://dummyjson.com" as string,
  },
  envVarNames: {
    web: "VITE_API_BASE_URL",
    mobile: "EXPO_PUBLIC_API_URL",
  },
} as const;

export type ApiConfig = typeof apiConfig;
