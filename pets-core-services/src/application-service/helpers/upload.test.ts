import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { Applicant } from "../../shared/models/applicant";
import { ImageType } from "../types/enums";
import { generateImageObjectkey } from "./upload";

describe("Generate Object Key", () => {
  test("Object Key should be generated successfully", () => {
    const applicant = {
      countryOfIssue: CountryCode.ABW,
      passportNumber: "passport-number",
    } as Applicant;

    expect(
      generateImageObjectkey({
        applicant,
        clinicId: "clinicId",
        fileName: "chest-xray",
        applicationId: "applicationId",
        imageType: ImageType.Dicom,
      }),
    ).toBe("dicom/clinicId/ABW/passport-number/applicationId/chest-xray");
  });
});
