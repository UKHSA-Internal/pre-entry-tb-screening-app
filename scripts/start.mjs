import * as dotenv from "dotenv";
import concurrently from "concurrently";
import { execSync } from "child_process";
import { resolve } from "path";

console.log("Defining shell...");
const isWindows = process.platform === "win32";
const shell = isWindows ? "powershell.exe" : "/bin/bash";
console.log("Shell defined:", shell);

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit", shell });
  } catch (error) {
    console.error("Cmd failed:", cmd);
    process.exit(1);
  }
}

console.log("Exporting env vars...");
// Export vars from .env file
dotenv.config({
  path: resolve(process.cwd(), "configs/.env"),
});
console.log("Env vars exported.");

// If it's not CI process, but on a dev's machine, then export secrets
if (
  !process.env.CI &&
  !process.env.GITHUB_ACTIONS &&
  process.env.ENVIRONMENT.toLocaleLowerCase() === "local"
) {
  console.log("Exporting local secrets...");
  // Export vars from .env.local.secret file
  dotenv.config({
    path: resolve(process.cwd(), "configs/.env.local.secrets"),
  });
}

console.log("Starting service...");
runCommand("git update-index --assume-unchanged pets-core-services/openapi-docs.json");
runCommand("pnpm rimraf pets-local-infra/cdk.out");
console.log("Removing old containers...");
runCommand("docker compose down");
console.log("Old containers removed. Generating swagger file...");
runCommand("pnpm --filter pets-core-services generate:swagger-doc"); // Generate swagger file for backend
console.log("Swagger file generated. Running docker compose...");
runCommand("docker compose up -d --wait");
console.log("Docker compose run. Building local infra...");
runCommand("pnpm --filter pets-local-infra build:core-services");
runCommand("pnpm --filter pets-local-infra bootstrap");
runCommand("pnpm --filter pets-local-infra deploy:local"); // Deploy to localstack
runCommand("pnpm --filter pets-core-services preload:db");
console.log("Local infra built. Starting service...");

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
