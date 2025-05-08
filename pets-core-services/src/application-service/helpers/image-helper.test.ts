import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { Readable } from "stream";
import { beforeEach, describe, expect, it, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { ImageHelper } from "./image-helper";

// Mock S3 client
const s3ClientMock = mockClient(awsClients.s3Client);

describe("ImageHelper", () => {
  describe("streamToBuffer", () => {
    it("should convert a stream to a buffer", async () => {
      const inputBuffer = Buffer.from("Test Data");
      const stream = Readable.from([inputBuffer]);

      const result = await ImageHelper.streamToBuffer(stream);
      expect(result.equals(inputBuffer)).toBe(true);
    });

    it("should reject on stream error", async () => {
      const errorStream = new Readable({
        read() {
          this.emit("error", new Error("Stream error"));
        },
      });

      await expect(ImageHelper.streamToBuffer(errorStream)).rejects.toThrow("Stream error");
    });
  });

  describe("Fetch image as Base64", () => {
    const bucket = "test-bucket";
    const key = "test/key";

    beforeEach(() => {
      s3ClientMock.reset();
      vi.clearAllMocks();
    });

    it("should return base64 string if object exists", async () => {
      // Setup mocks
      const fakeBuffer = Buffer.from("mock-image-content");
      const fakeStream = Readable.from(fakeBuffer);

      // Mock S3 responses
      s3ClientMock.on(ListObjectsV2Command).resolves({
        Contents: [{ Key: "photo/q2378/.../applicant-photo/test.jpg" }],
      });

      s3ClientMock.on(GetObjectCommand).resolves({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        Body: fakeStream as any,
        // ContentType: "image/jpeg",
      });
      const result = await ImageHelper.fetchImageAsBase64(bucket, key);
      expect(result).toBe(fakeBuffer.toString("base64"));
    });

    it("should return null if no object is found", async () => {
      s3ClientMock.on(ListObjectsV2Command).resolves({ Contents: [] });

      const result = await ImageHelper.fetchImageAsBase64(bucket, key);
      expect(result).toBeNull();
    });

    it("should throw error on S3 client failure", async () => {
      s3ClientMock.on(ListObjectsV2Command).rejects(new Error("S3 error"));

      await expect(ImageHelper.fetchImageAsBase64(bucket, key)).rejects.toThrow("S3 error");
    });
  });
});
