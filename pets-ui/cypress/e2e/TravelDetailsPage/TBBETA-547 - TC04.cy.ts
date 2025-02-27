import { randomElement, visaType } from "../../support/test-utils";

const emailErrorMessage = "Email must be in correct format.";

describe("Validate the error message is displayed when incorrect data is entered in Applicant's UK email field", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");

    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display an error message", () => {
    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("Flat 2, 26 Monmouth St.");
    cy.get("#address-2").type("Bath");
    cy.get("#town-or-city").type("Somerset");
    cy.get("#postcode").type("BA1 0AP");
    cy.get("#mobile-number").type("00447123402876");

    // Enter INVALID email
    cy.get("#email").type("@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the summary box appears at the top
    cy.get(".govuk-error-summary").should("be.visible");

    // Check for only the email error message
    cy.get(".govuk-error-summary").should("contain.text", emailErrorMessage);
  });
});
