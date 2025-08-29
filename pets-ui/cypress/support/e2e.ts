import "cypress-mochawesome-reporter/register";
import "./commands";

// Clear all browser data before each test
beforeEach(function () {
  // Clear all sessions and browser data first
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();

  // Clear Cypress sessions
  cy.then(() => {
    return Cypress.session.clearAllSavedSessions();
  });

  // Clear additional browser storage
  cy.window().then((win) => {
    win.sessionStorage.clear();
    win.localStorage.clear();

    // Clear IndexedDB if it exists
    if (win.indexedDB) {
      // Handle the promise properly with return
      return win.indexedDB
        .databases()
        .then((databases) => {
          const deletePromises = databases.map((db) => {
            if (db.name) {
              return win.indexedDB.deleteDatabase(db.name);
            }
            return Promise.resolve();
          });
          return Promise.all(deletePromises);
        })
        .catch(() => {
          // Ignore errors
          return Promise.resolve();
        });
    }
    return Promise.resolve();
  });

  cy.log("Setting up fresh authenticated session");

  const skipAuth = Cypress.env("SKIP_AUTH") === "true";
  if (skipAuth) {
    cy.log("Skipping authentication as SKIP_AUTH is true");
    return;
  }

  // Create a unique session key for each test to prevent caching
  const testTitle = Cypress.currentTest?.title || "default";
  const sessionKey = `authenticatedSession-${Date.now()}-${testTitle}`;

  cy.session(
    sessionKey, // Unique key prevents session reuse
    () => {
      cy.log("Creating new authentication session with fresh browser state");
      cy.loginViaB2C();
    },
    {
      cacheAcrossSpecs: false, // Changed to false to prevent cross-spec caching
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

// Clear everything after each test as well
afterEach(function () {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();

  // Handle the promise properly in afterEach
  cy.then(() => {
    return Cypress.session.clearAllSavedSessions();
  });
});
