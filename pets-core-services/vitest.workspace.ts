import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
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
      include: ["**/*.spec.ts"],
      setupFiles: ["./src/test/vitest.setup.ts", "./src/test/vitest.setupIntegration.ts"],
    },
  },
]);
