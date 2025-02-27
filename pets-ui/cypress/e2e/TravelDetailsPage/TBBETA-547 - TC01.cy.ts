const visaTypeErrorMessage = "Select a visa type.";

describe("Validate the error message is displayed when Visa type is NOT selected", () => {
  beforeEach(() => {
    // After successful login, navigate to the travel details page
    cy.visit("http://localhost:3000/travel-details");

    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display an error message when visa type is not selected", () => {
    // Enter VALID Address Information
    cy.get("#address-1").type("61 Legard Drive");
    cy.get("#address-2").type("Anlaby");
    cy.get("#town-or-city").type("Hull");
    cy.get("#postcode").type("HU10 6UH");
    cy.get("#mobile-number").type("07123402876");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the summary box appears at the top
    cy.get(".govuk-error-summary").should("be.visible");

    // Validate visa type error message is displayed
    cy.get(".govuk-error-summary").should("contain.text", visaTypeErrorMessage);
  });
});
