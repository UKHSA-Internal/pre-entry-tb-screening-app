import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicants } from "../fixtures/applicants";
import { GetApplicantEvent, getApplicantHandler, Header } from "./getApplicant";

describe("Test for Getting Applicant", () => {
  test("Fetching an Applicant Successfully", async () => {
    // Arrange
    const existingApplicant = seededApplicants[0]; // Already preloaded into DB,

    const event: GetApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {
        passportnumber: existingApplicant.passportNumber,
        countryofissue: existingApplicant.countryOfIssue,
      },
    };

    // Act
    const response = await getApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      ...existingApplicant,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dateCreated: expect.any(String),
    });
  });

  test("Fetching a non-existing Applicant returns a 404 response", async () => {
    // Arrange
    const event: GetApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {
        passportnumber: "missing-applicant",
        countryofissue: CountryCode.ABW,
      },
    };

    // Act
    const response = await getApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Applicant does not exist" });
  });

  test("Missing required Headers returns a 500 response", async () => {
    // Arrange
    const event: GetApplicantEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await getApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;

    const malformedEvent: GetApplicantEvent = {
      ...mockAPIGwEvent,
      parsedHeaders: {} as Header,
    };

    // Act
    const response = await getApplicantHandler(malformedEvent);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
