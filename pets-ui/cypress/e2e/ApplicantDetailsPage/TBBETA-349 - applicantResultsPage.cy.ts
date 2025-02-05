/*Scenario:
GIVEN I am on the "Search results" page for no matching applicant
WHEN I click on the "Create New Application" button
THEN I am navigated to the "Enter applicant details" page.*/

describe("Validate that page navigates to 'Enter applicant details' page when user clicks on 'Create New Application'", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/applicant-results");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should navigate to create new application page", () => {
    //validate that 'No matching record found ' is visible
    cy.get("h1").should("be.visible").and("have.text", "No matching record found");

    // Click create new applicant button
    cy.get('button[id="create-new-applicant"]').click();

    //Validate that page navigates to enter applicant details page
    cy.url().should("include", "http://localhost:3000/contact");
  });
});
