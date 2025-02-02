import { execSync } from "child_process";
import concurrently from "concurrently";
import * as dotenv from "dotenv";
import { resolve } from "path";

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    process.exit(1);
  }
}

dotenv.config({
  path: resolve(process.cwd(), "configs/.env"),
});

runCommand("pnpm rimraf pets-core-services/openapi-docs.json");
runCommand("pnpm rimraf pets-local-infra/cdk.out");
runCommand("docker compose down");
runCommand("pnpm --filter 'pets-core-services' generate:swagger-doc"); // Generate swagger file for backend
runCommand("docker compose up -d --wait");
runCommand("pnpm --filter 'pets-local-infra' bootstrap");
runCommand("pnpm --filter 'pets-local-infra' deploy:local"); // Deploy to localstack
runCommand("pnpm --filter 'pets-ui' dev"); // Starts Vite Server

// TODO: Remove the List below
// Generate swagger file
// Docker
// Cdk deploy
// Potentially esbuild listeners
// Front end dev
