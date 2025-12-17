import { DynamoDBRecord } from "aws-lambda";

import { seededApplications } from "../../shared/fixtures/application";
import { NewAudit } from "../models/audit-db-ops";
import { SourceType } from "../types/enums";

export const seededAudiOutputtData: Array<NewAudit> = [
  {
    applicationId: seededApplications[1].applicationId,
    dateUpdated: "2025-05-05",
    updatedBy: "shane.park@iom.com",
    eventType: "INSERT",
    source: SourceType.app,
    sourceTable: "application-details",
    changeDetails: JSON.stringify({
      ...seededApplications[1],
      dateCreated: new Date(seededApplications[1].createdBy),
    }),
  },
];

export const seededApplicationsDynamoDBJSON: Array<NewAudit> = [
  {
    applicationId: seededApplications[1].applicationId,
    dateUpdated: "2025-05-05",
    updatedBy: "shane.park@iom.com",
    eventType: "MODIFY",
    source: SourceType.app,
    sourceTable: "application-details",
    changeDetails: JSON.stringify({
      ...seededApplications[1],
      dateCreated: new Date(seededApplications[1].createdBy),
    }),
  },
];

export const seededAuditData: Array<DynamoDBRecord> = [
  {
    eventID: "9c7f75b0e7701ae79a6b1fe27a1e251e",
    eventName: "INSERT",
    eventVersion: "1.1",
    eventSource: "aws:dynamodb",
    awsRegion: "eu-west-2",
    dynamodb: {
      ApproximateCreationDateTime: 1761899595,
      Keys: {
        sk: {
          S: "APPLICATION#TRAVEL#INFORMATION",
        },
        pk: {
          S: "APPLICATION#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
        },
      },
      NewImage: {
        ukAddressTownOrCity: {
          S: "London",
        },
        dateCreated: {
          S: "2025-10-31T08:33:14.953Z",
        },
        ukAddressLine1: {
          S: "221B Baker Street",
        },
        visaCategory: {
          S: "Student",
        },
        sk: {
          S: "APPLICATION#TRAVEL#INFORMATION",
        },
        ukAddressPostcode: {
          S: "NW1 6XE",
        },
        ukEmailAddress: {
          S: "john.smith@example.com",
        },
        pk: {
          S: "APPLICATION#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
        },
        ukMobileNumber: {
          S: "+447911123456",
        },
        applicationId: {
          S: "568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
        },
        ukAddressLine2: {
          S: "Marylebone",
        },
        status: {
          S: "completed",
        },
        createdBy: {
          S: "someone@the-email.net",
        },
      },
      SequenceNumber: "298669500002753139988920065",
      SizeBytes: 449,
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
    eventSourceARN:
      "arn:aws:dynamodb:eu-west-2:108782068086:table/application-details/stream/2025-08-28T12:56:03.940",
  },
];

export const mockEventBridgeEvents: Array<DynamoDBRecord> = [
  {
    eventID: "9619eac1aeb719c2bb611b501c8716f3",
    eventName: "INSERT",
    eventVersion: "1.1",
    eventSource: "aws:dynamodb",
    awsRegion: "eu-west-2",
    dynamodb: {
      ApproximateCreationDateTime: 1762343197,
      Keys: {
        sk: {
          S: "APPLICANT#DETAILS",
        },
        pk: {
          S: "APPLICATION#ea1a5084-f2e3-4601-af6b-a25378cce480",
        },
      },
      NewImage: {
        passportNumber: {
          S: "TEMP0123RARY",
        },
        country: {
          S: "AFG",
        },
        countryOfIssue: {
          S: "AFG",
        },
        townOrCity: {
          S: "temp city",
        },
        countryOfNationality: {
          S: "AFG",
        },
        provinceOrState: {
          S: "temp state",
        },
        sex: {
          S: "Female",
        },
        applicantHomeAddress2: {
          S: "",
        },
        postcode: {
          S: "",
        },
        applicantHomeAddress1: {
          S: "temp address",
        },
        fullName: {
          S: "temp user",
        },
        dateOfBirth: {
          S: "1999-04-01T00:00:00.000Z",
        },
        expiryDate: {
          S: "2026-05-31T00:00:00.000Z",
        },
        dateCreated: {
          S: "2025-11-05T11:46:37.368Z",
        },
        createdBy: {
          S: "Jaroslaw.M.Michalski@ukhsa.gov.uk",
        },
        applicantHomeAddress3: {
          S: "",
        },
        sk: {
          S: "APPLICANT#DETAILS",
        },
        pk: {
          S: "APPLICATION#ea1a5084-f2e3-4601-af6b-a25378cce480",
        },
        applicationId: {
          S: "ea1a5084-f2e3-4601-af6b-a25378cce480",
        },
        issueDate: {
          S: "2019-05-31T00:00:00.000Z",
        },
        passportId: {
          S: "COUNTRY#AFG#PASSPORT#TEMP0123RARY",
        },
        status: {
          S: "completed",
        },
      },
      SequenceNumber: "322503400002640608910568305",
      SizeBytes: 653,
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
    eventSourceARN:
      "arn:aws:dynamodb:eu-west-2:108782068086:table/applicant-details/stream/2025-08-28T12:56:03.943",
  },
];
