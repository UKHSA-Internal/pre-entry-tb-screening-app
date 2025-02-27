import { randomElement, visaType } from "../../support/test-utils";

describe("Validate the error message is displayed when Applicant's UK phone number field is empty", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");

    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display an error message when telephone number field is empty", () => {
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));
    cy.get("#address-1").type("Flat 2, 26 Monmouth St.");
    cy.get("#address-2").type("Bath");
    cy.get("#town-or-city").type("Somerset");
    cy.get("#postcode").type("BA1 0AP");
    cy.get("#mobile-number").should("have.value", "");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    cy.get('button[type="submit"]').click();

    cy.get(".govuk-error-summary__body").should("be.visible");
    cy.get(".govuk-error-message").should("contain.text", "Enter UK mobile number.");
  });
});
