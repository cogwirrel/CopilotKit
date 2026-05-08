import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // react-native uses Flow syntax that vite/rollup cannot parse.
      // This alias redirects to a minimal stub for test environments.
      "react-native": path.resolve(
        __dirname,
        "src/__mocks__/react-native.ts",
      ),
      // react-native-streamdown is a peer dependency that won't be installed
      // in the monorepo dev environment; tests mock it via vi.mock().
      // This alias prevents vite's import-analysis from failing on the import.
      "react-native-streamdown": path.resolve(
        __dirname,
        "src/__mocks__/react-native-streamdown.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./src/__tests__/setup.ts"],
    reporters: [["default", { summary: false }]],
    silent: true,
    server: {
      deps: {
        inline: [/@copilotkit/],
      },
    },
  },
});
