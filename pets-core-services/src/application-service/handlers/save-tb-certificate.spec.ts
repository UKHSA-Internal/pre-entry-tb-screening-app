import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededTbCertificate } from "../fixtures/tb-certificate";
import { YesOrNo } from "../types/enums";
import { SaveTbCertificateEvent, saveTbCertificateHandler } from "./save-tb-certificate";

const newTbCertificate: SaveTbCertificateEvent["parsedBody"] = {
  certificateIssued: YesOrNo.Yes,
  certificateComments: "comments",
  certificateIssueDate: "2025-01-21",
  certificateNumber: "123456",
};

describe("Test for Saving TB Certificate into DB", () => {
  test("Saving a new TB Certificate Successfully", async () => {
    // Arrange
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newTbCertificate,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newTbCertificate,
      dateCreated: expect.any(String),
    });
  });

  test("Missing application throws a 400 error", async () => {
    // Arrange
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody: newTbCertificate,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Mismatch in Clinic ID throws a 400 error", async () => {
    // Arrange
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      parsedBody: newTbCertificate,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id mismatch",
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingTbCertificate = seededTbCertificate[0];
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: existingTbCertificate,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "TB Certificate already saved" });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

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
    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveTbCertificateHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
