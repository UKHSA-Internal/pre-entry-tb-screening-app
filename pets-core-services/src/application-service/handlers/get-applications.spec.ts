import { beforeEach, describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus } from "../../shared/types/enum";
import { mockAPIGwEvent } from "../../test/mocks/events";

// Mock applications model
vi.mock("../../shared/models/applications", () => ({
  ApplicationRoot: {
    getByClinicId: vi.fn(),
  },
}));

vi.mock("../../shared/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));
import { ApplicationRoot } from "../../shared/models/applications";
import { getApplicationsHandler } from "./get-applications";

describe("Getting Applications Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "clinic-123", createdBy: "hardcoded@user.com" },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (ApplicationRoot.getByClinicId as any).mockResolvedValue({
      applications: [
        {
          toJson: () => ({
            applicationId: "test-id",
            applicantId: "COUNTRY#IND#PASSPORT#Test",
            passportNumber: "Test",
            countryOfIssue: CountryCode.IND,
            clinicId: "clinic-123",
            dateCreated: new Date(),
            applicationStatus: ApplicationStatus.inProgress,
          }),
        },
      ],
      cursor: null,
    });
    // Act
    const response = await getApplicationsHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(ApplicationRoot.getByClinicId).toHaveBeenCalledWith("clinic-123", 100, undefined);
    const body = JSON.parse(response.body);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(body?.applications).toEqual([
      {
        applicationId: "test-id",
        applicantId: "COUNTRY#IND#PASSPORT#Test",
        passportNumber: "Test",
        countryOfIssue: CountryCode.IND,
        clinicId: "clinic-123",
        dateCreated: expect.any(String),
        applicationStatus: ApplicationStatus.inProgress,
      },
    ]);
  });

  test("Fetch applications  as ukhsa staff", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com" },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (ApplicationRoot.getByClinicId as any).mockResolvedValue({
      applications: [
        {
          toJson: () => ({
            applicationId: "test-id",
            applicantId: "COUNTRY#IND#PASSPORT#Test",
            passportNumber: "Test",
            countryOfIssue: CountryCode.IND,
            clinicId: "test-clinic",
            dateCreated: new Date(),
            applicationStatus: ApplicationStatus.inProgress,
          }),
        },
      ],
      cursor: null,
    });
    // Act
    const response = await getApplicationsHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(body?.applications).toEqual([
      {
        applicationId: "test-id",
        applicantId: "COUNTRY#IND#PASSPORT#Test",
        passportNumber: "Test",
        countryOfIssue: CountryCode.IND,
        clinicId: "test-clinic",
        dateCreated: expect.any(String),
        applicationStatus: ApplicationStatus.inProgress,
      },
    ]);
  });

  test("Fetch applications returns error", async () => {
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (ApplicationRoot.getByClinicId as any).mockRejectedValue(new Error("DB error"));
    const response = await getApplicationsHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
