import * as dotenv from "dotenv";
import concurrently from "concurrently";
import { execSync } from "child_process";
import { resolve } from "path";

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

// Export vars from .env file
dotenv.config({
  path: resolve(process.cwd(), "configs/.env"),
});

// If it's not CI process, but on a dev's machine, then export secrets
if (
  !process.env.CI &&
  !process.env.GITHUB_ACTIONS &&
  process.env.ENVIRONMENT.toLocaleLowerCase() === "local"
) {
  // Export vars from .env.local.secret file
  dotenv.config({
    path: resolve(process.cwd(), "configs/.env.local.secrets"),
  });
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
