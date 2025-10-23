//This holds all fields of the Sputum Confirmation Page
import { BasePage } from "../BasePage";

export class SputumConfirmationPage extends BasePage {
  constructor() {
    super("/sputum-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): SputumConfirmationPage {
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
    return this;
  }

  // Method specifically for partial confirmation
  verifyPartialConfirmationPageLoaded(): SputumConfirmationPage {
    cy.contains("h1", "Partial sputum sample information confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Method specifically for complete confirmation
  verifyCompleteConfirmationPageLoaded(): SputumConfirmationPage {
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): SputumConfirmationPage {
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
    return this;
  }

  // Verify partial confirmation panel specifically
  verifyPartialConfirmationPanel(): SputumConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "Partial sputum sample information confirmed").should("be.visible");
    return this;
  }

  // Verify complete confirmation panel specifically
  verifyCompleteConfirmationPanel(): SputumConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "All sputum sample information confirmed").should("be.visible");
    return this;
  }

  // Updated next steps section to handle different scenarios
  verifyNextStepsSection(): SputumConfirmationPage {
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
    return this;
  }

  // Verify next steps for partial scenario
  verifyPartialNextStepsSection(): SputumConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains(
      "p",
      "The panel physician should wait to confirm the remaining sputum sample results",
    ).should("be.visible");
    return this;
  }

  // Verify next steps for complete scenario
  verifyCompleteNextStepsSection(): SputumConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker").should("be.visible");
    return this;
  }

  // Click the continue button
  clickContinueButton(): SputumConfirmationPage {
    cy.contains("button", "Continue").should("be.visible").click();
    return this;
  }

  // Verify redirection after clicking continue
  verifyRedirectionAfterContinue(): SputumConfirmationPage {
    cy.url().should("include", "/tracker");
    return this;
  }

  // Check confirmation type and verify appropriate elements
  verifyConfirmationTypeAndElements(): SputumConfirmationPage {
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
    return this;
  }

  // Verify page title
  verifyPageTitle(): SputumConfirmationPage {
    cy.title().should("include", "Complete UK pre-entry health screening");
    return this;
  }

  // Method to determine if this is partial or complete confirmation
  isPartialConfirmation(): Cypress.Chainable<boolean> {
    return cy.get("h1.govuk-panel__title").then(($title) => {
      const titleText = $title.text().trim();
      return titleText.includes("Partial");
    });
  }

  // Enhanced verification method that adapts to scenario type
  verifyAllConfirmationElements(): SputumConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue").should("be.visible");
    this.verifyBackLink("/check-sputum-sample-information");
    this.verifyServiceName();
    return this;
  }
}
