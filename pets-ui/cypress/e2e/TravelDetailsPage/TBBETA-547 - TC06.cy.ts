import { randomElement } from "../../support/test-utils";

const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];
// Validate the error messages above each text box are correct
const errorMessages = ["Enter town or city."];

describe("Validate the error message is displayed when partial postcode is entered", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display an error message when partial postcode is entered in the Postcode field", () => {
    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("Flat 2, 26 Monmouth St.");
    cy.get("#address-2").type("Bath");
    cy.get("#town-or-city").should("have.value", "");
    cy.get("#postcode").type("BA1");
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
