import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { apiConfig } from "../../tools/api-config/src/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  root: appRoot,
  publicDir: path.join(appRoot, "public"),
  plugins: [react(), tailwindcss()],
  server: {
    proxy: apiConfig.proxy,
  },
  resolve: {
    alias: {
      "@flx-front/shared/util": path.join(monorepoRoot, "libs/shared/util/src"),
      "@flx-front/shared/store": path.join(
        monorepoRoot,
        "libs/shared/store/src",
      ),
      "@flx-front/shared/data-access": path.join(
        monorepoRoot,
        "libs/shared/data-access/src",
      ),
      "@flx-front/ui-web": path.join(monorepoRoot, "libs/ui/src/web"),
    },
  },
});
