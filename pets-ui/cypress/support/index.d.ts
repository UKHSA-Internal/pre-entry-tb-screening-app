declare namespace Cypress {
  interface Chainable {
    loginViaB2C(): Chainable<void>;
    logoutViaB2C(): Chainable<void>;
    setupApplicationForm(): Chainable<void>;
    clearAllSessions(): Promise<void>;
    acceptCookies(accept?: boolean): Chainable<void>;
    cancelSignOut(): Chainable<void>;
  }
  interface Env {
    // API Testing
    AUTH_TOKEN_ENDPOINT: string;
    AZURE_B2C_CLIENT_ID: string;
    AZURE_B2C_SCOPE: string;
    TEST_USER_EMAIL: string;
    TEST_USER_PASSWORD: string;
    API_BASE_URL: string;

    // Existing
    CURRENT_ENVIRONMENT: string;
    PETS_SQS_QUEUE_URL: string;
    PETS_DLQ_URL: string;
  }
}
