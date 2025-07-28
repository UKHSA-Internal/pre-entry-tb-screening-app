import { BasePage } from "../BasePage";

//This holds all fields of the Medical Confirmation Page
export class MedicalConfirmationPage extends BasePage {
  constructor() {
    super("/medical-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): MedicalConfirmationPage {
    cy.url().should("include", "/medical-confirmation");
    cy.contains("h1", "Medical history and TB symptoms confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): MedicalConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "Medical history and TB symptoms confirmed").should("be.visible");
    return this;
  }

  // Verify the "What happens next" section
  verifyNextStepsSection(): MedicalConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  // Click the continue button
  clickContinueButton(): MedicalConfirmationPage {
    cy.contains("button", "Continue").should("be.visible").click();
    return this;
  }

  // Verify redirection after clicking continue
  verifyRedirectionAfterContinue(): MedicalConfirmationPage {
    cy.url().should("include", "/tracker");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): MedicalConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/medical-summary");
    return this;
  }

  // Verify page title
  verifyPageTitle(): MedicalConfirmationPage {
    cy.title().should("include", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): MedicalConfirmationPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Check all elements on confirmation page
  verifyAllConfirmationElements(): MedicalConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue").should("be.visible");
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Verify page layout structure
  verifyPageLayout(): MedicalConfirmationPage {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    return this;
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): MedicalConfirmationPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Complete confirmation and proceed to tracker
  confirmAndProceed(): MedicalConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsSection();
    this.clickContinueButton();
    this.verifyRedirectionAfterContinue();
    return this;
  }

  // Verify all elements on the page
  verifyAllPageElements(): MedicalConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsSection();
    this.verifyConfirmationPanel();
    this.verifyBackLinkNavigation();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // Comprehensive page validation
  verifyCompletePageStructure(): MedicalConfirmationPage {
    this.verifyPageLayout();
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    this.verifyContinueButtonStyling();
    this.verifyBackLinkNavigation();
    return this;
  }

  // Descriptive method for the full flow
  completeConfirmationFlow(): MedicalConfirmationPage {
    this.verifyAllPageElements();
    this.clickContinueButton();
    this.verifyRedirectionAfterContinue();
    return this;
  }
}
