//This holds all fields of the Sputum Confirmation Page
export class SputumConfirmationPage {
  visit(): void {
    cy.visit("/sputum-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    // Check if it's partial or complete confirmation
    cy.get("h1.govuk-panel__title").then(($title) => {
      const titleText = $title.text().trim();
      if (titleText.includes("Partial")) {
        cy.contains("h1", "Partial sputum sample information confirmed").should("be.visible");
      } else {
        cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
      }
    });
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Method specifically for partial confirmation
  verifyPartialConfirmationPageLoaded(): void {
    cy.contains("h1", "Partial sputum sample information confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Method specifically for complete confirmation
  verifyCompleteConfirmationPageLoaded(): void {
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");

    // Check for either partial or complete confirmation title
    cy.get("h1.govuk-panel__title").should(($title) => {
      const titleText = $title.text().trim();
      expect(titleText).to.satisfy((text: string) => {
        return (
          text.includes("Partial sputum sample information confirmed") ||
          text.includes("All sputum sample information confirmed")
        );
      });
    });
  }

  // Verify partial confirmation panel specifically
  verifyPartialConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "Partial sputum sample information confirmed").should("be.visible");
  }

  // Verify complete confirmation panel specifically
  verifyCompleteConfirmationPanel(): void {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
  }

  // Updated next steps section to handle different scenarios
  verifyNextStepsSection(): void {
    cy.contains("h2", "What happens next").should("be.visible");

    // Check for either scenario-specific text
    cy.get("p").then(($paragraphs) => {
      const allText = $paragraphs.text();
      const hasPartialText = allText.includes(
        "panel physician should wait to confirm the remaining sputum sample results",
      );
      const hasCompleteText = allText.includes("You can now return to the progress tracker");

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(hasPartialText || hasCompleteText).to.be.true;
    });
  }

  // Verify next steps for partial scenario
  verifyPartialNextStepsSection(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains(
      "p",
      "The panel physician should wait to confirm the remaining sputum sample results",
    ).should("be.visible");
  }

  // Verify next steps for complete scenario
  verifyCompleteNextStepsSection(): void {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker").should("be.visible");
  }

  // Click the continue button
  clickContinueButton(): void {
    cy.contains("button", "Continue").should("be.visible").click();
  }

  // Verify redirection after clicking continue
  verifyRedirectionAfterContinue(): void {
    cy.url().should("include", "/tracker");
  }

  // Check confirmation type and verify appropriate elements
  verifyConfirmationTypeAndElements(): void {
    cy.get("h1.govuk-panel__title").then(($title) => {
      const titleText = $title.text().trim();

      if (titleText.includes("Partial")) {
        this.verifyPartialConfirmationPanel();
        this.verifyPartialNextStepsSection();
      } else {
        this.verifyCompleteConfirmationPanel();
        this.verifyCompleteNextStepsSection();
      }
    });

    cy.contains("button", "Continue").should("be.visible");
    this.verifyServiceName();
  }

  // Back link verification
  verifyBackLinkNavigation(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/check-sputum-sample-information");
  }

  // Verify page title
  verifyPageTitle(): void {
    cy.title().should("include", "Complete UK pre-entry health screening");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
  }

  // Method to determine if this is partial or complete confirmation
  isPartialConfirmation(): Cypress.Chainable<boolean> {
    return cy.get("h1.govuk-panel__title").then(($title) => {
      const titleText = $title.text().trim();
      return titleText.includes("Partial");
    });
  }

  // Enhanced verification method that adapts to scenario type
  verifyAllConfirmationElements(): void {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue").should("be.visible");
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
  }
}
