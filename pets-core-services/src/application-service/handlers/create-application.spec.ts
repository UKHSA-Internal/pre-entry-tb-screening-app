import { describe, expect, test } from "vitest";

import { createApplicationHandler } from "./create-application";

describe("Test for create applicantion handler", () => {
  test("Application is generated successfully", async () => {
    // Arrange

    // Act
    const response = await createApplicationHandler();

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
    });
  });

  test("No duplicate Application is generated", async () => {
    // Act
    const responseOne = await createApplicationHandler();
    const responseTwo = await createApplicationHandler();

    // Assert
    const responseBodyOne = JSON.parse(responseOne.body);
    const responseBodyTwo = JSON.parse(responseTwo.body);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(responseBodyOne.applicationId).not.toEqual(responseBodyTwo.applicationId);
  });
});
