import dotenv from "dotenv";
import concurrently from "concurrently";
import { execSync } from "child_process";
import { parseEnv } from "util";
import { readFileSync } from "fs";
import { resolve } from "path";

// Add here whatever should be exported as env vars from .env.local.secrets file
const REQUIRED_SECRETS = ["VITE_MSAL_CLIENT_ID", "VITE_MSAL_TENANT_ID"];

const isPowerShell =
  !!process.env.PSModulePath || process.env.ComSpec?.toLowerCase().includes("powershell.exe");
let shell = "/bin/bash";
if (isPowerShell) {
  shell = "powershell.exe";
}

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit", shell });
  } catch (error) {
    process.exit(1);
  }
}

async function readAndExportEnvVars(filePath) {
  console.info(filePath);
  try {
    const secretsStr = readFileSync(filePath, "utf-8").toString();
    const secrets = parseEnv(secretsStr);
    const toExport = {};

    for (let key in secrets) {
      // const key = k.trim();

      if (
        !filePath.endsWith(".local.secrets") ||
        (filePath.endsWith(".local.secrets") && REQUIRED_SECRETS.includes(key))
      ) {
        toExport[key] = secrets[key];
      }
    }

    console.info("✅ Selected secrets exported as env vars");
    dotenv.populate(process.env, toExport);
  } catch (error) {
    console.error("❌ Exporting secrets failed:", error);
    process.exit(1);
  }
}

// Export vars from .env file
readAndExportEnvVars(resolve(process.cwd(), "configs/.env"));
// Export vars from .env.local.secret file (only from REQUIRED_SECRETS)
readAndExportEnvVars(resolve(process.cwd(), "configs/.env.local.secrets"));

runCommand("git update-index --assume-unchanged pets-core-services/openapi-docs.json");
runCommand("pnpm rimraf pets-local-infra/cdk.out");
runCommand("docker compose down");
runCommand("pnpm --filter pets-core-services generate:swagger-doc"); // Generate swagger file for backend
runCommand("docker compose up -d --wait");
runCommand("pnpm --filter pets-local-infra build:core-services");
runCommand("pnpm --filter pets-local-infra bootstrap");
runCommand("pnpm --filter pets-local-infra deploy:local"); // Deploy to localstack
runCommand("pnpm --filter pets-core-services preload:db");

concurrently(
  [
    "pnpm --filter pets-local-infra watch:core-services",
    "pnpm --filter pets-ui dev", // Starts Vite Server
    "pnpm watch:lambda-logs", // Logs of Backend Services
  ],
  {
    killOthers: ["failure", "success"],
  },
);
