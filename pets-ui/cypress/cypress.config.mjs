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

// Function to get base URL based on environment
const getBaseUrl = () => {
  // Check for explicit APP_DOMAIN first (highest priority)
  if (process.env.APP_DOMAIN) {
    return process.env.APP_DOMAIN;
  }

  // Check for environment-based URL selection (locally and in CI)
  const environment = process.env.ENVIRONMENT || process.env.TARGET_ENV;

  switch (environment) {
    case "qat":
      return "https://clinics.test.pets.ukhsa.gov.uk";
    case "dev":
      return "https://clinics.dev.pets.ukhsa.gov.uk";
    case "preprod":
      return "https://clinics.preprod.pets.ukhsa.gov.uk";
    default:
      return "http://localhost:3000";
  }
};

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    charts: true,
    reportPageTitle: `Pets UI Test Results${(process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT ? ` - ${process.env.ENVIRONMENT}` : ""}`,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: true,
    html: true,
    json: true,
  },
  video: true,
  videosFolder:
    (process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT
      ? `cypress/videos/${process.env.ENVIRONMENT}`
      : "cypress/videos",
  screenshotOnRunFailure: true,
  screenshotsFolder:
    (process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT
      ? `cypress/screenshots/${process.env.ENVIRONMENT}`
      : "cypress/screenshots",
  e2e: {
    baseUrl: getBaseUrl(),
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    setupNodeEvents: async (on, config) => {
      await setupMochawesomeReporter(on);

      // Log the target environment and URL for debugging
      const currentEnv = process.env.ENVIRONMENT || process.env.TARGET_ENV || "local";
      console.log(`🎯 Target Environment: ${currentEnv}`);
      console.log(`🌐 Base URL: ${config.baseUrl}`);

      // Warn if running against remote environment locally
      if (!process.env.CI && !process.env.GITHUB_ACTIONS && currentEnv !== "local") {
        console.log(`⚠️  Running LOCAL Cypress against ${currentEnv.toUpperCase()} environment`);
      }

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
    // Add environment-specific configuration (CI only)
    defaultCommandTimeout:
      (process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT !== "local"
        ? 10000
        : 4000,
    requestTimeout:
      (process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT !== "local"
        ? 15000
        : 5000,
    responseTimeout:
      (process.env.CI || process.env.GITHUB_ACTIONS) && process.env.ENVIRONMENT !== "local"
        ? 60000
        : 30000,
  },
  component: {
    supportFile: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  env: {
    ...process.env,
    // Make environment info available to tests
    CURRENT_ENVIRONMENT: process.env.ENVIRONMENT || process.env.TARGET_ENV || "local",
  },
});
