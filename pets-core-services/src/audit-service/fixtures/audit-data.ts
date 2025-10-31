import { seededApplications } from "../../shared/fixtures/application";
import { NewAudit } from "../models/audit-db-ops";
import { SourceType } from "../types/enums";

export const seededAuditData: Array<NewAudit> = [
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
