import "cypress-mochawesome-reporter/register";

// Handle the crypto object not being available in Firefox during tests
beforeEach(() => {
  // Ignore authentication errors related to crypto
  cy.on("uncaught:exception", (err) => {
    // Return false to prevent Cypress from failing the test
    if (
      err.message.includes("crypto_nonexistent") ||
      err.message.includes("The crypto object or function is not available")
    ) {
      return false;
    }
    // We still want to fail on other exceptions
    return true;
  });
});
