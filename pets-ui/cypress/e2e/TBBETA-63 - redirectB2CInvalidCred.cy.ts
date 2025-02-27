/**
 * Scenario:
 * Given I am a user with non-existent credentials:
 * When I attempt to authenticate via Azure Entra B2C with an email that doesn't exist,
 * Then I should see an error message and remain on the login page
 */

describe("Validate that user cannot access the application with non-existent credentials", () => {
  Cypress.env("SKIP_AUTH", "true");
});

after(() => {
  Cypress.env("SKIP_AUTH", "false");
});
beforeEach(() => {
  cy.visit("http://localhost:3000");
  cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
    statusCode: 200,
    body: { success: true, message: "Data successfully posted" },
  }).as("formSubmit");

  // Test naviagtion to applicant search page
  cy.intercept("GET", "**/applicant-search*").as("applicantSearchPage");
});

it("should show error message when email does not exist", () => {
  // Click the sign-in button
  cy.get("#sign-in").click();

  // Enter invalid credentials
  const nonExistentEmail = "nonexistent.user@example.com";
  const password = "AnyPassword123!";

  // Input login details on the B2C login page
  cy.origin(
    "https://petsb2cdev.ciamlogin.com",
    { args: { nonExistentEmail, password } },
    ({ nonExistentEmail, password }) => {
      cy.get('input[type="email"]').type(nonExistentEmail);
      cy.get("#idSIButton9").click();
      cy.get("#i0118").type(password, { force: true });
      cy.get("#idSIButton9").click();

      // Verify that error message is displayed
      cy.contains("We couldn't find an account with this email address.").should("be.visible");

      // Verify user is still on the login page
      cy.url().should("include", "petsb2cdev.ciamlogin.com");
    },
  );

  // Verify that user is NOT redirected to the applicant search page
  cy.get("@applicantSearchPage.all").should("have.length", 0);
});
