import { defineConfig, coverageConfigDefaults, defaultInclude } from 'vitest/config'
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
      // {
      //   // silenceDeprecations: ["import"],
      //   o
      //   api: "modern-compiler",
      // },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: [...defaultInclude, "**/*.intTest.?(c|m)[jt]s?(x)"],
    coverage: {
      include: ["**/src/components/**", "**/src/sections/**"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/src/components/devtools**",
      ],
      reporter: ["text", "html", "clover", "json", "lcov"],
    },
  },
});
