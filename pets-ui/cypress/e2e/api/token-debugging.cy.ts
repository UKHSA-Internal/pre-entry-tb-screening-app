interface TokenErrorResponse {
  error?: string;
  error_description?: string;
  error_codes?: number[];
  timestamp?: string;
  trace_id?: string;
  correlation_id?: string;
}

interface TokenSuccessResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

describe("API: Token Request Debugging", () => {
  it("should show detailed token request information", () => {
    cy.log("=== Token Request Configuration ===");

    const endpoint =
      (Cypress.env("AUTH_TOKEN_ENDPOINT") as string) ||
      "https://clinics.test.pets.ukhsa.gov.uk/api";

    const clientId = Cypress.env("AZURE_B2C_CLIENT_ID") as string;
    const scope = Cypress.env("AZURE_B2C_SCOPE") as string;
    const username = Cypress.env("TEST_USER_EMAIL") as string;
    const password = Cypress.env("TEST_USER_PASSWORD") as string;

    cy.log(`Endpoint: ${endpoint}`);
    cy.log(`Client ID: ${clientId}`);
    cy.log(`Scope: ${scope}`);
    cy.log(`Username: ${username}`);
    cy.log(`Password: ${password ? "***" : "NOT SET"}`);

    cy.log("=== Attempting Token Request ===");

    cy.request<TokenSuccessResponse | TokenErrorResponse>({
      method: "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      form: true,
      body: {
        grant_type: "password",
        client_id: clientId,
        scope: scope,
        username: username,
        password: password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Response Status: ${response.status}`);
      cy.log("Response Body:", response.body);

      if (response.status === 400) {
        cy.log("400 Bad Request Error");
        cy.log("Common causes:");
        cy.log("1. ROPC flow not enabled for this client");
        cy.log("2. Wrong client_id");
        cy.log("3. Invalid username/password");
        cy.log("4. Incorrect scope format");

        const errorBody = response.body as TokenErrorResponse;
        if (errorBody.error) {
          cy.log(`Error: ${errorBody.error}`);
        }
        if (errorBody.error_description) {
          cy.log(`Description: ${errorBody.error_description}`);
        }
        if (errorBody.error_codes) {
          cy.log(`Error codes: ${errorBody.error_codes.join(", ")}`);
        }
      } else if (response.status === 200) {
        cy.log("Token obtained successfully!");
        const successBody = response.body as TokenSuccessResponse;
        cy.log(`Token type: ${successBody.token_type}`);
        cy.log(`Expires in: ${successBody.expires_in} seconds`);
        cy.log(`Scope: ${successBody.scope || "Not specified"}`);
      } else {
        cy.log(`Unexpected status code: ${response.status}`);
      }
    });
  });

  it("should try alternative token request format", () => {
    cy.log("=== Trying Alternative Configuration ===");

    const endpoint =
      (Cypress.env("AUTH_TOKEN_ENDPOINT") as string) ||
      "https://clinics.test.pets.ukhsa.gov.uk/api";
    const clientId = Cypress.env("AZURE_B2C_CLIENT_ID") as string;
    const username = Cypress.env("TEST_USER_EMAIL") as string;
    const password = Cypress.env("TEST_USER_PASSWORD") as string;

    cy.log("Trying with simplified scope format...");

    // Try with minimal scope
    cy.request<TokenSuccessResponse | TokenErrorResponse>({
      method: "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: true,
      body: {
        grant_type: "password",
        client_id: clientId,
        scope: `${clientId}/.default`, // Simplified scope
        username: username,
        password: password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status with simplified scope: ${response.status}`);

      if (response.status === 200) {
        cy.log("✅ Alternative scope format worked!");
        cy.log(`Use this scope: ${clientId}/.default`);
        const successBody = response.body as TokenSuccessResponse;
        cy.log(`Token obtained with expires_in: ${successBody.expires_in}s`);
      } else {
        cy.log("❌ Alternative scope also failed");
        const errorBody = response.body as TokenErrorResponse;
        if (errorBody.error) {
          cy.log(`Error: ${errorBody.error}`);
        }
        if (errorBody.error_description) {
          cy.log(`Description: ${errorBody.error_description}`);
        }
      }
    });
  });

  it("should try without scope parameter", () => {
    cy.log("=== Trying Without Scope ===");

    const endpoint =
      (Cypress.env("AUTH_TOKEN_ENDPOINT") as string) ||
      "https://clinics.test.pets.ukhsa.gov.uk/api";
    const clientId = Cypress.env("AZURE_B2C_CLIENT_ID") as string;
    const username = Cypress.env("TEST_USER_EMAIL") as string;
    const password = Cypress.env("TEST_USER_PASSWORD") as string;

    cy.request<TokenSuccessResponse | TokenErrorResponse>({
      method: "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: true,
      body: {
        grant_type: "password",
        client_id: clientId,
        username: username,
        password: password,
        // No scope parameter
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log(`Status without scope: ${response.status}`);

      if (response.status === 200) {
        cy.log("✅ Request worked without scope!");
        cy.log("You can remove the AZURE_B2C_SCOPE variable");
      } else {
        cy.log("Scope parameter is required");
      }
    });
  });
});
