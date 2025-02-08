import { execSync } from "child_process";
import crypto from "crypto";
import { beforeAll, beforeEach } from "vitest";

import { createTable } from "./db-ops";
import { seedDatabase } from "./seed-data";

beforeAll(() => {
  execSync(" docker compose up -d --wait", { stdio: "inherit" });
});

beforeEach(async () => {
  process.env.APPLICANT_SERVICE_DATABASE_NAME = `test_applicant_table_${crypto.randomUUID()}`;
  await createTable(process.env.APPLICANT_SERVICE_DATABASE_NAME);
  await seedDatabase();
}, 12000);
