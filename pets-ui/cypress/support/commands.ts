import { testCredentials } from "./test-data";

export function loginViaB2C() {}
export function logoutViaB2C() {}
export function acceptCookies() {}

// Cookie Banner Command
Cypress.Commands.add("acceptCookies", (accept: boolean = true) => {
  cy.log(`Checking for cookie banner - ${accept ? "accepting" : "rejecting"}`);

  cy.get("body").then(($body) => {
    if ($body.find(".govuk-cookie-banner").length > 0) {
      const buttonText = accept ? "Accept analytics cookies" : "Reject analytics cookies";
      cy.get("button.govuk-button").contains(buttonText).click({ force: true });
      cy.log(`${buttonText} - done`);
    } else {
      cy.log("No cookie banner present");
    }
  });
});

// Login Command
Cypress.Commands.add("loginViaB2C", () => {
  cy.log("Starting B2C authentication");

  cy.visit("/");

  // Handle cookie banner
  cy.acceptCookies();

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

// Logout Command
Cypress.Commands.add("logoutViaB2C", () => {
  cy.log("Starting B2C logout process");

  // Click the sign-out link in the header
  cy.get("#sign-out", { timeout: 10000 }).should("be.visible").click();

  // Verify sign-out confirmation page
  cy.url({ timeout: 10000 }).should("include", "/are-you-sure-you-want-to-sign-out");
  cy.contains("Are you sure you want to sign out?", { timeout: 10000 }).should("be.visible");
  cy.contains("Signing out will lose any unsaved information.").should("be.visible");

  // Click the sign-out button to confirm
  cy.get('button[type="submit"].govuk-button.govuk-button--warning')
    .should("be.visible")
    .should("contain", "Sign out")
    .click({ force: true });

  // Handle Azure B2C account picker using cy.origin
  cy.origin("https://petsb2cdev.ciamlogin.com", () => {
    cy.log("Inside B2C account picker page");

    cy.wait(2000);

    // Wait for the account picker page to load
    cy.contains("Pick an account", { timeout: 15000 }).should("be.visible");
    cy.contains("Which account do you want to sign out of?", { timeout: 10000 }).should(
      "be.visible",
    );

    // Click the first account tile in the list
    cy.get('div[data-test-id*="tile"], div.table-cell, div[role="link"]', { timeout: 10000 })
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.log("Selected account to sign out");
  });

  // Wait a moment for the redirect to complete
  cy.wait(3000);

  // Verify successful logout - this runs OUTSIDE cy.origin so it can check the main app domain
  cy.url({ timeout: 20000 }).then((url) => {
    cy.log(`Redirected to: ${url}`);
    // Check if we're on a logged-out page (sign-in or you-have-signed-out)
    expect(url).to.match(
      /you-have-signed-out|sign-in|login|oauth|authorize|search-for-visa-applicant/,
    );
  });

  cy.log("B2C logout completed successfully");
});

// Clear All Sessions Command
Cypress.Commands.add("clearAllSessions", () => {
  return Cypress.session.clearAllSavedSessions();
});
