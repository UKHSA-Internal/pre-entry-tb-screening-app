import { APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicants } from "../fixtures/applicants";
import { PostApplicantEvent } from "../handlers/postApplicant";
import { PutApplicantEvent } from "../handlers/updateApplicant";
import { AllowedSex } from "../types/enums";
import { handler } from "./applicants";

const applicantDetails: PutApplicantEvent["parsedBody"] = {
  fullName: "John Doe",
  countryOfNationality: CountryCode.ALA,
  issueDate: "2025-01-01",
  expiryDate: "2030-01-01",
  dateOfBirth: "2000-02-07",
  sex: AllowedSex.Other,
  applicantHomeAddress1: "First Line of Address",
  applicantHomeAddress2: "Second Line of Address",
  applicantHomeAddress3: "Third Line of Address",
  townOrCity: "the-town-or-city",
  provinceOrState: "the-province",
  postcode: "the-post-code",
  country: CountryCode.ALA,
  passportNumber: "test",
  countryOfIssue: CountryCode.ALA,
};

const newApplicantDetails: PostApplicantEvent["parsedBody"] = {
  fullName: "John Doe",
  passportNumber: "test",
  countryOfIssue: CountryCode.ALA,
  countryOfNationality: CountryCode.ALA,
  issueDate: "2024-07-07",
  expiryDate: "2029-07-07",
  dateOfBirth: "1999-07-07",
  sex: AllowedSex.Other,
  applicantHomeAddress1: "First Line of Address",
  applicantHomeAddress2: "Second Line of Address",
  applicantHomeAddress3: "Third Line of Address",
  townOrCity: "the-town-or-city",
  provinceOrState: "the-province",
  postcode: "the-post-code",
  country: CountryCode.KOR,
};

describe("Test for Applicant Lambda", () => {
  test("Validating Search Applicant Successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/search",
      path: "/applicant/search",
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Headers failed validation",
      validationError: {
        countryofissue: ["Required"],
        passportnumber: ["Required"],
      },
    });
  });

  test("Fetching an existing Applicant", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/search",
      path: "/applicant/search",
      httpMethod: "GET",
      headers: {
        passportnumber: seededApplicants[0].passportNumber,
        countryofissue: seededApplicants[0].countryOfIssue,
      },
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Validating POST Applicant Successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Body failed validation",
      validationError: {
        countryOfIssue: ["Required"],
        issueDate: ["Required"],
      },
    });
  });

  test("Posting an Applicant Successfully", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(201);
  });
  test("Posting an Applicant is successful from support clinic ", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "UK/LHR/00/",
        },
      },
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(201);
  });
  test("Posting an Applicant is missing application throws a 404 error", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/invalid-id`,
      httpMethod: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(404);
  });
  test("Posting an Applicant from  other clinic throws  validation error", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "invalid-clinic-id",
        },
      },
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(403);
  });
  test("Posting an Applicant  Missing clinic Id throws bad request", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "",
        },
      },
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
  });
  test("Updating an Applicant Successfully", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      body: JSON.stringify(applicantDetails),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(201);

    const updateEvent: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/update/{applicationId}",
      path: `/applicant/update/${seededApplications[0].applicationId}`,
      httpMethod: "PUT",
      body: JSON.stringify(newApplicantDetails),
    };

    // Act
    const updateResponse: APIGatewayProxyResult = await handler(updateEvent, context);

    // Assert
    expect(updateResponse.statusCode).toBe(200);
  });
  test("Updating an Applicant from  other clinic throws  validation error", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      body: JSON.stringify(applicantDetails),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(201);

    const updateEvent: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/update/{applicationId}",
      path: `/applicant/update/${seededApplications[0].applicationId}`,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "invalid-clinic-id",
        },
      },
      httpMethod: "PUT",
      body: JSON.stringify(newApplicantDetails),
    };

    // Act
    const updateResponse: APIGatewayProxyResult = await handler(updateEvent, context);

    // Assert
    expect(updateResponse.statusCode).toBe(403);
  });
  test("Updating an Applicant Missing clinic Id throws bad request", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/register/{applicationId}",
      path: `/applicant/register/${seededApplications[0].applicationId}`,
      httpMethod: "POST",
      body: JSON.stringify(applicantDetails),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(201);

    const updateEvent: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant/update/{applicationId}",
      path: `/applicant/update/${seededApplications[0].applicationId}`,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "",
        },
      },
      httpMethod: "PUT",
      body: JSON.stringify(newApplicantDetails),
    };

    // Act
    const updateResponse: APIGatewayProxyResult = await handler(updateEvent, context);

    // Assert
    expect(updateResponse.statusCode).toBe(400);
  });
});
