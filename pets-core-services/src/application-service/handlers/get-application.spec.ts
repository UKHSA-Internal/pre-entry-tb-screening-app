import { describe, expect, test, vi } from "vitest";

import { AllowedSex } from "../../applicant-service/types/enums";
import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicantPhoto } from "../fixtures/applicant-photo";
import { ImageHelper } from "../helpers/image-helper";
import { ChestXRay } from "../models/chest-xray";
import { getApplicationHandler } from "./get-application";

// Mock generateImageObjectkey
vi.mock("../helpers/upload", () => ({
  generateImageObjectkey: () => "mock/key/photo.jpg",
}));

// Mock getByApplicationId from Applicant model
vi.mock("../../shared/models/applicant", () => ({
  ApplicantDbOps: {
    getByApplicationId: vi.fn().mockResolvedValue({
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
    findByPassportId: vi.fn().mockResolvedValue({
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

vi.spyOn(ImageHelper, "getPresignedUrlforImage").mockResolvedValue(
  seededApplicantPhoto[1].applicantPhotoUrl,
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
      message: "Application with ID: non-existing-application-ids does not exist",
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
      applicationStatus: "In Progress",
      clinicId: "Apollo Clinic",
      dateCreated: expect.any(String),

      // Defined in pets-core-services/src/application-service/fixtures/applicant-photo.ts
      applicantPhotoUrl: seededApplicantPhoto[1].applicantPhotoUrl,
      // Defined in pets-core-services/src/application-service/fixtures/travel-information.ts
      travelInformation: {
        applicationId: seededApplications[1].applicationId,
        status: "completed",
        dateCreated: expect.any(String),
        ukAddressLine1: "182 Willow Crescent",
        ukAddressLine2: "Northfield",
        ukAddressLine3: "North Birmingham",
        ukAddressTownOrCity: "Birmingham",
        ukAddressPostcode: "B12 8QP",
        ukMobileNumber: "07001234567",
        ukEmailAddress: "JaneDoe@email.com",
        visaCategory: "Study",
      },
      // Defined in pets-core-services/src/application-service/fixtures/medical-screening.ts
      medicalScreening: {
        dateOfMedicalScreening: "2025-05-05T00:00:00.000Z",
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
        isXrayRequired: "Yes",
        dateCreated: expect.any(String),
        status: "completed",
      },
      chestXray: {
        dateXrayTaken: "2025-09-04T00:00:00.000Z",
        posteroAnteriorXrayFileName: "posterior-anterior.dicom",
        posteroAnteriorXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/postero-anterior.dcm",
        apicalLordoticXrayFileName: "apical-lordotic.dicom",
        apicalLordoticXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/apical-lordotic.dcm",
        lateralDecubitusXrayFileName: "lateral-decubitus.dicom",
        lateralDecubitusXray:
          "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/lateral-decubitus.dcm",
        applicationId: seededApplications[1].applicationId,
        dateCreated: expect.any(String),
        status: "completed",
      },
      radiologicalOutcome: {
        applicationId: "generated-app-id-2",
        dateCreated: expect.any(String),
        status: "completed",
        xrayActiveTbFindings: ["Active TB Findings"],
        xrayAssociatedMinorFindings: ["Associated Minor Findings"],
        xrayMinorFindings: ["Minor Findings"],
        xrayResult: "Chest X-ray normal",
        xrayResultDetail: "Result details",
      },
      sputumRequirement: {
        applicationId: "generated-app-id-2",
        dateCreated: expect.any(String),
        sputumRequired: "Yes",
        status: "completed",
      },
      // Defined in pets-core-services\src\application-service\fixtures\tb-certificate.ts
      tbCertificate: {
        applicationId: "generated-app-id-2",
        comments: "No signs of TB",
        issueDate: "2025-01-01",
        expiryDate: "2025-06-01",
        isIssued: "Yes",
        physicianName: "Dr.Annelie Botha",
        clinicName: "Lakeside Medical & TB Screening Centre",
        referenceNumber: "generated-app-id-2",
        certificateNumber: "987000",
        dateCreated: expect.any(String),
        status: "completed",
      },
    });
  });

  test("Fetch application successfully (certificate not issued)", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: seededApplications[2].clinicId, createdBy: "hardcoded@user.com" },
      },
      pathParameters: { applicationId: seededApplications[2].applicationId },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      applicationId: seededApplications[2].applicationId,
      applicationStatus: "In Progress",
      clinicId: "test-clinic-id-3",
      dateCreated: expect.any(String),

      // Defined in pets-core-services/src/application-service/fixtures/applicant-photo.ts
      applicantPhotoUrl: seededApplicantPhoto[1].applicantPhotoUrl,
      // Defined in pets-core-services/src/application-service/fixtures/travel-information.ts
      travelInformation: {
        applicationId: seededApplications[2].applicationId,
        status: "completed",
        dateCreated: expect.any(String),
        ukAddressLine1: "29 Maple Street",
        ukAddressLine2: "Camden",
        ukAddressLine3: "North London",
        ukAddressPostcode: "NW3 4JT",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "JohnPark@email.com",
        ukMobileNumber: "075000012345",
        visaCategory: "Do not know",
      },
      // Defined in pets-core-services/src/application-service/fixtures/medical-screening.ts
      medicalScreening: {
        dateOfMedicalScreening: "2025-05-05T00:00:00.000Z",
        age: 10,
        symptomsOfTb: "Yes",
        symptoms: ["Cough"],
        historyOfConditionsUnder11: ["Cyanosis"],
        historyOfConditionsUnder11Details: "Physician Notes",
        historyOfPreviousTb: "No",
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "More Physician Notes",
        pregnant: "No",
        haveMenstralPeriod: "No",
        physicalExaminationNotes: "NA",
        applicationId: seededApplications[2].applicationId,
        isXrayRequired: "No",
        reasonXrayNotRequired: "Other",
        dateCreated: expect.any(String),
        status: "completed",
      },
      radiologicalOutcome: {
        applicationId: "cbdcc218-316e-4ae1-835f-ccde4c17a7e2",
        dateCreated: expect.any(String),
        status: "completed",
        xrayActiveTbFindings: ["All good"],
        xrayAssociatedMinorFindings: [""],
        xrayMinorFindings: ["Finding No1"],
        xrayResult: "Chest X-ray ",
        xrayResultDetail: "Result explanation",
      },
      sputumRequirement: {
        applicationId: "cbdcc218-316e-4ae1-835f-ccde4c17a7e2",
        dateCreated: expect.any(String),
        sputumRequired: "No",
        status: "completed",
      },
      // Defined in pets-core-services\src\application-service\fixtures\tb-certificate.ts
      tbCertificate: {
        applicationId: "cbdcc218-316e-4ae1-835f-ccde4c17a7e2",
        comments: "TB is present",
        isIssued: "No",
        notIssuedREason: "Confirmed or suspected TB",
        physicianName: "Dr.Annelie Botha",
        clinicName: "Lakeside Medical & TB Screening Centre",
        referenceNumber: "generated-app-id-2",
        dateCreated: expect.any(String),
        status: "completed",
      },
    });
  });

  test("Fetch application from different clinic as ukhsa staff", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com" },
      },
      pathParameters: { applicationId: seededApplications[1].applicationId },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(response.body)?.applicationId as string).toEqual(
      seededApplications[1].applicationId,
    );
  });

  test("Fetch application returns error", async () => {
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
    };

    // // Mock the chest xray model
    const detailsSpy = vi
      .spyOn(ChestXRay, "getByApplicationId")
      .mockRejectedValue(new Error("DB failure"));
    // Act
    const response = await getApplicationHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
    detailsSpy.mockRestore();
  });
});
