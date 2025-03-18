import { KeyType, ProjectionType } from "@aws-sdk/client-dynamodb";
import { execSync } from "child_process";
import crypto from "crypto";
import { beforeAll, beforeEach } from "vitest";

import { createTable } from "./db-ops";
import { seedDatabase } from "./seed-data";

beforeAll(() => {
  const isPowerShell =
    !!process.env.PSModulePath || process.env.ComSpec?.toLowerCase().includes("powershell.exe");
  let shell = "/bin/bash";
  if (isPowerShell) {
    shell = "powershell.exe";
  }
  execSync("docker compose up -d --wait", { stdio: "inherit", shell });
});

beforeEach(async () => {
  process.env.APPLICANT_SERVICE_DATABASE_NAME = `test_applicant_table_${crypto.randomUUID()}`;
  const applicantServiceGSI = [
    {
      IndexName: process.env.PASSPORT_ID_INDEX,
      KeySchema: [{ KeyType: KeyType.HASH, AttributeName: "passportId" }],
      Projection: { ProjectionType: ProjectionType.ALL },
    },
  ];
  await createTable(
    process.env.APPLICANT_SERVICE_DATABASE_NAME,
    [
      {
        AttributeName: "passportId",
        AttributeType: "S",
      },
    ],
    applicantServiceGSI,
  );

  process.env.APPLICATION_SERVICE_DATABASE_NAME = `test_application_table_${crypto.randomUUID()}`;
  await createTable(process.env.APPLICATION_SERVICE_DATABASE_NAME, []);
  await seedDatabase();
}, 12000);
