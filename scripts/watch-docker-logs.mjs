import { execSync, spawn } from "child_process";

console.log("Watching Lambda Logs");

const watchedContainers = new Set();

while (true) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const runningContainers = execSync('docker ps --format "{{.Names}}"').toString().split("\n");
  const newlambdaContainers = runningContainers
    .filter((containerName) => containerName.includes("lambda"))
    .filter((containerName) => !watchedContainers.has(containerName));

  newlambdaContainers.map((containerName) => {
    spawn("docker", ["logs", "-f", containerName], { stdio: "inherit" });
    watchedContainers.add(containerName);
  });
}
