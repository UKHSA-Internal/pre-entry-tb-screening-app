import { describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicants } from "../fixtures/applicants";
import { Header, SearchApplicantEvent, searchApplicantHandler } from "./searchApplicant";

describe("Test for Getting Applicant", () => {
  test("Fetching an Applicant Successfully", async () => {
    // Arrange
    const existingApplicant = seededApplicants[1]; // Already preloaded into DB,

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: seededApplications[2].clinicId,
        },
      },
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdBy, ...expectedJsonResponse } = existingApplicant;

    expect(JSON.parse(response.body)).toMatchObject([expectedJsonResponse]);
  });

  test("Fetching an Applicant with different clinicId", async () => {
    // Arrange
    const existingApplicant = seededApplicants[1]; // Already preloaded into DB,
    const infoLoggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: process.env.SUPPORT_CLINIC_ID as string,
        },
      },
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(infoLoggerMock).toHaveBeenNthCalledWith(
      6,
      "Getting an application from a different clinic then the user's one",
    );
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdBy, ...expectedJsonResponse } = existingApplicant;
  });

  test("Fetching an Applicant that does not have an application", async () => {
    // Arrange
    const existingApplicant = seededApplicants[3];
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: seededApplications[2].clinicId,
        },
      },
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith(
      "Edge-Case: Applicant has been created without an application",
    );
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Matched Applicant has been created without an application",
    });
  });

  test("Fetching a non-existing Applicant returns a 404 response", async () => {
    // Arrange
    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {
        passportnumber: "missing-applicant",
        countryofissue: CountryCode.ABW,
      },
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(204);
    expect(JSON.parse(response.body)).toMatchObject([]);
  });

  test("Duplicate results returns a 500 response", async () => {
    // Arrange
    await ApplicantDbOps.createNewApplicant({
      ...seededApplicants[0],
      applicationId: "duplicate-application-id",
    });

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {
        passportnumber: seededApplicants[0].passportNumber,
        countryofissue: seededApplicants[0].countryOfIssue,
      },
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Unexpected duplicate results found",
    });
  });

  test("Clinic Id mismatch returns a 403 response", async () => {
    const existingApplicant = seededApplicants[1]; // Already preloaded into DB

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "compromised-clinic-id", // Simulating a mismatch
        },
      },
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    const response = await searchApplicantHandler(event);

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Clinic Id mismatch" });
  });

  test("Missing clinicId in the request returns a 400 response", async () => {
    const existingApplicant = seededApplicants[1]; // Already preloaded into DB

    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { ...mockAPIGwEvent.requestContext.authorizer, clinicId: "" },
      },
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    const response = await searchApplicantHandler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Clinic Id missing" });
  });

  test("Missing required Headers returns a 500 response", async () => {
    // Arrange
    const event: SearchApplicantEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await searchApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;

    const malformedEvent: SearchApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {} as Header,
    };

    // Act
    const response = await searchApplicantHandler(malformedEvent);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
