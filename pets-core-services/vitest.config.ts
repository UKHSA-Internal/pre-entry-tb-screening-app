import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.js", "**/*.d.ts"],
      reporter: ["text", "html", "clover", "json", "lcov"],
    },
  },
});
