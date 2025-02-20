import { errorMessages } from "../../support/test-utils";

/*Scenario:As a Clinic user
I want to view the results from the applicant search
So that I can see applicants that match the criteria entered during the search process.*/

describe("Validate that error message is displayed when user clicks the search button without entering a search criteria", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/applicant-search");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display error messages", () => {
    // Click the search button
    cy.get('button[type="submit"]').click();

    // Validate that error message is displayed above each field
    cy.get(".govuk-error-message").each((message, index) => {
      cy.wrap(message).should("contain.text", errorMessages[index]);
    });
  });
});
