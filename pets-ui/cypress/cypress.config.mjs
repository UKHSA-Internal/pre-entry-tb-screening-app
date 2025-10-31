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
  path: resolve(__dirname, "../../configs/.env.local.secrets"), // Required only for local runs, CI environment secrets are retrieved from Actions Secrets
});

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
  // Prefer explicit environment variables set by CI workflow
  if (process.env.CYPRESS_BASE_URL) {
    return process.env.CYPRESS_BASE_URL;
  }
  if (process.env.ENV_URL) {
    return process.env.ENV_URL;
  }
  if (process.env.APP_DOMAIN) {
    return process.env.APP_DOMAIN;
  }

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
    // Static glob string for specPattern, as required by Cypress
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    experimentalStudio: true,
    retries: 2, // <-- Enable built-in test retries (change number if needed)
    setupNodeEvents: async (on, config) => {
      // Remove the cypress-mochawesome-reporter plugin setup
      // await setupMochawesomeReporter(on);

      const currentEnv = process.env.ENVIRONMENT || process.env.TARGET_ENV || "local";
      console.log(`Target Environment: ${currentEnv}`);
      console.log(`Base URL: ${config.baseUrl}`);

      if (!process.env.CI && !process.env.GITHUB_ACTIONS && currentEnv !== "local") {
        console.log(`Running LOCAL Cypress against ${currentEnv.toUpperCase()} environment`);
      }

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
    CURRENT_ENVIRONMENT: process.env.ENVIRONMENT || process.env.TARGET_ENV || "local",
    PETS_SQS_QUEUE_URL: process.env.PETS_SQS_QUEUE_URL,
    PETS_DLQ_URL: process.env.PETS_DLQ_URL,
  },
});
