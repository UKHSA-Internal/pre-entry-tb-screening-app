export const testData = {
  fullName: "John Doe",
  sex: "male",
  birthDate: { day: "04", month: "01", year: "2001" },
  passport: {
    number: "AA1235467",
    issueDate: { day: "11", month: "11", year: "2019" },
    expiryDate: { day: "11", month: "11", year: "2029" },
  },
  address: {
    line1: "123",
    line2: "100th St",
    line3: "West Lane",
    town: "North Battleford",
    province: "Saskatchewan",
    postcode: "S4R 0M6",
  },
};

export const testCredentials: Array<{ email: string; password: string }> = [
  {
    email: String(Cypress.env("USER_1_EMAIL")),
    password: String(Cypress.env("USER_1_PASSWORD")),
  },
  {
    email: String(Cypress.env("USER_2_EMAIL")),
    password: String(Cypress.env("USER_2_PASSWORD")),
  },
  {
    email: String(Cypress.env("USER_3_EMAIL")),
    password: String(Cypress.env("USER_3_PASSWORD")),
  },
  {
    email: String(Cypress.env("USER_4_EMAIL")),
    password: String(Cypress.env("USER_4_PASSWORD")),
  },
  {
    email: String(Cypress.env("USER_5_EMAIL")),
    password: String(Cypress.env("USER_5_PASSWORD")),
  },
  {
    email: String(Cypress.env("USER_6_EMAIL")),
    password: String(Cypress.env("USER_6_PASSWORD")),
  },
];

export function validateCredentials() {
  const validCredentials = testCredentials.every(
    (cred) => cred.email && cred.email.length > 0 && cred.password && cred.password.length > 0,
  );

  return validCredentials;
}
export function logCredentialInfo() {
  cy.log("Validating credentials:");

  testCredentials.forEach((cred, index) => {
    cy.log(`Credential ${index + 1}: ${cred.email}`);
  });

  cy.log("Environment variables check:");
  [
    "USER_1_EMAIL",
    "USER_1_PASSWORD",
    "USER_2_EMAIL",
    "USER_2_PASSWORD",
    "USER_3_EMAIL",
    "USER_3_PASSWORD",
    "USER_4_EMAIL",
    "USER_4_PASSWORD",
    "USER_5_EMAIL",
    "USER_5_PASSWORD",
    "USER_6_EMAIL",
    "USER_6_PASSWORD",
  ].forEach((varName) => {
    cy.log(`${varName}: ${Cypress.env(varName) ? "EXISTS" : "MISSING"}`);
  });
}
