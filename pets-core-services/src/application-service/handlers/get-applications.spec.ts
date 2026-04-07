import { describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { ApplicationListResult, ApplicationRoot } from "../../shared/models/applications";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus } from "../../shared/types/enum";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicantPhoto } from "../fixtures/applicant-photo";
import { ImageHelper } from "../helpers/image-helper";
import { ChestXRay } from "../models/chest-xray";
import { getApplicationsHandler } from "./get-applications";

// Mock generateImageObjectkey
vi.mock("../helpers/upload", () => ({
  generateImageObjectkey: () => "mock/key/photo.jpg",
}));
const app = new ApplicationRoot({
  applicationId: seededApplications[1].applicationId,
  applicantId: "COUNTRY#IND#PASSPORT#Test",
  passportNumber: "Test",
  countryOfIssue: CountryCode.IND,
  clinicId: "test-clinic",
  dateCreated: expect.any(String),
  applicationStatus: ApplicationStatus.inProgress,
});
const applicationsTest: ApplicationRoot[] = [];
applicationsTest.push(app);

// Mock getByApplicationId from Applicant model
vi.mock("../../shared/models/applications", () => ({
  ApplicationRoot: {
    getByClinicId: vi.fn().mockResolvedValue({
      applications: applicationsTest,
      cursor: null,
    } as ApplicationListResult),
  },
}));

vi.spyOn(ImageHelper, "getPresignedUrlforImage").mockResolvedValue(
  seededApplicantPhoto[1].applicantPhotoUrl,
);

// Set env variable
vi.stubEnv("IMAGE_BUCKET", "mock-bucket");

describe("Getting Applications Handler", () => {
  test("Missing clinic Id returns 400", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "", createdBy: "hardcoded@user.com" },
      },
    };

    // Act
    const response = await getApplicationsHandler(event);
    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id missing",
    });
  });

  test("Fetch applications successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await getApplicationsHandler(event);
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

  test("Fetch applications  as ukhsa staff", async () => {
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

  test("Fetch applications returns error", async () => {
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
