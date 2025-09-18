import { afterEach, describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { ImageType } from "../types/enums";
import {
  generateImageUploadUrlHandler,
  GenerateUploadEvent,
  ImageUploadUrlRequestSchema,
} from "./generate-image-upload-url";

describe("Generating signed PUT url for DICOM Upload", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const uploadInfo: ImageUploadUrlRequestSchema = {
    fileName: "test-file-name",
    checksum: "test-checksum",
    imageType: ImageType.Dicom,
  };

  test("Upload url should be generated successfully", async () => {
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadUrl: expect.stringContaining(
        "http://test.co.uk/dicom/Apollo%20Clinic/BRB/ABC1234JANE/generated-app-id-2/test-file-name",
      ),
      bucketPath: "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/test-file-name",
    });
  });

  test("400 error when applicant info is missing", async () => {
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Invalid Application - No Applicant",
    });
  });

  test("Local Environment", async () => {
    // Arrange
    // process.env.ENVIRONMENT = "TEST_LOCAL";

    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(JSON.parse(response.body)).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadUrl: expect.stringContaining(
        "http://test.co.uk/dicom/Apollo%20Clinic/BRB/ABC1234JANE/generated-app-id-2/test-file-name",
      ),
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Generate Upload URL Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});

describe("Generating signed PUT url for Photo Upload", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const uploadInfo: ImageUploadUrlRequestSchema = {
    fileName: "applicant-photo.jpg",
    checksum: "test-checksum",
    imageType: ImageType.Photo,
  };

  test("Upload url should be generated successfully", async () => {
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadUrl: expect.stringContaining(
        "http://test.co.uk/photos/Apollo%20Clinic/BRB/ABC1234JANE/generated-app-id-2/applicant-photo.jpg",
      ),
      bucketPath: "photos/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/applicant-photo.jpg",
    });
  });

  test("400 error when applicant info is missing", async () => {
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Invalid Application - No Applicant",
    });
  });

  test("400 error when flletype is not of jpg/jpeg/png", async () => {
    const uploadImageInfo: ImageUploadUrlRequestSchema = {
      fileName: "applicant-photo.txt",
      checksum: "test-checksum",
      imageType: ImageType.Photo,
    };
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: uploadImageInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Invalid file type. Only .jpg, .jpeg, and .png are allowed.",
    });
  });
  test("Local Environment", async () => {
    // Arrange
    // process.env.ENVIRONMENT = "local";

    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: uploadInfo,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(JSON.parse(response.body)).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploadUrl: expect.stringContaining(
        "http://test.co.uk/photos/Apollo%20Clinic/BRB/ABC1234JANE/generated-app-id-2/applicant-photo.jpg",
      ),
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Generate Upload URL Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: GenerateUploadEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await generateImageUploadUrlHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
