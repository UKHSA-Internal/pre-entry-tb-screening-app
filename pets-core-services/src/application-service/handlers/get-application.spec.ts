import { describe, expect, test, vi } from "vitest";

import { AllowedSex } from "../../applicant-service/types/enums";
import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicantPhoto } from "../fixtures/applicant-photo";
import { ImageHelper } from "../helpers/image-helper";
import { getApplicationHandler } from "./get-application";

// Mock generateImageObjectkey
vi.mock("../helpers/upload", () => ({
  generateImageObjectkey: () => "mock/key/photo.jpg",
}));

// Mock getByApplicationId from Applicant model
vi.mock("../../shared/models/applicant", () => ({
  Applicant: {
    getByApplicationId: vi.fn().mockResolvedValue({
      applicationId: "test-application-id",
      fullName: "John Doe",
      passportNumber: "test-passport-id",
      countryOfNationality: CountryCode.ALA,
      countryOfIssue: CountryCode.ALA,
      issueDate: "2025-01-01",
      expiryDate: "2030-01-01",
      dateOfBirth: "2000-02-07",
      sex: AllowedSex.Female,
      applicantHomeAddress1: "First Line of Address",
      applicantHomeAddress2: "Second Line of Address",
      applicantHomeAddress3: "Third Line of Address",
      townOrCity: "the-town-or-city",
      provinceOrState: "the-province",
      postcode: "the-post-code",
      country: CountryCode.ALA,
      createdBy: "test-applicant-creator",
    }),
  },
}));

vi.spyOn(ImageHelper, "fetchImageAsBase64").mockResolvedValue(
  seededApplicantPhoto[1].applicantPhoto,
);

// Set env variable
vi.stubEnv("IMAGE_BUCKET", "mock-bucket");

describe("Getting Application Handler", () => {
  test("Missing application returns 404", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "non-existing-application-ids" },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application does not exist",
    });
  });

  test("Fetch application successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      applicationId: seededApplications[1].applicationId,
      // Defined in pets-core-services/src/application-service/fixtures/applicant-photo.ts
      applicantPhoto: seededApplicantPhoto[1].applicantPhoto,
      // Defined in pets-core-services/src/application-service/fixtures/travel-information.ts
      travelInformation: {
        applicationId: seededApplications[1].applicationId,
        status: "Complete",
        dateCreated: expect.any(String),
        ukAddressLine1: "182 Willow Crescent",
        ukAddressLine2: "Northfield",
        ukAddressTownOrCity: "Birmingham",
        ukAddressPostcode: "B12 8QP",
        ukMobileNumber: "07001234567",
        ukEmailAddress: "JaneDoe@email.com",
        visaCategory: "Students",
      },
      // Defined in pets-core-services/src/application-service/fixtures/medical-screening.ts
      medicalScreening: {
        age: 25,
        symptomsOfTb: "Yes",
        symptoms: ["Cough", "Haemoptysis (coughing up blood)"],
        historyOfConditionsUnder11: [],
        historyOfConditionsUnder11Details: "Physician Notes",
        historyOfPreviousTb: "Yes",
        previousTbDetails: "Previous TB notes",
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "More Physician Notes",
        pregnant: "Yes",
        haveMenstralPeriod: "Yes",
        physicalExaminationNotes: "NA",
        applicationId: seededApplications[1].applicationId,
        dateCreated: expect.any(String),
        status: "Complete",
      },
      chestXray: {
        chestXrayTaken: "Yes",
        posteroAnteriorXrayFileName: "posterior-anterior.dicom",
        posteroAnteriorXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/postero-anterior.dcm",
        apicalLordoticXrayFileName: "apical-lordotic.dicom",
        apicalLordoticXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/apical-lordotic.dcm",
        lateralDecubitusXrayFileName: "lateral-decubitus.dicom",
        lateralDecubitusXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/lateral-decubitus.dcm",
        xrayResult: "Chest X-ray normal",
        xrayActiveTbFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayMinorFindings: [],
        applicationId: seededApplications[1].applicationId,
        dateCreated: expect.any(String),
        status: "Complete",
      },
      // Defined in pets-core-services\src\application-service\fixtures\tb-certificate.ts
      tbCertificate: {
        applicationId: "generated-app-id-2",
        comments: "No signs of TB",
        issueDate: "2025-01-01",
        isIssued: "Yes",
        certificateNumber: "987000",
        dateCreated: expect.any(String),
        status: "Complete",
      },
    });
  });

  test("Verify Clinic ID", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "compromised-clinic-id",
        },
      },
    };

    // Act
    const response = await getApplicationHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Clinic Id mismatch" });
  });
});
