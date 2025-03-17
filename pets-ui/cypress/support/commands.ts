import { testCredentials } from "./test-data";

export function loginViaB2C() {}
Cypress.Commands.add("loginViaB2C", () => {
  cy.log("Starting B2C authentication");

  cy.visit("http://localhost:3000");

  cy.get("button#sign-in").click({ force: true });

  // Select a random credential
  const randomIndex = Math.floor(Math.random() * testCredentials.length);
  const { email, password } = testCredentials[randomIndex];
  cy.log(`Using credentials: ${email}`);

  cy.origin(
    "https://petsb2cdev.ciamlogin.com",
    { args: { email, password } },
    ({ email, password }) => {
      cy.log("Inside B2C login page");

      cy.wait(2000);
      cy.document().then((doc) => {
        cy.log(`Page title: ${doc.title}`);
      });

      cy.get("#i0116", { timeout: 15000 })
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(email, { force: true });

      cy.get("#idSIButton9").should("be.visible").click({ force: true });
      cy.wait(3000);

      cy.get('input[type="password"],#i0118,#passwordInput', { timeout: 15000 })
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(password, { force: true });

      cy.get("#idSIButton9").should("be.visible").click({ force: true });

      cy.contains("Stay signed in?", { timeout: 20000 }).should("be.visible");

      // Click on the "Yes" button
      cy.contains("Yes").should("be.visible").click({ force: true });

      cy.log("Completed B2C authentication flow");
    },
  );

  cy.log("Checking redirection to applicant search");
  cy.url({ timeout: 30000 }).should("include", "/applicant-search");
});
Cypress.Commands.add("clearAllSessions", () => {
  return Cypress.session.clearAllSavedSessions();
});
