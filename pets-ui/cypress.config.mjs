import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    supportFile: false,
    devServer: {
      framework: "react",
      bundler: "vite"
    },
  },
});
