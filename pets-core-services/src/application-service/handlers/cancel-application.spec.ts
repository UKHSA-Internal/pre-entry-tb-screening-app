import crypto from "crypto";
import { describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { Application, IApplication } from "../../shared/models/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { TBCertNotIssuedReason, YesOrNo } from "../types/enums";
import { CancelApplicationEvent, cancelApplicationHandler } from "./cancel-application";
import { SaveTbCertificateEvent, saveTbCertificateHandler } from "./save-tb-certificate";

const createNewApplication = async () => {
  return await Application.createNewApplication({
    clinicId: "UK/LHR/00/",
    createdBy: "dev@test.org",
    applicationId: crypto.randomUUID(),
    passportNumber: "test01",
    countryOfIssue: CountryCode.GBR,
  });
};

const createTbCertificateDetails = async (applicationId: string, issued: boolean) => {
  if (issued) {
    const newCertificateDetails: SaveTbCertificateEvent["parsedBody"] = {
      isIssued: YesOrNo.Yes,
      comments: "No signs of TB",
      issueDate: "2025-01-01",
      expiryDate: "2025-06-01",
      clinicName: "Lakeside Medical & TB Screening Centre",
      physicianName: "Dr.Annelie Botha",
      certificateNumber: "987000",
      referenceNumber: applicationId,
    };

    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: applicationId },
      parsedBody: {
        ...newCertificateDetails,
      },
    };

    return await saveTbCertificateHandler(event);
  } else {
    const newCertificateDetails: SaveTbCertificateEvent["parsedBody"] = {
      isIssued: YesOrNo.No,
      clinicName: "Lakeside Medical & TB Screening Centre",
      physicianName: "Dr.Annelie Botha",
      notIssuedReason: TBCertNotIssuedReason.CONFIRMED_SUSPECTED_TB,
      comments: "TB is present",
      referenceNumber: seededApplications[1].applicationId,
    };

    const event: SaveTbCertificateEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: applicationId },
      parsedBody: newCertificateDetails,
    };

    return await saveTbCertificateHandler(event);
  }
};

describe("Test for cancel applicantion handler", () => {
  test("Application is cancelled successfully", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
        cancellationFurtherInfo: "further Info",
      },
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
      dateUpdated: expect.any(String),
      applicationStatus: "Cancelled",
      cancellationReason: "not needed anymore",
      cancellationFurtherInfo: "further Info",
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
    });
  });

  test("Validation error returns a 400 response", async () => {
    // Arrange
    const event = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        applicationId: seededApplications[0].applicationId,
        // incorrect type
        cancellationReason: 23,
      },
    };

    // Act
    const response = await cancelApplicationHandler(event as unknown as CancelApplicationEvent);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request body data validation failed",
    });
  });

  test("Unknown error", async () => {
    // Arrange
    const updateApplicationMock = vi
      .spyOn(Application, "updateApplication")
      .mockRejectedValue(Error("can't cancel"));

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
    updateApplicationMock.mockRestore();
  });

  test("Cancelling application when certificate issued", async () => {
    // Arrange
    const application = await createNewApplication();
    await createTbCertificateDetails(application.applicationId, true);

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: application.applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
      dateUpdated: expect.any(String),
      expiryDate: expect.any(String),
      applicationStatus: "Cancelled",
      cancellationReason: "not needed anymore",
    });
  });

  test("Cancelling application when certificate not issued", async () => {
    // Arrange
    const application = await createNewApplication();
    await createTbCertificateDetails(application.applicationId, false);

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: application.applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseBody: IApplication = JSON.parse(response.body);
    expect(responseBody).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
      dateUpdated: expect.any(String),
      applicationStatus: "Cancelled",
      cancellationReason: "not needed anymore",
    });
    expect(responseBody?.expiryDate).toBeFalsy();
  });
});
