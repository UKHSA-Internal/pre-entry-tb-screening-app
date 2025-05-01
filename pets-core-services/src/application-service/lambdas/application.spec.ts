import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyResult } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { seededApplicants } from "../../applicant-service/fixtures/applicants";
import awsClients from "../../shared/clients/aws";
import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { APPLICANT_PHOTOS_FOLDER } from "../helpers/upload";
import {
  ChestXRayResult,
  MenstrualPeriods,
  PregnancyStatus,
  VisaOptions,
  YesOrNo,
} from "../types/enums";
import { handler } from "./application";

describe("Test for Application Lambda", () => {
  test("Creating an Application Successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application",
      path: "/application",
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Fetching an application", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}",
      path: `/application/${seededApplications[0].applicationId}`,
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  describe("Travel Information", () => {
    const newTravelInfo = {
      visaCategory: VisaOptions.Students,
      ukAddressLine1: "first line",
      ukAddressLine2: "second line",
      ukAddressTownOrCity: "town or city",
      ukAddressPostcode: "uk address postcode",
      ukMobileNumber: "uk mobile number",
      ukEmailAddress: "uk email address",
    };

    test("Creating Travel Information Successfully", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: `/application/${seededApplications[0].applicationId}/travel-information`,
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });

    test("Validating creating travel information Successfully", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: `/application/${seededApplications[0].applicationId}/travel-information`,
        httpMethod: "POST",
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Request Body failed validation",
        validationError: {
          ukEmailAddress: ["Required"],
          ukMobileNumber: ["Required"],
          visaCategory: ["Required"],
        },
      });
    });

    test("Missing application throws a 400 error", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: "/application/nonexisting-application-id/travel-information",
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Application with ID: nonexisting-application-id does not exist",
      });
    });

    test("Mismatch in Clinic ID throws a 400 error", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: `/application/${seededApplications[2].applicationId}/travel-information`,
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Clinic Id mismatch",
      });
    });
  });

  describe("Medical Screening", () => {
    test("Validating saving medical screening Successfully", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/medical-screening",
        path: `/application/${seededApplications[0].applicationId}/medical-screening`,
        httpMethod: "POST",
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Request Body failed validation",
        validationError: {
          age: ["Required"],
          symptomsOfTb: ["Required"],
          symptoms: ["Required"],
          historyOfConditionsUnder11: ["Required"],
          historyOfPreviousTb: ["Required"],
          contactWithPersonWithTb: ["Required"],
          pregnant: ["Required"],
          haveMenstralPeriod: ["Required"],
          physicalExaminationNotes: ["Required"],
        },
      });
    });

    test("Saving Medical Screening Successfully", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/medical-screening",
        path: `/application/${seededApplications[0].applicationId}/medical-screening`,
        httpMethod: "POST",
        body: JSON.stringify({
          age: 32,
          symptomsOfTb: YesOrNo.No,
          symptoms: [],
          historyOfConditionsUnder11: [],
          historyOfPreviousTb: YesOrNo.No,
          contactWithPersonWithTb: YesOrNo.No,
          pregnant: PregnancyStatus.No,
          haveMenstralPeriod: MenstrualPeriods.NA,
          physicalExaminationNotes: "NA",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Chest X-Ray", () => {
    const s3ClientMock = mockClient(awsClients.s3Client);

    s3ClientMock.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    beforeEach(() => {
      s3ClientMock.resetHistory();
    });

    test("Saving Chest X-Ray Successfully", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/chest-xray",
        path: `/application/${seededApplications[3].applicationId}/chest-xray`,
        httpMethod: "POST",
        body: JSON.stringify({
          chestXrayTaken: YesOrNo.Yes,
          posteroAnteriorXrayFileName: "pa.dicom",
          posteroAnteriorXray:
            "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/postero-anterior.dcm",
          apicalLordoticXrayFileName: "al.dicom",
          apicalLordoticXray:
            "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/apical-lordotic.dcm",
          lateralDecubitusXrayFileName: "ld.dicom",
          lateralDecubitusXray:
            "dicom/Apollo Clinic/ARG/ABC1234KAT/generated-app-id-4/lateral-decubitus.dcm",
          xrayResult: ChestXRayResult.Normal,
          xrayMinorFindings: [],
          xrayAssociatedMinorFindings: [],
          xrayActiveTbFindings: [],
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });

    test("Saving Chest X-Ray Not Taken Details", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/chest-xray",
        path: `/application/${seededApplications[0].applicationId}/chest-xray`,
        httpMethod: "POST",
        body: JSON.stringify({
          chestXrayTaken: YesOrNo.No,
          reasonXrayWasNotTaken: "Other",
          xrayWasNotTakenFurtherDetails: "Physician Notes",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Applicant photo", () => {
    const s3ClientMock = mockClient(awsClients.s3Client);

    s3ClientMock.on(HeadObjectCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });

    beforeEach(() => {
      s3ClientMock.resetHistory();
    });

    test("Saving applicant photo uccessfully", async () => {
      // Arrange;
      const infologgerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
      const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
      const fileName = "applicant-photo.jpg";
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/generate-image-upload-url",
        path: `/application/${seededApplications[3].applicationId}/generate-image-upload-url`,
        httpMethod: "PUT",
        body: JSON.stringify({
          fileName: fileName,
          checksum: "",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);
      expect(infologgerMock).toHaveBeenCalled();
      expect(infologgerMock).toHaveBeenCalledWith("Image object key generated successfully");
      expect(errorloggerMock).not.toHaveBeenCalled();

      // Assert
      expect(response.statusCode).toBe(200);
      const obj = JSON.parse(response.body);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(obj.bucketPath).toBe(
        `${APPLICANT_PHOTOS_FOLDER}/${seededApplications[3].clinicId}/${seededApplicants[2].country}/${seededApplicants[2].passportNumber}/${seededApplications[3].applicationId}/${fileName}`,
      );
      expect(obj).toHaveProperty("uploadUrl");
    });
  });

  describe("TB certificate", () => {
    test("Validating creating TB certificate successfully", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/tb-certificate",
        path: `/application/${seededApplications[0].applicationId}/tb-certificate`,
        httpMethod: "POST",
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Request Body failed validation",
        validationError: {},
      });
    });

    test("Saving TB certificate successfully when issued", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/tb-certificate",
        path: `/application/${seededApplications[0].applicationId}/tb-certificate`,
        httpMethod: "POST",
        body: JSON.stringify({
          comments: "comments",
          issueDate: "2025-01-01",
          isIssued: YesOrNo.Yes,
          certificateNumber: "123456",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });

    test("Saving TB certificate successfully when not issued", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/tb-certificate",
        path: `/application/${seededApplications[0].applicationId}/tb-certificate`,
        httpMethod: "POST",
        body: JSON.stringify({
          comments: "comments",
          isIssued: YesOrNo.No,
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });
  });
});
