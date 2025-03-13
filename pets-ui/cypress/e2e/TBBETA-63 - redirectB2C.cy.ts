import { testCredentials } from "../support/test-data";

/**
 * Scenario:
 * Given I am a signed up user:
 * When I successfully authenticate via Azure Entra B2C,
 * Then I am taken to the Applicant Search Page (`/applicant-search`)
 */
describe.skip("Validate that user is navigated to the Applicant Search page when successfully authenticated via Azure Entra B2C", () => {
  beforeEach(() => {
    Cypress.env("SKIP_AUTH", "true");
    cy.visit("/");
  });

  afterEach(() => {
    Cypress.env("SKIP_AUTH", "false");
  });

  it.skip("should allow login and navigate to Applicant Search page", () => {
    expect(testCredentials.length).to.be.greaterThan(0);
    // Click the sign-in button
    cy.get("button#sign-in").click({ force: true });

    // Select a random credential
    const randomIndex = Math.floor(Math.random() * testCredentials.length);
    const { email, password } = testCredentials[randomIndex];

    // Input login details on the B2C login page
    cy.origin(
      "https://petsb2cdev.ciamlogin.com",
      { args: { email, password } },
      ({ email, password }) => {
        cy.get("#i0116").type(email);
        cy.get("#idSIButton9").click();
        cy.get('input[type="password"]').type(password);
        cy.get("#idSIButton9").click();

        // Verify text "Stay signed in?" to be visible
        cy.contains("Stay signed in?").should("be.visible");

        // Click on the "Yes" button
        cy.contains("Yes").click();
      },
    );

    // Validate that user is redirected to the Application Search page
    cy.url().should("include", "/applicant-search");
  });
});
