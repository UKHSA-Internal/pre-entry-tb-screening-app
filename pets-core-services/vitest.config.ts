import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "Pets Core Services Unit Tests",
          environment: "node",
          include: ["**/*.test.ts"],
          setupFiles: ["./src/test/vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "Pets Core Services Integration Tests",
          environment: "node",
          include: ["**/*.spec.ts"],
          hookTimeout: 300_000,
          testTimeout: 300_000,
          setupFiles: ["./src/test/vitest.setup.ts", "./src/test/vitest.setupIntegration.ts"],
        },
      },
    ],
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.js", "**/*.d.ts"],
      reporter: ["text", "html", "clover", "json", "lcov"],
    },
  },
});
