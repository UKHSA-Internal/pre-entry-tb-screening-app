import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededMedicalScreening } from "../fixtures/medical-screening";
import {
  ChestXRayNotTakenReason,
  MenstrualPeriods,
  PregnancyStatus,
  YesOrNo,
} from "../types/enums";
import { SaveMedicalScreeningEvent, saveMedicalScreeningHandler } from "./save-medical-screening";

const newMedicalScreeningDetails: SaveMedicalScreeningEvent["parsedBody"] = {
  dateOfMedicalScreening: "2025-05-06",
  age: 32,
  symptomsOfTb: YesOrNo.No,
  symptoms: [],
  historyOfConditionsUnder11: [],
  historyOfPreviousTb: YesOrNo.No,
  contactWithPersonWithTb: YesOrNo.No,
  pregnant: PregnancyStatus.No,
  haveMenstralPeriod: MenstrualPeriods.NA,
  physicalExaminationNotes: "NA",
  isXrayRequired: YesOrNo.No,
  reasonXrayNotRequired: ChestXRayNotTakenReason.Other,
};

describe("Test for Saving Medical Screening into DB", () => {
  test("Saving a new Medical Screening Successfully", async () => {
    // Arrange
    const event: SaveMedicalScreeningEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newMedicalScreeningDetails,
    };

    // Act
    const response = await saveMedicalScreeningHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newMedicalScreeningDetails,
      dateOfMedicalScreening: new Date(
        newMedicalScreeningDetails.dateOfMedicalScreening,
      ).toISOString(),
      dateCreated: expect.any(String),
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingMedicalScreening = seededMedicalScreening[1];
    const event: SaveMedicalScreeningEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: {
        ...existingMedicalScreening,
        dateOfMedicalScreening: new Date(
          existingMedicalScreening.dateOfMedicalScreening,
        ).toISOString(),
      },
    };

    // Act
    const response = await saveMedicalScreeningHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Medical Screening already saved" });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveMedicalScreeningEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveMedicalScreeningHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Medical Screening Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: SaveMedicalScreeningEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveMedicalScreeningHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
