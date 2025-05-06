import { beforeEach, describe, expect, it, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { Applicant } from "../../shared/models/applicant";
import { ImageHelper } from "../helpers/image-helper";
import { generateImageObjectkey } from "../helpers/upload";
import { ApplicantPhoto } from "./applicant-photo";

// Mock direct dependencies
vi.mock("../../shared/models/applicant", () => ({
  Applicant: {
    getByApplicationId: vi.fn(),
  },
}));

vi.mock("../helpers/upload", () => ({
  generateImageObjectkey: vi.fn(),
}));

vi.stubEnv("IMAGE_BUCKET", "IMAGE_BUCKET");

const mockApplicant = {
  applicationId: "test-application-id",
  countryOfIssue: CountryCode.ABW,
  passportNumber: "passport-number",
} as Applicant;
const applicationId = "app-123";
const clinicId = "clinic-456";
const objectKey = "photos/applicant-1/app-123.jpg";
// Type-safe access to mocked modules
const mockedApplicant = vi.mocked(Applicant);
// const mockedImageHelper = vi.mocked(ImageHelper);
const mockedGenerateImageObjectkey = vi.mocked(generateImageObjectkey, true); // true = function

describe("ApplicantPhoto.getByApplicationId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns base64 image when all steps succeed", async () => {
    // (Applicant.getByApplicationId as vi.Mock).mockResolvedValue(mockApplicant);
    // (generateImageObjectkey as vi.Mock).mockReturnValue(objectKey);
    mockedApplicant.getByApplicationId.mockResolvedValue(mockApplicant);
    mockedGenerateImageObjectkey.mockReturnValue(objectKey);

    const spy = vi.spyOn(ImageHelper, "fetchImageAsBase64").mockResolvedValue("base64-image");

    const result = await ApplicantPhoto.getByApplicationId(applicationId, clinicId);

    // expect(Applicant.getByApplicationId(applicationId)).toHaveBeenCalledWith(applicationId);
    expect(generateImageObjectkey).toHaveBeenCalledWith({
      applicant: mockApplicant,
      clinicId,
      fileName: "applicant-photo",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      imageType: expect.any(String),
      applicationId,
    });
    expect(spy).toHaveBeenCalledWith("IMAGE_BUCKET", objectKey);
    expect(result).toBe("base64-image");
  });

  it("returns undefined if applicant not found", async () => {
    mockedApplicant.getByApplicationId.mockResolvedValue(undefined);
    const result = await ApplicantPhoto.getByApplicationId(applicationId, clinicId);
    expect(result).toBeUndefined();
  });

  it("returns undefined if image not found", async () => {
    mockedApplicant.getByApplicationId.mockResolvedValue(mockApplicant);
    mockedGenerateImageObjectkey.mockReturnValue(objectKey);
    // mockedImageHelper.fetchImageAsBase64.mockResolvedValue(null);

    vi.spyOn(ImageHelper, "fetchImageAsBase64").mockResolvedValue(null);

    const result = await ApplicantPhoto.getByApplicationId(applicationId, clinicId);
    expect(result).toBeUndefined();
  });

  it("throws if fetchImageAsBase64 fails", async () => {
    mockedApplicant.getByApplicationId.mockResolvedValue(mockApplicant);
    mockedGenerateImageObjectkey.mockReturnValue(objectKey);

    vi.spyOn(ImageHelper, "fetchImageAsBase64").mockRejectedValue(new Error("S3 error"));

    await expect(ApplicantPhoto.getByApplicationId(applicationId, clinicId)).rejects.toThrow(
      "S3 error",
    );
  });
});
