import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { Application } from "../../shared/models/application";
import { ApplicationStatus, ApplicationStatusGroup, TaskStatus } from "../../shared/types/enum";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { SputumDetailsDbOps } from "../models/sputum-details";
import { SputumCollectionMethod } from "../types/enums";
import { SaveSputumDetailsEvent, saveSputumDetailsHandler } from "./save-sputum-details";

const newSputumDetails: SaveSputumDetailsEvent["parsedBody"] = {
  sputumSamples: {
    sample1: {
      dateOfSample: new Date().toISOString(),
      collectionMethod: SputumCollectionMethod.COUGHED_UP,
      dateUpdated: new Date().toISOString(),
    },
  },
};

describe("Test for Saving Sputum Details into DB", () => {
  test("Saving a new Sputum Details successfully", async () => {
    // Arrange
    const dateCreated = new Date();
    const dateUpdated = new Date();

    const sputumDetails = {
      ...newSputumDetails,
      applicationId: seededApplications[0].applicationId,
      dateCreated: dateCreated,
      dateUpdated: dateUpdated,
      status: TaskStatus.incompleted,
      createdBy: "John Doe",
      version: 0,
    };

    vi.spyOn(SputumDetailsDbOps, "createOrUpdateSputumDetails").mockResolvedValueOnce({
      toJson: () => ({
        ...sputumDetails,
        dateCreated: dateCreated.toISOString(),
        dateUpdated: dateUpdated.toISOString(),
      }),
      ...sputumDetails,
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
    const updatedApplication = seededApplications[0];
    updatedApplication.applicationStatus = ApplicationStatus.sputumInProgress;
    updatedApplication.applicationStatusGroup = ApplicationStatusGroup.incomplete;
    const updateSpy = vi
      .spyOn(Application, "updateApplication")
      .mockResolvedValueOnce(updatedApplication as Application);
    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      dateCreated: dateCreated.toISOString(),
      ...newSputumDetails,
    });
    expect(updateSpy).toHaveBeenCalledWith({
      applicationId: seededApplications[0].applicationId,
      applicationStatus: ApplicationStatus.sputumInProgress,
      applicationStatusGroup: ApplicationStatusGroup.incomplete,
      updatedBy: "user1",
    });
  });

  test("Duplicate update request throws a 409 error", async () => {
    const conditionalError = Object.assign(new Error("Version mismatch"), {
      name: "ConditionalCheckFailedException",
    });
    vi.spyOn(SputumDetailsDbOps, "createOrUpdateSputumDetails").mockRejectedValueOnce(
      conditionalError,
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
    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Sputum Details already saved",
    });
  });

  test("Missing parsed body returns a 400 response", async () => {
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
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
    });
  });

  test("Invalid parsed sputum details request throws a 422 error", async () => {
    // Arrange

    const sputumDetails: SaveSputumDetailsEvent["parsedBody"] = {
      sputumSamples: {
        // @ts-expect-error: intentionally mocking partial event
        sample1: {
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-03-10T00:00:00.000Z"),
        },
      },
    };
    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "test1", createdBy: "user1" },
      },
      parsedBody: sputumDetails,
    };

    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Sputum Details Request validation failed",
    });
  });
  test("Update application failure returns a 500 response", async () => {
    // Arrange;
    const event: SaveSputumDetailsEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newSputumDetails,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "test1", createdBy: "user1" },
      },
    };
    vi.spyOn(Application, "updateApplication").mockRejectedValueOnce(new Error("DB failure"));
    // Act
    const response = await saveSputumDetailsHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
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
