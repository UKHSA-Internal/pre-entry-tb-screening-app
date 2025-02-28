import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Move this out of here
// TODO: Git Secrets also
dotenv.config({
  path: resolve(__dirname, "../../configs/.env.local"),
});

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
    modifyObstructiveCode: true,
  },
  component: {
    supportFile: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  env: { ...process.env },
});
