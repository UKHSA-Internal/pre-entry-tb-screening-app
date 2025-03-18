import * as dotenv from "dotenv";
import { resolve } from "path";
import concurrently from "concurrently";
import { execSync } from "child_process";

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

dotenv.config({
  path: resolve(process.cwd(), "configs/.env"),
});

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
