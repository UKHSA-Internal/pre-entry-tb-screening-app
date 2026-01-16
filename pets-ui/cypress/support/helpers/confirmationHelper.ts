/**
 * ConfirmationHelper - Handles all confirmation page interactions
 * Provides methods for verifying confirmation panels, next steps, and redirection
 */
export class ConfirmationHelper {
  // Confirmation panel verification
  verifyConfirmationPanel(title: string): ConfirmationHelper {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title").should("be.visible").and("contain", title);
    return this;
  }

  verifyConfirmationPanelBody(bodyText: string): ConfirmationHelper {
    cy.get(".govuk-panel__body").should("be.visible").and("contain", bodyText);
    return this;
  }

  // Next steps section
  verifyNextStepsSection(expectedText?: string): ConfirmationHelper {
    cy.contains("h2", "What happens next").should("be.visible");

    if (expectedText) {
      cy.contains("p.govuk-body", expectedText).should("be.visible");
    } else {
      cy.get("p.govuk-body")
        .invoke("text")
        .should(
          "match",
          /You can now (view a summary for this visa applicant|return to the progress tracker)/,
        );
    }

    return this;
  }

  verifyNextStepsHeading(): ConfirmationHelper {
    cy.contains("h2", "What happens next").should("be.visible");
    return this;
  }

  // Redirection verification
  verifyRedirectionToTracker(): ConfirmationHelper {
    cy.url().should("include", "/tracker");
    return this;
  }

  verifyRedirectionToPath(path: string): ConfirmationHelper {
    cy.url().should("include", path);
    return this;
  }

  // Complete confirmation page structure verification
  verifyCompleteConfirmationPageStructure(title: string): ConfirmationHelper {
    this.verifyConfirmationPanel(title);
    this.verifyNextStepsSection();
    return this;
  }

  // Complete confirmation page flow
  confirmAndProceed(title?: string): ConfirmationHelper {
    if (title) {
      this.verifyConfirmationPanel(title);
    }
    this.verifyNextStepsSection();
    this.verifyRedirectionToTracker();
    return this;
  }

  // Verify confirmation page elements present
  verifyConfirmationPageLoaded(): ConfirmationHelper {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }
}
