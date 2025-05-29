import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { SputumDetailsDbOps } from "../models/sputum-details";
import { SaveSputumDetailsEvent, saveSputumDetailsHandler } from "./save-sputum-details";

vi.mock("../models/Sputum-details", async () => {
  const actual = await vi.importActual<typeof import("../models/sputum-details")>(
    "../models/sputum-details",
  );
  return {
    ...actual,
    SputumDetailsDbOps: {
      createOrUpdateSputumDetails: vi.fn(),
    },
  };
});

const newSputumDetails: SaveSputumDetailsEvent["parsedBody"] = {
  sputumSamples: {
    sample1: {
      dateOfSputumSample: new Date().getDate.toString(),
      sputumCollectionMethod: "Venipuncture",
    },
  },
};

describe("Test for Saving Sputum Details into DB", () => {
  test("Saving a new Sputum Details successfully", async () => {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (SputumDetailsDbOps.createOrUpdateSputumDetails as any).mockResolvedValue({
      toJson: () => ({
        applicationId: seededApplications[0].applicationId,
        ...newSputumDetails,
        dateCreated: new Date().toISOString(),
      }),
    });

    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newSputumDetails,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "test1", createdBy: "user1" },
      },
    };

    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newSputumDetails,
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (SputumDetailsDbOps.createOrUpdateSputumDetails as any).mockRejectedValue(
      new ConditionalCheckFailedException({}),
    );

    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: newSputumDetails,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "test1", createdBy: "user1" },
      },
    };

    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Sputum Details already saved",
    });
  });

  test("Missing parsed body returns a 500 response", async () => {
    // Arrange
    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "test1", createdBy: "user1" },
      },
    };

    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Sputum Details Request not parsed correctly",
    });
  });

  test("Unexpected error returns a 500 response", async () => {
    // Arrange
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });

    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
