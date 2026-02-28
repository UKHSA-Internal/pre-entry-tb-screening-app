import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { createApplicationHandler, SaveApplicationEvent } from "./create-application";

const newApplication: SaveApplicationEvent["parsedBody"] = {
  passportNumber: "test-passport-id",
  countryOfIssue: CountryCode.ALA,
};
describe("Test for create applicantion handler", () => {
  test("Application is generated successfully", async () => {
    // Arrange
    const event: SaveApplicationEvent = {
      ...mockAPIGwEvent,
      parsedBody: newApplication,
    };
    // Act
    const response = await createApplicationHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
    });
  });

  test("No duplicate Application is generated", async () => {
    const event: SaveApplicationEvent = {
      ...mockAPIGwEvent,
      parsedBody: newApplication,
    };
    // Act
    const responseOne = await createApplicationHandler(event);
    const responseTwo = await createApplicationHandler(event);

    // Assert
    const responseBodyOne = JSON.parse(responseOne.body);
    const responseBodyTwo = JSON.parse(responseTwo.body);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(responseBodyOne.applicationId).not.toEqual(responseBodyTwo.applicationId);
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveApplicationEvent = {
      ...mockAPIGwEvent,
    };
    // Act
    const response = await createApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
    });
  });
});
