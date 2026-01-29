import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { ApplicationStatus } from "../types/enum";
import { Application } from "./application";

describe("Tests for Application Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const clinicId = "test-clinic-id";
  const createdBy = "test-email";
  const applicationId = "test-application-id";

  test("Creating new application", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const application = await Application.createNewApplication({
      clinicId,
      createdBy,
      applicationId,
    });

    // Assert
    expect(application).toMatchObject({
      dateCreated: new Date(expectedDateTime),
      clinicId,
      createdBy,
      applicationId,
      status: ApplicationStatus.inProgress,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        clinicId,
        createdBy,
        status: "In Progress",
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#ROOT",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Handling error while calling cancelApplication", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    ddbMock.on(GetCommand).rejects(Error("Error while getting the application details"));

    // Act
    await expect(
      Application.updateApplication({
        applicationId: "Bad0ne",
        status: ApplicationStatus.cancelled,
        cancellationReason: "IDK",
        updatedBy: createdBy,
      }),
    ).rejects.toThrow(Error("Error while getting the application details"));
  });

  test("Handling error while fetching existing application in cancelApplication", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    ddbMock.on(GetCommand).resolves({});

    // Act
    await expect(
      Application.updateApplication({
        applicationId: "Bad0ne",
        status: ApplicationStatus.cancelled,
        cancellationReason: "IDK",
        updatedBy: createdBy,
      }),
    ).rejects.toThrow(Error("Could not fetch the application with the given applicationId"));
  });

  test("Getting new application by application ID", async () => {
    const dateCreated = "2025-02-07";
    const applicationId = "test-application-id";
    ddbMock.on(GetCommand).resolves({
      Item: {
        applicationId,
        clinicId,
        createdBy,
        dateCreated,
        status: ApplicationStatus.inProgress,
        pk: `APPLICATION#${applicationId}`,
        sk: "APPLICANT#DETAILS",
      },
    });

    // Act
    const application = await Application.getByApplicationId(applicationId);

    // Assert
    expect(application).toMatchObject({
      applicationId,
      clinicId,
      createdBy,
      dateCreated: new Date("2025-02-07"),
    });
  });

  test("Change application status to 'Cancelled'", async () => {
    const dateCreated = "2025-02-07";
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    ddbMock.on(GetCommand).resolves({
      Item: {
        applicationId,
        clinicId,
        createdBy,
        dateCreated,
        status: ApplicationStatus.inProgress,
        pk: `APPLICATION#${applicationId}`,
        sk: "APPLICANT#DETAILS",
      },
    });

    // Act
    const application = await Application.updateApplication({
      // These are the args that are used by cancel application handler
      applicationId,
      status: ApplicationStatus.cancelled,
      cancellationReason: "not needed",
      updatedBy: createdBy,
    });

    // Assert
    expect(application).toMatchObject({
      applicationId,
      clinicId,
      createdBy,
      dateCreated: new Date("2025-02-07"),
      status: "Cancelled",
      cancellationReason: "not needed",
      dateUpdated: new Date(expectedDateTime),
      updatedBy: createdBy,
    });
    // Checking toJson() output
    expect(application.toJson()).toMatchObject({
      applicationId,
      dateCreated: new Date("2025-02-07").toISOString(),
      status: "Cancelled",
      cancellationReason: "not needed",
      expiryDate: undefined,
      dateUpdated: new Date(expectedDateTime).toISOString(),
      updatedBy: createdBy,
    });
  });

  test("Change application status related to TB Certificate details", async () => {
    const dateCreated = "2025-02-07";
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    ddbMock.on(GetCommand).resolves({
      Item: {
        applicationId,
        clinicId,
        createdBy,
        dateCreated,
        status: ApplicationStatus.inProgress,
        pk: `APPLICATION#${applicationId}`,
        sk: "APPLICANT#DETAILS",
      },
    });

    // Act
    const application = await Application.updateApplication({
      // These are the args that are used by cancel application handler
      applicationId,
      status: ApplicationStatus.certificateAvailable,
      expiryDate: new Date("2027-06-06"),
      updatedBy: createdBy,
    });

    // Assert
    expect(application).toMatchObject({
      applicationId,
      clinicId,
      createdBy,
      dateCreated: new Date("2025-02-07"),
      status: "Certificate Available",
      cancellationReason: undefined,
      dateUpdated: new Date(expectedDateTime),
      updatedBy: createdBy,
    });
    // Checking toJson() output
    expect(application.toJson()).toMatchObject({
      applicationId,
      dateCreated: "2025-02-07T00:00:00.000Z",
      status: "Certificate Available",
      cancellationReason: undefined,
      expiryDate: "2027-06-06T00:00:00.000Z",
      dateUpdated: "2025-03-04T00:00:00.000Z",
      updatedBy: createdBy,
    });
  });
});
