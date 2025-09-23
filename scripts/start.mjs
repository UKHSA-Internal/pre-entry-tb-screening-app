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

function readAndExportEnvVars(filePath, requireq = []) {
  console.info(filePath);
  try {
    const secretsStr = readFileSync(filePath, "utf-8").toString();
    const secrets = parseEnv(secretsStr);
    const toExport = {};

    if (Object.keys(secrets).length === 0) {
      throw new Error(`Could not export vars from the file: ${filePath}`);
    }

    for (let key in secrets) {
      if (requireq.length === 0 || requireq.includes(key)) {
        toExport[key] = secrets[key];
      }
    }

    console.info("✅ Selected secrets exported as env vars");
    dotenv.populate(process.env, toExport);
  } catch (error) {
    console.error(`❌ Exporting secrets failed for env: ${process.env.ENVIRONMENT}`, error);
    // This should fail CI step/job
    process.exit(1);
  }
}

// Export vars from .env file
readAndExportEnvVars(resolve(process.cwd(), "configs/.env"));
// If it's not CI process, but on a dev's machine, then export some secrets, otherwise ignore it
if (
  !process.env.CI &&
  !process.env.GITHUB_ACTIONS &&
  process.env.ENVIRONMENT.toLocaleLowerCase() === "local"
) {
  // Export vars from .env.local.secret file
  // (only the ones that are included in REQUIRED_SECRETS)
  readAndExportEnvVars(resolve(process.cwd(), "configs/.env.local.secrets"), REQUIRED_SECRETS);
}

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
