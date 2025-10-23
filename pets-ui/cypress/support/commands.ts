import { testCredentials } from "./test-data";

export function loginViaB2C() {}

Cypress.Commands.add("loginViaB2C", () => {
  cy.log("Starting B2C authentication");

  cy.visit("/");

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

      // More robust email input selector - tries multiple strategies
      cy.get('input[type="email"], input[name="loginfmt"], input[name="username"], #i0116', {
        timeout: 15000,
      })
        .first()
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(email, { force: true });

      // More robust "Next" button selector - finds by text, aria-label, or ID
      cy.get(
        'input[type="submit"][value*="Next"], button[type="submit"], button[aria-label*="Next"], #idSIButton9',
      )
        .filter(":visible")
        .first()
        .should("be.visible")
        .click({ force: true });

      cy.wait(3000);

      // More robust password input selector
      cy.get(
        'input[type="password"], input[name="passwd"], input[name="password"], #i0118, #passwordInput',
        {
          timeout: 15000,
        },
      )
        .first()
        .should("be.visible")
        .scrollIntoView()
        .clear()
        .type(password, { force: true });

      // Submit password
      cy.get(
        'input[type="submit"][value*="Next"], input[type="submit"][value*="Sign in"], button[type="submit"], button[aria-label*="Sign in"], #idSIButton9',
      )
        .filter(":visible")
        .first()
        .should("be.visible")
        .click({ force: true });

      // Handle "Stay signed in?" prompt with flexible selectors
      cy.contains(/stay signed in|remember me/i, { timeout: 20000 }).should("be.visible");

      // Click "Yes" button - using a flexible approach
      cy.get('input[type="submit"][value*="Yes"], button[type="submit"], button[aria-label*="Yes"]')
        .filter(":visible")
        .first()
        .should("be.visible")
        .click({ force: true });

      cy.log("Completed B2C authentication flow");
    },
  );

  cy.log("Checking redirection to applicant search");
  cy.url({ timeout: 30000 }).should("include", "/search-for-visa-applicant");
});

Cypress.Commands.add("clearAllSessions", () => {
  return Cypress.session.clearAllSavedSessions();
});
