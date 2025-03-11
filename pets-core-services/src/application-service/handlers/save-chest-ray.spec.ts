import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededChestXray } from "../fixtures/chest-xray";
import { ChestXRayResult, YesOrNo } from "../types/enums";
import { SaveChestXrayEvent, saveChestXRayHandler } from "./save-chest-ray";

const newChestXrayTaken: SaveChestXrayEvent["parsedBody"] = {
  chestXrayTaken: YesOrNo.Yes,
  posteroAnteriorXray: "test/bucket/path/for/posterior/anterior",
  apicalLordoticXray: "test/bucket/path/for/apical/lordotic",
  lateralDecubitusXray: "test/bucket/path/for/lateral-decubitus",
  xrayResult: ChestXRayResult.NonTbAbnormal,
  xrayMinorFindings: ["test", "minor", "findings"],
  xrayAssociatedMinorFindings: ["test", "associated", "minor", "findings"],
  xrayActiveTbFindings: ["test", "active", "tb", "findings"],
};

describe("Test for Saving Chest X-ray into DB", () => {
  test("Saving a new Chest X-Ray Successfully", async () => {
    // Arrange
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newChestXrayTaken,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...saveChestXRayHandler,
      dateCreated: expect.any(String),
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingChestXray = seededChestXray[0];
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: existingChestXray,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Chest X-ray already saved" });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Chest X-Ray Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
