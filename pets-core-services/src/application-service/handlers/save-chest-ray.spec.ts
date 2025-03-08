import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededChestXray } from "../fixtures/chest-xray";
import { YesOrNo } from "../types/enums";
import { SaveChestXrayEvent, saveChestXRayHandler } from "./save-chest-ray";

const newChestXrayTaken: SaveChestXrayEvent["parsedBody"] = {
  chestXrayTaken: YesOrNo.Yes,
  posteroAnteriorXray: "test/bucket/path/for/posterior/anterior",
  apicalLordoticXray: "test/bucket/path/for/apical/lordotic",
  lateralDecubitusXray: "test/bucket/path/for/lateral-decubitus",
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

  test("Missing application throws  400 error", async () => {
    // Arrange
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody: newChestXrayTaken,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Mismatch in Clinic ID throws a 400 error", async () => {
    // Arrange
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      parsedBody: newChestXrayTaken,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id mismatch",
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
      message: "Internal Server Error: Request not parsed correctly",
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
