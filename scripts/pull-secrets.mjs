import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { writeFileSync } from "fs";
import assert from "assert";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AWS_CREDS_ERROR_MSG = "Set required variables, see Readme";
assert(process.env.AWS_ACCESS_KEY_ID, AWS_CREDS_ERROR_MSG);
assert(process.env.AWS_SECRET_ACCESS_KEY, AWS_CREDS_ERROR_MSG);
assert(process.env.AWS_SESSION_TOKEN, AWS_CREDS_ERROR_MSG);

const SECRET_NAME = "local-dev-secret";
const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

const ENV_FILE = join(__dirname, "../configs/.env.local.secrets");

async function fetchAndWriteSecret() {
  try {
    const command = new GetSecretValueCommand({ SecretId: SECRET_NAME });
    const { SecretString } = await client.send(command);

    if (!SecretString) {
      console.error("Secret is empty or not found. Perhaps deleted on AWS.");
      process.exit(1);
    }

    const secretObject = JSON.parse(SecretString); // Convert JSON string to object

    // Convert object to ENV format (KEY=VALUE)
    const envData = Object.entries(secretObject)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // Write to .env file
    writeFileSync(ENV_FILE, envData);
    console.log(`✅ Secrets written to ${ENV_FILE}`);
  } catch (error) {
    console.error("❌ Error retrieving secret:", error);
    process.exit(1);
  }
}

fetchAndWriteSecret();
