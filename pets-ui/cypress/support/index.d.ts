declare namespace Cypress {
  interface Chainable {
    loginViaB2C(): Chainable<void>;
    setupApplicationForm(): Chainable<void>;
    clearAllSessions(): Chainable<void>;
  }
}
