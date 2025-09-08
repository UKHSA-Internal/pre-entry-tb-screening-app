import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { TaskStatus } from "../../shared/types/enum";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededSputumDecision } from "../fixtures/sputum-decision";
import { SputumDecision } from "../models/sputum-decision";
import { YesOrNo } from "../types/enums";
import { SaveSputumDecisionEvent, saveSputumDecisionHandler } from "./save-sputum-decision";

const newSputumDecisionDetails: SaveSputumDecisionEvent["parsedBody"] = {
  sputumRequired: YesOrNo.No,
};

describe("Test for Sputum Decision into DB", () => {
  test("Saving a new Sputum Decision Successfully", async () => {
    // Arrange
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newSputumDecisionDetails,
    };

    // Act
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newSputumDecisionDetails,
      dateCreated: expect.any(String),
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingSputumDecision = {
      ...seededSputumDecision[0],
      status: TaskStatus.completed,
      dateCreated: "2025-05-05",
    };
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: existingSputumDecision,
    };

    // Act
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Sputum Decision already saved" });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith("Event missing parsed body");
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Sputum Decision Request not parsed correctly",
    });
  });

  test("Failed validation returns a 400 response", async () => {
    // Arrange
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        ...newSputumDecisionDetails,
        // @ts-expect-error error
        sputumRequired: "IDK",
      },
    };

    // Act
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith("Validation failed", {
      fieldErrors: {
        sputumRequired: ["Invalid enum value. Expected 'Yes' | 'No', received 'IDK'"],
      },
      formErrors: [],
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Sputum Decision Request validation failed",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });

  test("Handling error while saving sputum decision", async () => {
    // Arrange;
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const errorMessage = "Couldn't save it";
    vi.spyOn(SputumDecision, "createSputumDecision").mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const event: SaveSputumDecisionEvent = {
      ...mockAPIGwEvent,
      parsedBody: { ...seededSputumDecision[1] },
    };

    // Act
    // await expect(saveSputumDecisionHandler(event)).resolves.toBe("noooo");
    const response = await saveSputumDecisionHandler(event);

    // Assert
    expect(response.statusCode).toEqual(500);
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error(errorMessage),
      "Error saving Sputum Decision",
    );
  });
});
