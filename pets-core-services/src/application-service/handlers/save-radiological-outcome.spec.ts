import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededRadiologicalOutcome } from "../fixtures/radiological-outcome";
import {
  SaveRadiologicalOutcomeEvent,
  saveRadiologicalOutcomeHandler,
} from "./save-radiological-outcome";

const newRadiologicalOutcomeDetails: SaveRadiologicalOutcomeEvent["parsedBody"] = {
  xrayResult: "Chest X-ray normal",
  xrayResultDetail: "Result details",
  xrayMinorFindings: ["Minor Findings"],
  xrayAssociatedMinorFindings: ["Associated Minor Findings"],
  xrayActiveTbFindings: ["Active TB Findings"],
};

describe("Test for Saving Radiological Outcome into DB", () => {
  test("Saving a new Radiological Outcome Successfully", async () => {
    // Arrange
    const event: SaveRadiologicalOutcomeEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newRadiologicalOutcomeDetails,
    };

    // Act
    const response = await saveRadiologicalOutcomeHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newRadiologicalOutcomeDetails,
      dateCreated: expect.any(String),
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingRadiologicalOutcome = seededRadiologicalOutcome[0];
    const event: SaveRadiologicalOutcomeEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: existingRadiologicalOutcome,
    };

    // Act
    const response = await saveRadiologicalOutcomeHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Radiological Outcome already saved",
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveRadiologicalOutcomeEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveRadiologicalOutcomeHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Radiological Outcome Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: SaveRadiologicalOutcomeEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveRadiologicalOutcomeHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
