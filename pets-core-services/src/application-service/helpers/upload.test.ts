import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { Applicant } from "../../shared/models/applicant";
import { generateDicomObjectkey } from "./upload";

describe("Generate Object Key", () => {
  test("Object Key should be generated successfully", () => {
    const applicant = {
      countryOfIssue: CountryCode.ABW,
      passportNumber: "passport-number",
    } as Applicant;

    expect(
      generateDicomObjectkey({
        applicant,
        clinicId: "clinicId",
        fileName: "chest-xray",
        applicationId: "applicationId",
      }),
    ).toBe("dicom/clinicId/ABW/passport-number/applicationId/chest-xray");
  });
});
