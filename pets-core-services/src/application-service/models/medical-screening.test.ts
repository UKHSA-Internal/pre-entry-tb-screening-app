import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import {
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  TbSymptomsOptions,
  YesOrNo,
} from "../types/enums";
import { IMedicalScreening, MedicalScreening } from "./medical-screening";

describe("Tests for Medical Screening Information Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newMedicalScreening: Omit<IMedicalScreening, "dateCreated" | "status"> = {
    age: 23,
    applicationId: "test-application-id",
    symptomsOfTb: YesOrNo.Yes,
    symptoms: [TbSymptomsOptions.Fever, TbSymptomsOptions.Haemoptysis],
    historyOfConditionsUnder11: [HistoryOfConditionsUnder11.Cyanosis],
    historyOfConditionsUnder11Details: "empty result",
    historyOfPreviousTb: YesOrNo.Yes,
    contactWithPersonWithTb: YesOrNo.No,
    pregnant: PregnancyStatus.DontKnow,
    haveMenstralPeriod: MenstrualPeriods.NA,
    physicalExaminationNotes: "No notes",
    createdBy: "test-medical-screening-creator",
  };

  test("Creating new medical sreening", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const medicalScreening = await MedicalScreening.createMedicalScreening(newMedicalScreening);

    // Assert
    expect(medicalScreening).toMatchObject({
      ...newMedicalScreening,
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newMedicalScreening,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#MEDICAL#SCREENING",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Getting medical screening by application ID", async () => {
    const dateCreated = "2025-02-07";
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...newMedicalScreening,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#MEDICAL#SCREENING",
      },
    });

    // Act
    const medicalScreening = await MedicalScreening.getByApplicationId(
      newMedicalScreening.applicationId,
    );

    // Assert
    expect(medicalScreening).toMatchObject({
      ...medicalScreening,
      dateCreated: new Date("2025-02-07"),
    });
  });
});
