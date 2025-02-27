import "cypress-mochawesome-reporter/register";
import "./commands";

beforeEach(function () {
  cy.log("Setting up authenticated session");

  const skipAuth = Cypress.env("SKIP_AUTH") === "true";
  if (skipAuth) {
    cy.log("Skipping authentication as SKIP_AUTH is true");
    return;
  }
  void cy.session(
    "authenticatedSession",
    () => {
      cy.log("Creating new authentication session");
      void cy.loginViaB2C();
    },
    {
      cacheAcrossSpecs: true,
      validate: () => {
        cy.log("Validating session");
        cy.url().then((url) => {
          if (!url.includes("login")) {
            cy.log(`Current URL: ${url}`);
          }
        });
      },
    },
  );
});
