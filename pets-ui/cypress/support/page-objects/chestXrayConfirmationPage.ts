//This holds all fields of the Chest X-ray Confirmation Page
import { BasePage } from "../BasePage";

export class ChestXrayConfirmationPage extends BasePage {
  constructor() {
    super("/chest-xray-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayConfirmationPage {
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Verify confirmation panel
  verifyConfirmationPanel(): ChestXrayConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed").should("be.visible");
    return this;
  }

  // Verify next steps section
  verifyNextStepsSection(): ChestXrayConfirmationPage {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    cy.contains("p.govuk-body", "You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  // Click continue button
  clickContinueButton(): ChestXrayConfirmationPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): ChestXrayConfirmationPage {
    this.clickContinueButton();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayConfirmationPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    this.verifyBackLink("/chest-xray-summary");
    this.verifyServiceName();
    return this;
  }
}
