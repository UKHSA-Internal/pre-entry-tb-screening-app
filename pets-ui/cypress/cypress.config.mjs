import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupMochawesomeReporter(on) {
  const reporter = await import("cypress-mochawesome-reporter/plugin");
  reporter.default(on);
}

dotenv.config({
  path: resolve(__dirname, "../../configs/.env.local.secrets"), // Required only for local runs, CI environment secrets are retrieved from Actions Secrets
});

export default defineConfig({

  e2e: {
    baseUrl: process.env.APP_DOMAIN ?? "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    setupNodeEvents: async (on, config) => {
      await setupMochawesomeReporter(on);

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "firefox") {
          launchOptions.preferences["network.proxy.testing_localhost_is_secure_when_hijacked"] =
            true;
        }
        return launchOptions;
      });

      return config;
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
