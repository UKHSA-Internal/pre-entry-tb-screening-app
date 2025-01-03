import { countryList } from "../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
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
// Validate the error messages above each text box are correct
const errorMessages = ["Select a visa type."];

describe("Validate the error message is displayed when Visa type is NOT selected", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display an error message when visa type is not selected", () => {
    cy.visit("http://localhost:3000/travel-details");

    // Omit Visa Type
    //cy.get('#visa-type.govuk-select').select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("61 Legard Drive");
    cy.get("#address-2").type("Anlaby");
    cy.get("#town-or-city").type("Hull");
    cy.get("#postcode").type("HU10 6UH");
    cy.get("#mobile-number").type("07123402876");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the summary box appears at the top contains the correct error messages
    cy.get(".govuk-error-summary").should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);

    });
  });
});
