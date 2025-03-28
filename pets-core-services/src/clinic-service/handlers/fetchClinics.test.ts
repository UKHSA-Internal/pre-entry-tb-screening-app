import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test } from "vitest";

import awsClients from "../../shared/clients/aws";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { fetchClinicsHandler } from "./fetchClinics";

describe("Fetching Clinic", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  test("success response", async () => {
    ddbMock.on(ScanCommand);
    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });
});
