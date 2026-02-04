import path from "path";
import { fileURLToPath } from "url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig as import("vite").UserConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: [path.join(__dirname, "src/test-setup.ts")],
      exclude: [...configDefaults.exclude, "node_modules", "dist"],
    },
  })
);
