import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { Applicant } from "../../shared/models/applicant";
import { ImageType } from "../types/enums";
import { generateImageObjectkey } from "./upload";

describe("Generate  Object Key", () => {
  test("Dicom Object Key should be generated successfully", () => {
    const applicant = {
      countryOfIssue: CountryCode.ABW,
      passportNumber: "passport-number",
    } as Applicant;

    expect(
      generateImageObjectkey({
        applicant,
        clinicId: "clinicId",
        fileName: "chest-xray",
        imageType: ImageType.Dicom,
        applicationId: "applicationId",
      }),
    ).toBe("dicom/clinicId/ABW/passport-number/applicationId/chest-xray");
  });
  test("Applicant Photo Object Key should be generated successfully", () => {
    const applicant = {
      countryOfIssue: CountryCode.ABW,
      passportNumber: "passport-number",
    } as Applicant;

    expect(
      generateImageObjectkey({
        applicant,
        clinicId: "clinicId",
        fileName: "applicant-photo.jpg",
        imageType: ImageType.Photo,
        applicationId: "applicationId",
      }),
    ).toBe("photos/clinicId/ABW/passport-number/applicationId/applicant-photo.jpg");
  });
});
