import { countryList } from "../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];
const errorMessages = [
  "Town name must contain only letters, spaces and punctuation.",
  "Home address must contain only letters, numbers, spaces and punctuation.",
];
const urlFragment = ["#address-2", "#town-or-city"];

describe("Validate the error message for the Address Fields", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Fill out the applicant address field with INVALID characters", () => {
    cy.visit("http://localhost:3000/travel-details");

    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("17 Exmoor Rd.");
    cy.get("#address-2").type("!Southampton!");
    cy.get("#town-or-city").type("Hamp@shire");
    cy.get("#postcode").type("SO14 0AR");
    cy.get("#mobile-number").type("00447811123456");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the summary box appears at the top contains the correct error messages
    cy.get('[data-module="govuk-error-summary"]').should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);
    });

    // Validate that user is navigated to correct error when clicking message in summary
    cy.get(".govuk-error-summary a").each((link, index) => {
      cy.wrap(link).click();
      cy.url().should("include", urlFragment[index]);
    });
  });
});
