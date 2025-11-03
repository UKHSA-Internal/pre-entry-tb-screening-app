declare namespace Cypress {
  interface Chainable {
    loginViaB2C(): Chainable<void>;
    logoutViaB2C(): Chainable<void>;
    setupApplicationForm(): Chainable<void>;
    clearAllSessions(): Promise<void>;
  }
}
