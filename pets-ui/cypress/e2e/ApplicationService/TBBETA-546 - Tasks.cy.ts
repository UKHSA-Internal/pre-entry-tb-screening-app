import { setupApplicationForm } from "../../support/commands";

/* Scenario: GIVEN I am on the application progress tracker
WHEN I click a a task link
AND the status of the task is Incomplete
THEN I am navigated to the first page of the task.*/

describe("Verify user is navigated to the Task page when the Task link is clicked", () => {
  beforeEach(() => {
    setupApplicationForm();
  });

  it("Should navigate to the first page of the task with incomplete task status", () => {
    cy.visit("http://localhost:3000/tracker");
    //Verify user is on the application progress tracker page
    cy.get("h1").should("contain.text", "Application Progress Tracker");
    cy.get(".govuk-task-list").should("contain.text", "Visa applicant details");

    //Verify task status is incomplete
    cy.get(".govuk-task-list__status").should("contain.text", "Incomplete");
    cy.get(".govuk-task-list").click();

    //Verify user navigates to applicant information page
    cy.url().should("include", "http://localhost:3000/contact");
  });
});
