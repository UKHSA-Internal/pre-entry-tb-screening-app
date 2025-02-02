import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defaultInclude, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  clearScreen: false,
  server: {
    open: true,
    host: true,
    port: 3000,
    proxy: {
      "/api/": {
        target: `https://${process.env.API_GATEWAY_NAME}.execute-api.localhost.localstack.cloud:4566/${process.env.API_GATEWAY_STAGE}/`,
        changeOrigin: true,
      },
    },
  },
  envDir: "../configs", // Automatically loads the .env in this directory.
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: [...defaultInclude, "**/*.intTest.?(c|m)[jt]s?(x)"],
    coverage: {
      include: ["**/src/components/**", "**/src/sections/**"],
      exclude: [...coverageConfigDefaults.exclude, "**/src/components/devtools**"],
      reporter: ["text", "html", "clover", "json", "lcov"],
    },
  },
});
