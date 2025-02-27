/* Scenario: GIVEN I am on the application progress tracker
WHEN I click a task link
AND the status of the task is Incomplete
THEN I am navigated to the first page of the task.*/

describe("Verify user is navigated to the Task page when the Task link is clicked", () => {
  beforeEach(() => {
    cy.setupApplicationForm();
  });

  it("Should navigate to the first page of the task with incomplete task status", () => {
    cy.visit("http://localhost:3000/tracker");

    cy.get("h1").should("contain.text", "TB screening progress tracker");
    cy.get(".govuk-task-list").should("contain.text", "Visa applicant details");

    // Check for incomplete status and click the first task
    cy.get(".govuk-task-list__status").should("contain.text", "Incomplete");
    cy.get(".govuk-task-list a").first().click();

    // Verify navigation to the contact page
    cy.url().should("include", "http://localhost:3000/contact");
  });
});
