import { execSync, spawn } from "child_process";
import * as dotenv from "dotenv";
import { resolve } from "path";

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    process.exit(1);
  }
}

const controller = new AbortController();
const { signal } = controller;
function runAsyncCommand(command) {
  const [cmd, ...args] = command.split(" ");
  const process = spawn(cmd, args, { stdio: "inherit", signal });

  process.on("error", () => {
    console.error(`Error in process`);
    controller.abort();
  });
  process.on("SIGINT", () => {
    console.log("Exiting all waiting processes...");
    controller.abort();
  });
}

dotenv.config({
  path: resolve(process.cwd(), "configs/.env"),
});

runCommand("git update-index --assume-unchanged pets-core-services/openapi-docs.json");
runCommand("pnpm rimraf pets-local-infra/cdk.out");
runCommand("docker compose down");
runCommand("pnpm --filter pets-core-services generate:swagger-doc"); // Generate swagger file for backend
runCommand("docker compose up -d --wait");
runAsyncCommand("pnpm --filter pets-local-infra build:core-services");
runCommand("pnpm --filter pets-local-infra bootstrap");
runCommand("pnpm --filter pets-local-infra deploy:local"); // Deploy to localstack
runCommand("pnpm --filter pets-core-services preload:db");
runCommand("pnpm --filter pets-ui dev"); // Starts Vite Server
