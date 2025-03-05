import { assertEnvExists } from "../shared/config";

export enum Roles {
  ApplicationWrite = "application.write",
  ApplicationRead = "application.read",
  ApplicantsWrite = "applicants.write",
  ApplicantsRead = "applicants.read",
  ClinicsRead = "clinics.read",
  ImagingWrite = "imaging.write",
}
const AWS_ACCOUNT_ID = assertEnvExists(process.env.AWS_ACCOUNT_ID);
const API_GATEWAY_ID = assertEnvExists(process.env.API_GATEWAY_ID);

export const policyMapping: Record<Roles, string[]> = {
  [Roles.ApplicantsRead]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/applicant`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/applicant/*`,
  ],
  [Roles.ApplicantsWrite]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/POST/applicant`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/POST/applicant/*`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/PUT/applicant`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/PUT/applicant/*`,
  ],
  [Roles.ApplicationRead]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/application`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/application/*`,
  ],
  [Roles.ApplicationWrite]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/POST/application`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/POST/application/*`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/PUT/application`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/PUT/application/*`,
  ],
  [Roles.ImagingWrite]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/POST/application/*`, // TBBETA-506: Change this when 506 is picked
  ],
  [Roles.ClinicsRead]: [
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/clinics`,
    `arn:aws:execute-api:eu-west-2:${AWS_ACCOUNT_ID}:${API_GATEWAY_ID}/*/GET/clinics/*`,
  ],
};
