/**
 * GdsComponentHelper - Handles all GDS component verifications
 * Provides methods for verifying breadcrumbs, service name, tables, notifications, etc.
 */
export class GdsComponentHelper {
  // Breadcrumb navigation
  verifyBreadcrumbNavigation(): GdsComponentHelper {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  verifyBreadcrumbExists(): GdsComponentHelper {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Service name verification
  verifyServiceName(): GdsComponentHelper {
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

  // Back link methods
  verifyBackLink(expectedHref: string): GdsComponentHelper {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", expectedHref);
    return this;
  }

  verifyBackLinkToPath(expectedPath: string): GdsComponentHelper {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", expectedPath);
    return this;
  }

  clickBackLink(): GdsComponentHelper {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Grid layout verification
  verifyGridLayout(): GdsComponentHelper {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Table verification methods
  verifyTableExists(): GdsComponentHelper {
    cy.get(".govuk-table").should("be.visible");
    return this;
  }

  verifyTableHeaders(expectedHeaders: string[]): GdsComponentHelper {
    expectedHeaders.forEach((header) => {
      cy.get(".govuk-table__header").should("contain", header);
    });
    return this;
  }

  // Section break verification
  verifySectionBreaks(): GdsComponentHelper {
    cy.get("hr.govuk-section-break").should("exist");
    return this;
  }

  // Notification banner methods
  verifyNotificationBanner(title: string = "Important"): GdsComponentHelper {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", title);
    return this;
  }

  verifyNotificationBannerContent(content: string): GdsComponentHelper {
    cy.get(".govuk-notification-banner__content").should("contain", content);
    return this;
  }

  // Task tracker/list methods
  verifyTaskStatus(taskName: string, expectedStatus: string): GdsComponentHelper {
    cy.contains(".govuk-task-list__name-and-hint", taskName)
      .siblings(".govuk-task-list__status")
      .should("contain.text", expectedStatus);
    return this;
  }

  clickTaskLink(taskName: string): GdsComponentHelper {
    cy.contains(".govuk-task-list__name-and-hint", taskName).find("a").click();
    return this;
  }

  // Page title and heading
  verifyPageHeading(text: string): GdsComponentHelper {
    cy.get("h1").should("be.visible").and("contain", text);
    return this;
  }

  verifyPageTitle(expectedTitle: string): GdsComponentHelper {
    cy.title().should("include", expectedTitle);
    return this;
  }

  // Standard page elements
  verifyStandardPageElements(): GdsComponentHelper {
    this.verifyServiceName();
    this.verifyGridLayout();
    return this;
  }

  // Data-testid helper
  getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }
}
