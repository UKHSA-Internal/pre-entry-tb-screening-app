import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  PurgeQueueCommand,
} from "@aws-sdk/client-sqs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: resolve(__dirname, "../../configs/.env.local.secrets"),
});
// Commenting to help with cutover and handover of scripts for maintenance
// Initialize SQS client
const createSQSClient = () => {
  return new SQSClient({
    region: process.env.AWS_REGION || "eu-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
    requestTimeout: 10000,
  });
};

// Function to get base URL based on environment
const getBaseUrl = () => {
  // Explicit CYPRESS_BASE_URL (Will's way - removing the explicit env set by CI workflow)
  if (process.env.CYPRESS_BASE_URL) {
    console.log(`Using CYPRESS_BASE_URL: ${process.env.CYPRESS_BASE_URL}`);
    return process.env.CYPRESS_BASE_URL;
  }

  // ENV_URL (for branch deployments - implement as 2nd priority)
  if (process.env.ENV_URL) {
    console.log(`Using ENV_URL: ${process.env.ENV_URL}`);
    return process.env.ENV_URL;
  }
  if (process.env.APP_DOMAIN) {
    console.log(`Using APP_DOMAIN: ${process.env.APP_DOMAIN}`);
    return process.env.APP_DOMAIN;
  }

  // Environment-based URLs
  const environment = process.env.ENVIRONMENT || process.env.TARGET_ENV;

  if (environment) {
    console.log(`Using ENVIRONMENT: ${environment}`);
    switch (environment.toLowerCase()) {
      case "qat":
      case "test":
        return "https://clinics.test.pets.ukhsa.gov.uk";
      case "dev":
        return "https://clinics.dev.pets.ukhsa.gov.uk";
      case "preprod":
        return "https://clinics.preprod.pets.ukhsa.gov.uk";
      case "local":
        return "http://localhost:3000"; // local dev
      default:
        console.warn(`Unknown environment: ${environment}, using test`);
        return "https://clinics.test.pets.ukhsa.gov.uk";
    }
  }

  // Default to localhost for local dev & test
  console.log("No environment specified, defaulting to localhost");
  return "http://localhost:3000";
};

// Function to determine if running in CI
const isCI = () => {
  return !!(process.env.CI || process.env.GITHUB_ACTIONS);
};

// Function to get environment-specific configuration
const getEnvironmentConfig = () => {
  const currentEnv = (process.env.ENVIRONMENT || process.env.TARGET_ENV || "local").toLowerCase();

  // Different timeouts for different environments
  const timeouts = {
    local: {
      defaultCommandTimeout: 4000,
      requestTimeout: 5000,
      responseTimeout: 30000,
    },
    qat: {
      defaultCommandTimeout: 10000,
      requestTimeout: 15000,
      responseTimeout: 60000,
    },
    dev: {
      defaultCommandTimeout: 10000,
      requestTimeout: 15000,
      responseTimeout: 60000,
    },
    preprod: {
      defaultCommandTimeout: 10000,
      requestTimeout: 15000,
      responseTimeout: 60000,
    },
  };

  return timeouts[currentEnv] || timeouts.local;
};

export default defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: true,
    json: true,
    timestamp: "mmddyyyy_HHMMss",
  },
  video: true,
  videosFolder:
    isCI() && process.env.ENVIRONMENT
      ? `cypress/videos/${process.env.ENVIRONMENT}`
      : "cypress/videos",
  screenshotOnRunFailure: true,
  screenshotsFolder:
    isCI() && process.env.ENVIRONMENT
      ? `cypress/screenshots/${process.env.ENVIRONMENT}`
      : "cypress/screenshots",
  e2e: {
    baseUrl: getBaseUrl(),
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    retries: isCI() ? 2 : 0, // Only retry in CI,
    setupNodeEvents: async (on, config) => {
      const currentEnv = (
        process.env.ENVIRONMENT ||
        process.env.TARGET_ENV ||
        "local"
      ).toLowerCase();

      console.log("=== Cypress Configuration ===");
      console.log(`Environment: ${currentEnv}`);
      console.log(`Base URL: ${config.baseUrl}`);
      console.log(`Running in CI: ${isCI()}`);
      console.log(`Retries: ${config.retries}`);
      console.log("============================");

      const sqsClient = createSQSClient();

      on("task", {
        async sendSQSMessage({ queueUrl, messageBody, messageAttributes = {} }) {
          try {
            console.log(`Sending SQS message to: ${queueUrl}`);

            const command = new SendMessageCommand({
              QueueUrl: queueUrl,
              MessageBody: messageBody,
              MessageAttributes:
                Object.keys(messageAttributes).length > 0 ? messageAttributes : undefined,
            });

            const result = await sqsClient.send(command);
            console.log(`Message sent with ID: ${result.MessageId}`);
            return result.MessageId;
          } catch (error) {
            console.error("Error sending SQS message:", error);
            throw error;
          }
        },

        async receiveSQSMessages({ queueUrl, maxMessages = 10, waitTimeSeconds = 5 }) {
          try {
            console.log(`Receiving messages from: ${queueUrl}`);

            const command = new ReceiveMessageCommand({
              QueueUrl: queueUrl,
              MaxNumberOfMessages: maxMessages,
              WaitTimeSeconds: waitTimeSeconds,
              MessageAttributeNames: ["All"],
              AttributeNames: ["All"],
            });

            const result = await sqsClient.send(command);
            const messages = result.Messages || [];
            console.log(`Received ${messages.length} messages`);
            return messages;
          } catch (error) {
            console.error("Error receiving SQS messages:", error);
            throw error;
          }
        },

        async deleteSQSMessage({ queueUrl, receiptHandle }) {
          try {
            console.log(`Deleting message from: ${queueUrl}`);

            const command = new DeleteMessageCommand({
              QueueUrl: queueUrl,
              ReceiptHandle: receiptHandle,
            });

            await sqsClient.send(command);
            console.log(`Message deleted successfully`);
            return null;
          } catch (error) {
            console.error("Error deleting SQS message:", error);
            throw error;
          }
        },

        async purgeSQSQueue(queueUrl) {
          try {
            console.log(`Purging queue: ${queueUrl}`);

            const command = new PurgeQueueCommand({
              QueueUrl: queueUrl,
            });

            await sqsClient.send(command);
            console.log(`Queue purged successfully`);
            return null;
          } catch (error) {
            console.error("Error purging SQS queue:", error);
            console.warn("Continuing despite purge error...");
            return null;
          }
        },

        async waitForSQSMessages({
          queueUrl,
          expectedCount = 1,
          timeout = 30000,
          pollInterval = 1000,
        }) {
          const startTime = Date.now();

          console.log(`Waiting for ${expectedCount} messages in queue: ${queueUrl}`);

          while (Date.now() - startTime < timeout) {
            try {
              const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 2,
                MessageAttributeNames: ["All"],
                AttributeNames: ["All"],
              });

              const result = await sqsClient.send(command);
              const messages = result.Messages || [];

              if (messages.length >= expectedCount) {
                console.log(`Found ${messages.length} messages (expected ${expectedCount})`);
                return messages;
              }

              console.log(`Found ${messages.length}/${expectedCount} messages, waiting...`);
              await new Promise((resolve) => setTimeout(resolve, pollInterval));
            } catch (error) {
              console.error("Error while waiting for messages:", error);
              await new Promise((resolve) => setTimeout(resolve, pollInterval));
            }
          }

          throw new Error(
            `Timeout: Expected ${expectedCount} messages but didn't receive them within ${timeout}ms`,
          );
        },
      });

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
    ...getEnvironmentConfig(), // Apply environment-specific timeouts
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
    CURRENT_ENVIRONMENT: process.env.ENVIRONMENT || process.env.TARGET_ENV || "local",
    PETS_SQS_QUEUE_URL: process.env.PETS_SQS_QUEUE_URL,
    PETS_DLQ_URL: process.env.PETS_DLQ_URL,
    // API-specific env vars for the new API tests
    API_BASE_URL: process.env.API_BASE_URL || `${getBaseUrl()}/api`,
    AUTH_TOKEN_ENDPOINT: process.env.AUTH_TOKEN_ENDPOINT,
    AZURE_B2C_CLIENT_ID: process.env.AZURE_B2C_CLIENT_ID,
    AZURE_B2C_SCOPE: process.env.AZURE_B2C_SCOPE,
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
  },
});
