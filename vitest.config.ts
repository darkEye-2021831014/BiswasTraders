import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest config for the pure-math library tests.
 *
 * We keep it minimal: the project uses the same `@/*` alias as the
 * Next app, and only the `src/lib/**` files are unit-tested here.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/lib/**/*.test.ts", "src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
