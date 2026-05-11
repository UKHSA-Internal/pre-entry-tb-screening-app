import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { SputumDecisionDbOps } from "../models/sputum-decision";
import { YesOrNo } from "../types/enums";
import { UpdateSputumDecisionEvent, updateSputumDecisionHandler } from "./update-sputum-decision";

const updateSputumDecisionDetails: UpdateSputumDecisionEvent["parsedBody"] = {
  sputumRequired: YesOrNo.No,
};

describe("Test for Updating Sputum Decision into DB", () => {
  test("Updating a Sputum Decision Successfully", async () => {
    // Arrange
    const event: UpdateSputumDecisionEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "true" },
      },
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: updateSputumDecisionDetails,
    };

    // Act
    const response = await updateSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...updateSputumDecisionDetails,
      dateUpdated: expect.any(String),
    });
  });

  test("Missing required body returns a 400 response", async () => {
    // Arrange
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const event: UpdateSputumDecisionEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await updateSputumDecisionHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith("Event missing parsed body");
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });

    const event: UpdateSputumDecisionEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "true" },
      },
    };

    // Act
    const response = await updateSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });

  test("Handling error while updating sputum decision", async () => {
    // Arrange;
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const errorMessage = "Couldn't update it";
    vi.spyOn(SputumDecisionDbOps, "updateSputumDecision").mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const event: UpdateSputumDecisionEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "true" },
      },
      parsedBody: {
        sputumRequired: YesOrNo.Yes,
      },
    };

    // Act
    const response = await updateSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toEqual(500);
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error(errorMessage),
      "Error updating Sputum Decision",
    );
  });
});
