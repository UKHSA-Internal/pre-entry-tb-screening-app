import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "firefox") {
          launchOptions.preferences["network.proxy.testing_localhost_is_secure_when_hijacked"] =
            true;
        }
        return launchOptions;
      });
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
