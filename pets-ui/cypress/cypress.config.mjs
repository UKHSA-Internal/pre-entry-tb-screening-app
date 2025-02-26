import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "support/e2e.ts",
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    //chromeWebSecurity: false,
    modifyObstructiveCode: true,
  },
  component: {
    supportFile: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
