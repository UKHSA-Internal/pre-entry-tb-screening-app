import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededChestXray } from "../fixtures/chest-xray";
import { ChestXRayResult, YesOrNo } from "../types/enums";
import { SaveChestXrayEvent, saveChestXRayHandler } from "./save-chest-ray";

const newChestXrayTaken: SaveChestXrayEvent["parsedBody"] = {
  chestXrayTaken: YesOrNo.Yes,
  posteroAnteriorXrayFileName: "posterior-anterior.dicom",
  posteroAnteriorXray: "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/postero-anterior.dcm",
  apicalLordoticXrayFileName: "apical-lordotic.dicom",
  apicalLordoticXray: "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/apical-lordotic.dcm",
  lateralDecubitusXrayFileName: "lateral-decubitus.dicom",
  lateralDecubitusXray:
    "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/lateral-decubitus.dcm",
  xrayResult: ChestXRayResult.NonTbAbnormal,
  xrayMinorFindings: ["test", "minor", "findings"],
  xrayAssociatedMinorFindings: ["test", "associated", "minor", "findings"],
  xrayActiveTbFindings: ["test", "active", "tb", "findings"],
};

describe("Test for Saving Chest X-ray into DB", () => {
  const s3ClientMock = mockClient(awsClients.s3Client);

  beforeEach(() => {
    s3ClientMock.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });
  });

  afterEach(() => {
    s3ClientMock.reset();
  });

  test("Saving a new Chest X-Ray Successfully", async () => {
    // Arrange
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[3].applicationId },
      parsedBody: newChestXrayTaken,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[3].applicationId,
      ...newChestXrayTaken,
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

  test("Invalid Object Key for any image throws a 400 error", async () => {
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[3].applicationId },
      parsedBody: {
        ...newChestXrayTaken,
        posteroAnteriorXray: "invalid-object-key",
      },
    };

    // Act
    const response = await saveChestXRayHandler(event);
    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Malformed Payload",
    });
  });

  test("Missing Object in S3 for any image throws a 400 error", async () => {
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[3].applicationId },
      parsedBody: newChestXrayTaken,
    };

    s3ClientMock.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 404,
      },
    });

    // Act
    const response = await saveChestXRayHandler(event);

    // Act
    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Missing Images",
    });
  });

  test("Missing Applicant throws a 400 error", async () => {
    const event: SaveChestXrayEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newChestXrayTaken,
    };

    // Act
    const response = await saveChestXRayHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Invalid Application - No Applicant",
    });
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
