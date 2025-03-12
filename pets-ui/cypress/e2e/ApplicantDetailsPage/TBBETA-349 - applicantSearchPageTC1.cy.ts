// Define the epected error messages
const searchErrorMessages = [
  "Enter the applicant's passport number.",
  "Select the country of issue.",
];

/*Scenario: As a Clinic user
I want to view the results from the applicant search
So that I can see applicants that match the criteria entered during the search process.*/

describe("Validate that error message is displayed when user clicks the search button without entering a search criteria", () => {
  beforeEach(() => {
    // After successful login, navigate to the applicant search page
    cy.visit("http://localhost:3000/applicant-search");

    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display error messages when search is performed without criteria", () => {
    cy.get('button[type="submit"]').click();

    // Validate that error messages are displayed
    cy.get(".govuk-error-message").should("be.visible");

    // Verifyif expected error message appears
    searchErrorMessages.forEach((errorMessage) => {
      cy.get(".govuk-error-message").should("contain.text", errorMessage);
    });
  });
});
