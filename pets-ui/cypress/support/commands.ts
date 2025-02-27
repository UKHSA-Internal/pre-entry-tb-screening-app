import { countryList } from "../../src/utils/countryList";
import { randomElement } from "./test-utils";

Cypress.Commands.add("setupApplicationForm", () => {
  const randomCountry = randomElement(countryList);
  const countryName = randomCountry?.value;

  cy.visit("http://localhost:3000/contact");

  cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
    statusCode: 200,
    body: { success: true, message: "Data successfully posted" },
  }).as("formSubmit");

  // Enter valid data for 'Full name'
  cy.get('input[name="fullName"]').type("John Doe");

  // Select a 'Sex'
  cy.get('input[name="sex"]').check("male");

  // Randomly Select 'Country of Nationality & Issue'
  cy.get("#country-of-nationality.govuk-select").select(countryName);
  cy.get("#country-of-issue.govuk-select").select(countryName);

  // Enter VALID data for 'date of birth'
  cy.get("input#birth-date-day").type("4");
  cy.get("input#birth-date-month").type("JAN");
  cy.get("input#birth-date-year").type("1998");

  // Enter VALID data for 'Applicant's Passport number'
  cy.get('input[name="passportNumber"]').type("AA1235467");

  // Enter VALID data for 'Issue Date'
  cy.get("input#passport-issue-date-day").type("20");
  cy.get("input#passport-issue-date-month").type("11");
  cy.get("input#passport-issue-date-year").type("2011");

  // Enter VALID data for 'Expiry Date'
  cy.get("input#passport-expiry-date-day").type("19");
  cy.get("input#passport-expiry-date-month").type("11");
  cy.get("input#passport-expiry-date-year").type("2031");

  // Enter VALID address information
  cy.get("#address-1").type("1322");
  cy.get("#address-2").type("100th St");
  cy.get("#address-3").type("Apt 16");
  cy.get("#town-or-city").type("North Battleford");
  cy.get("#province-or-state").type("Saskatchewan");
  cy.get("#address-country.govuk-select").select("CAN");
  cy.get("#postcode").type("S4R 0M6");

  // Click the submit button
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "http://localhost:3000/applicant-summary");

  //Submit application
  cy.get('button[type="submit"]').click();

  //verify url navigates to applicant confirmation page
  cy.url().should("include", "http://localhost:3000/applicant-confirmation");
});
import { logCredentialInfo, testCredentials, validateCredentials } from "./test-data";

Cypress.Commands.add("loginViaB2C", () => {
  cy.log("Starting B2C authentication");

  void logCredentialInfo();

  const credentialsValid = validateCredentials();

  if (!credentialsValid) {
    cy.log("ERROR: Invalid credentials detected");
    throw new Error("Test credentials are invalid or missing. Check your cypress.env.json file.");
  }

  void cy.visit("http://localhost:3000");

  void cy.get("button#sign-in").click({ force: true });

  // Select a random credential
  const randomIndex = Math.floor(Math.random() * testCredentials.length);
  const { email, password } = testCredentials[randomIndex];
  cy.log(`Using credentials: ${email}`);

  void cy.origin(
    "https://petsb2cdev.ciamlogin.com",
    { args: { email, password } },
    ({ email, password }) => {
      cy.log("Inside B2C login page");

      void cy.wait(2000);
      void cy.document().then((doc) => {
        cy.log(`Page title: ${doc.title}`);
      });

      void cy
        .get("#i0116", { timeout: 15000 })
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(email, { force: true });

      void cy.get("#idSIButton9").should("be.visible").click({ force: true });
      void cy.wait(3000);

      void cy
        .get('input[type="password"],#i0118,#passwordInput', { timeout: 15000 })
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(password, { force: true });

      void cy.get("#idSIButton9").should("be.visible").click({ force: true });

      void cy.contains("Stay signed in?", { timeout: 20000 }).should("be.visible");

      // Click on the "Yes" button
      void cy.contains("Yes").should("be.visible").click({ force: true });

      cy.log("Completed B2C authentication flow");
    },
  );

  cy.log("Checking redirection to applicant search");
  void cy.url({ timeout: 30000 }).should("include", "/applicant-search");
});
Cypress.Commands.add("clearAllSessions", () => {
  void Cypress.session.clearAllSavedSessions();
});
