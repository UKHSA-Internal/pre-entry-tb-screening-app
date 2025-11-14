interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TokenCache {
  token: string;
  expiry: number;
}

interface DecodedToken {
  email?: string;
  name?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  ClinicID?: string;
  [key: string]: unknown;
}

export class AuthHelper {
  private static tokenCache: TokenCache | null = null;

  /**
   * Get bearer token programmatically (FAST - Recommended)
   */
  static getTokenProgrammatic(): Cypress.Chainable<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiry) {
      cy.log("✓ Using cached bearer token");
      return cy.wrap(this.tokenCache.token);
    }

    cy.log("Obtaining bearer token via API...");

    return cy
      .request<TokenResponse>({
        method: "POST",
        url: Cypress.env("AUTH_TOKEN_ENDPOINT") as string,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        form: true,
        body: {
          grant_type: "password",
          client_id: Cypress.env("AZURE_B2C_CLIENT_ID") as string,
          scope: Cypress.env("AZURE_B2C_SCOPE") as string,
          username: Cypress.env("TEST_USER_EMAIL") as string,
          password: Cypress.env("TEST_USER_PASSWORD") as string,
        },
        failOnStatusCode: false,
      })
      .then((response) => {
        if (response.status !== 200) {
          cy.log(`❌ Token request failed: ${response.status}`);
          cy.log("Response:", response.body);
          throw new Error(`Failed to obtain token: ${response.status}`);
        }

        const { access_token: token, expires_in: expiresIn = 3600 } = response.body;

        if (!token) {
          throw new Error("No access token in response");
        }

        cy.log(`✓ Token obtained: ${token.substring(0, 30)}...`);

        this.tokenCache = {
          token: token,
          expiry: Date.now() + (expiresIn - 300) * 1000, // 5 min buffer
        };

        return token;
      });
  }

  /**
   * Get bearer token via UI (SLOW - Fallback method)
   * Uses your existing loginViaB2C command
   */
  static getTokenViaUI(): Cypress.Chainable<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiry) {
      return cy.wrap(this.tokenCache.token);
    }

    cy.session(
      "api-bearer-token-ui",
      () => {
        // Use your existing custom command
        cy.loginViaB2C();
        cy.url().should("include", "/search-for-visa-applicant");

        cy.window().then((win) => {
          let token: string | null = null;

          // Try common storage locations
          const storageKeys = [
            "accessToken",
            "access_token",
            "bearerToken",
            "authToken",
            "msal.idtoken",
          ];

          for (const key of storageKeys) {
            token = win.localStorage.getItem(key) || win.sessionStorage.getItem(key);
            if (token) {
              cy.log(`Found token in: ${key}`);
              break;
            }
          }

          // Try MSAL token cache
          if (!token) {
            const msalKeys = Object.keys(win.localStorage).filter(
              (key) => key.includes("msal") || key.includes("accessToken"),
            );

            for (const key of msalKeys) {
              const value = win.localStorage.getItem(key);
              if (value) {
                try {
                  const parsed = JSON.parse(value) as { accessToken?: string; secret?: string };
                  if (parsed.accessToken) {
                    token = parsed.accessToken;
                    cy.log(`Extracted token from: ${key}`);
                    break;
                  }
                  if (parsed.secret) {
                    token = parsed.secret;
                    cy.log(`Extracted token from: ${key}`);
                    break;
                  }
                } catch {
                  // If parsing fails, check if value itself looks like a JWT token
                  if (value.length > 50 && value.includes(".")) {
                    token = value;
                    cy.log(`Using direct token value from: ${key}`);
                    break;
                  }
                }
              }
            }
          }

          if (!token) {
            throw new Error("Bearer token not found in browser storage");
          }

          cy.wrap(token).as("bearerToken");
        });
      },
      { cacheAcrossSpecs: true },
    );

    // Return the token after session is established
    return cy.get<string>("@bearerToken").then((token) => {
      this.tokenCache = {
        token: token,
        expiry: Date.now() + 50 * 60 * 1000, // 50 minutes
      };
      return token;
    });
  }

  /**
   * Primary login method - tries programmatic first
   */
  static login(): Cypress.Chainable<string> {
    return this.getTokenViaUI();
  }

  /**
   * Decode JWT token
   */
  static decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        cy.log("Invalid token format");
        return null;
      }

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (error) {
      cy.log("Error decoding token:", error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * Verify token has required roles
   */
  static verifyTokenRoles(token: string, requiredRoles: string[]): boolean {
    const decoded = this.decodeToken(token);

    if (!decoded) {
      cy.log("✗ Failed to decode token");
      return false;
    }

    if (!decoded.roles || !Array.isArray(decoded.roles)) {
      cy.log("✗ Token has no roles property");
      return false;
    }

    const hasAllRoles = requiredRoles.every((role) => decoded.roles!.includes(role));

    if (hasAllRoles) {
      cy.log(`✓ Token has all required roles: ${requiredRoles.join(", ")}`);
    } else {
      cy.log(`✗ Missing roles`);
      cy.log(`  Has: ${decoded.roles.join(", ")}`);
      cy.log(`  Required: ${requiredRoles.join(", ")}`);
    }

    return hasAllRoles;
  }

  /**
   * Clear token cache
   */
  static clearTokenCache(): void {
    this.tokenCache = null;
    cy.log("✓ Token cache cleared");
  }

  /**
   * Get token expiry time
   */
  static getTokenExpiry(): Date | null {
    if (!this.tokenCache) {
      return null;
    }
    return new Date(this.tokenCache.expiry);
  }

  /**
   * Check if token is expired or about to expire
   */
  static isTokenExpired(): boolean {
    if (!this.tokenCache) {
      return true;
    }
    return Date.now() >= this.tokenCache.expiry;
  }

  /**
   * Debug: Log token information
   */
  static debugToken(token: string): void {
    const decoded = this.decodeToken(token);

    if (!decoded) {
      cy.log("❌ Failed to decode token");
      return;
    }

    cy.log("=== Token Debug Info ===");
    cy.log(`Email: ${decoded.email || "N/A"}`);
    cy.log(`Name: ${decoded.name || "N/A"}`);
    cy.log(`Roles: ${decoded.roles?.join(", ") || "None"}`);
    cy.log(`Clinic ID: ${decoded.ClinicID || "N/A"}`);

    if (decoded.iat && typeof decoded.iat === "number") {
      cy.log(`Issued At: ${new Date(decoded.iat * 1000).toLocaleString()}`);
    }

    if (decoded.exp && typeof decoded.exp === "number") {
      const expiryDate = new Date(decoded.exp * 1000);
      const now = new Date();
      const isExpired = expiryDate < now;
      cy.log(`Expires: ${expiryDate.toLocaleString()} ${isExpired ? "(EXPIRED)" : "(Valid)"}`);
    }

    cy.log("========================");
  }

  /**
   * Get user email from token
   */
  static getTokenEmail(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.email || null;
  }

  /**
   * Get user roles from token
   */
  static getTokenRoles(token: string): string[] {
    const decoded = this.decodeToken(token);
    if (decoded?.roles && Array.isArray(decoded.roles)) {
      return decoded.roles;
    }
    return [];
  }

  /**
   * Validate environment variables are set
   */
  static validateEnvironment(): void {
    const requiredVars = [
      "AUTH_TOKEN_ENDPOINT",
      "AZURE_B2C_CLIENT_ID",
      "AZURE_B2C_SCOPE",
      "TEST_USER_EMAIL",
      "TEST_USER_PASSWORD",
    ];

    const missingVars: string[] = [];

    requiredVars.forEach((varName) => {
      const value = Cypress.env(varName) as string | undefined;
      if (!value) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      const errorMsg = `Missing required environment variables: ${missingVars.join(", ")}`;
      cy.log(`❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }

    cy.log("✓ All required environment variables are set");
  }
}
