import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { ImageHelper } from "./image-helper";

// Mock S3 client
const s3ClientMock = mockClient(awsClients.s3Client);

const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://mocked-signed-url.com"),
}));

describe("ImageHelper", () => {
  describe("Get Presigned URL for image", () => {
    const bucket = "test-bucket";
    const key = "test/key";

    beforeEach(() => {
      s3ClientMock.reset();
      vi.clearAllMocks();
    });

    it("returns presigned URL when object is found", async () => {
      // Mock S3 responses
      s3ClientMock.on(ListObjectsV2Command).resolves({
        Contents: [{ Key: "photo/q2378/.../applicant-photo/test.jpg" }],
      });

      const url = await ImageHelper.getPresignedUrlforImage(bucket, key);
      expect(getSignedUrl).toHaveBeenCalledWith(
        awsClients.s3Client,
        expect.any(GetObjectCommand),
        expect.objectContaining({ expiresIn: 300 }),
      );
      expect(url).toBe("https://mocked-signed-url.com");
    });

    it("returns null and logs error if object not found", async () => {
      s3ClientMock.on(ListObjectsV2Command).resolves({ Contents: [] });

      const result = await ImageHelper.getPresignedUrlforImage(bucket, key);
      expect(result).toBeNull();
      expect(errorloggerMock).toHaveBeenCalledWith("No image found under the specified prefix.");
    });

    it("throws and logs error on AWS failure", async () => {
      const error = new Error("S3 error");
      s3ClientMock.on(ListObjectsV2Command).rejects(error);

      await expect(ImageHelper.getPresignedUrlforImage(bucket, key)).rejects.toThrow("S3 error");
      expect(errorloggerMock).toHaveBeenCalledWith("Error fetching image:", error);
    });
  });
});
