export enum Roles {
  ApplicationWrite = "Application.Write",
  ApplicationRead = "Application.Read",
  ApplicantsWrite = "Applicants.Write",
  ApplicantsRead = "Applicants.Read",
  ClinicsRead = "Clinics.Readb2cRole",
  // TODO: Ask Sanj about delete(cancelling), clinic write
}

export const policyMapping: Record<Roles, string[]> = {
  [Roles.ApplicantsRead]: [
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/applicant`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/applicant/*`,
  ],
  [Roles.ApplicantsWrite]: [
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/POST/applicant`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/POST/applicant/*`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/PUT/applicant`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/PUT/applicant/*`,
  ],
  [Roles.ApplicationRead]: [
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/application`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/application/*`,
  ],
  [Roles.ApplicationWrite]: [
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/POST/application`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/POST/application/*`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/PUT/application`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/PUT/application/*`,
  ],
  [Roles.ClinicsRead]: [
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/clinics`,
    `arn:aws:execute-api:eu-west-2:${process.env.AWS_ACCOUNT_ID}:${process.env.API_GATEWAY_ID}/*/GET/clinics/*`,
  ],
};
