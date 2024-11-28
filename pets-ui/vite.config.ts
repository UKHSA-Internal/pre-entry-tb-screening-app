import { defineConfig, coverageConfigDefaults } from 'vitest/config'
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      include: [
        '**/src/components/**',
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
      ],
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
    },
  },
});
