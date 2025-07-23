// import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
// import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyResult } from "aws-lambda";
// import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";

import { logger } from "../../shared/logger";
// import { seededApplicants } from "../../applicant-service/fixtures/applicants";
// import awsClients from "../../shared/clients/aws";
// import { seededApplications } from "../../shared/fixtures/application";
// import { logger } from "../../shared/logger";
// import { PetsAPIGatewayProxyEvent } from "../../shared/types";
// import { TaskStatus } from "../../shared/types/enum";
import { context } from "../../test/mocks/events";
import { mainEvent } from "../tests/resources/stream-event";
// import {
//   ChestXRayResult,
//   MenstrualPeriods,
//   PregnancyStatus,
//   VisaOptions,
//   YesOrNo,
// } from "../types/enums";
import { handler } from "./integration";

describe("Test for Integration Lambda", () => {
  test("Fetching an application", async () => {
    // Arrange
    const infologgerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    // Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(mainEvent, context, () => {});

    // Assert
    expect(errorloggerMock).toHaveBeenCalledWith("error logs");
    expect(infologgerMock).toHaveBeenCalledWith("info logs");
    expect(response).toBe("the response");
    expect(response.statusCode).toBe(200);
  });
});
