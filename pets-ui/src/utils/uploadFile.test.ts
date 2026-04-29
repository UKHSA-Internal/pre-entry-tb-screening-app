vi.mock("./api/api.ts", () => ({
  generateImageUploadUrl: vi.fn(),
}));

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from "vitest";

import { generateImageUploadUrl } from "@/api/api";

import { ImageType } from "./enums";
import uploadFile from "./uploadFile";

// Mock generateFileUrl
vi.mock("@/api/api");

describe("testFile with axios-mock-adapter", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    vi.resetAllMocks();

    // Setup axios-mock-adapter
    mockAxios = new MockAdapter(axios);
    vi.clearAllMocks();

    // Mock crypto.subtle.digest
    vi.stubGlobal("crypto", {
      subtle: {
        digest: vi.fn(() => Promise.resolve(new Uint8Array([1, 2, 3, 4]).buffer)),
      },
    });
  });

  afterEach(() => {
    mockAxios.restore();
  });

  test("uploads file, computes checksum, and returns bucketPath", async () => {
    const file = new File(["hello world"], "test.jpg", { type: "image/jpeg" });

    (generateImageUploadUrl as Mock).mockResolvedValueOnce({
      data: {
        uploadUrl: "https://example.com/upload",
        bucketPath: "bucket/test.jpg",
      },
    });

    // Mock PUT request
    mockAxios.onPut("https://example.com/upload").reply(200);

    const result = await uploadFile(file, "test.jpg", "app-123", ImageType.Photo);

    const expectedChecksum = btoa(String.fromCharCode(1, 2, 3, 4));

    expect(generateImageUploadUrl).toHaveBeenCalledWith("app-123", {
      fileName: "test.jpg",
      checksum: expectedChecksum,
      imageType: ImageType.Photo,
    });

    // Assert that axios-mock-adapter recorded the PUT
    expect(mockAxios.history.put.length).toBe(1);
    const request = mockAxios.history.put[0];
    expect(request.headers?.["Content-Type"]).toBe("image/jpeg");
    expect(request.headers?.["x-amz-checksum-sha256"]).toBe(expectedChecksum);

    expect(result).toBe("bucket/test.jpg");
  });

  test("throws if upload fails", async () => {
    const file = new File(["oops"], "fail.txt", { type: "text/plain" });

    (generateImageUploadUrl as Mock).mockResolvedValueOnce({
      data: {
        uploadUrl: "https://example.com/upload",
        bucketPath: "bucket/fail.txt",
      },
    });

    // Mock PUT request failure
    mockAxios.onPut("https://example.com/upload").reply(500);

    await expect(uploadFile(file, "fail.txt", "app-123", ImageType.Photo)).rejects.toThrow();
  });
});
