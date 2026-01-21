/**
 * BasePage - Minimal base class for all page objects
 * Provides core navigation and URL utilities
 * Domain-specific functionality has been moved to helper classes
 */
export class BasePage {
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  // Navigation
  visit(): void {
    cy.visit(this.path);
  }

  // URL verification
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  verifyUrlContains(path: string): BasePage {
    cy.url().should("include", path);
    return this;
  }

  // Basic waiting
  waitForApiCalls(duration: number = 1000): BasePage {
    cy.wait(duration);
    return this;
  }

  // Wait for element with custom timeout
  waitForElement(selector: string, timeout: number = 10000): BasePage {
    cy.get(selector, { timeout }).should("be.visible");
    return this;
  }

  // Verify element contains text with timeout
  verifyElementContainsText(
    selector: string,
    expectedText: string,
    timeout: number = 10000,
  ): BasePage {
    cy.get(selector, { timeout }).should("contain.text", expectedText);
    return this;
  }

  // Verify back link with expected href
  verifyBackLink(expectedHref: string): BasePage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", expectedHref);
    return this;
  }

  // Click back link
  clickBackLink(): BasePage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): BasePage {
    cy.get("body").then(($body) => {
      if ($body.find(".govuk-service-navigation__service-name").length > 0) {
        cy.get(".govuk-service-navigation__link")
          .should("be.visible")
          .and("contain", "Complete UK pre-entry health screening");
      } else {
        cy.log("Service name not found in header (expected for landing page)");
      }
    });
    return this;
  }
}
