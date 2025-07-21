import { BasePage } from "../BasePage";

//This holds all fields on the Travel Confirmation Page
export class TravelConfirmationPage extends BasePage {
  constructor() {
    super("/travel-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): TravelConfirmationPage {
    cy.url().should("include", "/travel-confirmation");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Travel information confirmed");
    return this;
  }

  // Verify what happens next text
  verifyNextStepsText(): TravelConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  // Submit Form - button text changed
  submitForm(): TravelConfirmationPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Click continue button
  clickContinue(): TravelConfirmationPage {
    cy.contains("button", "Continue").should("be.visible").and("be.enabled").click();
    return this;
  }

  // Verify redirection to progress tracker
  verifyRedirectionToProgressTracker(): TravelConfirmationPage {
    cy.url().should("include", "/tracker");
    return this;
  }

  // Verify back link points to travel summary
  verifyBackLink(): TravelConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/travel-summary")
      .and("contain", "Back");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TravelConfirmationPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify confirmation panel styling and content
  verifyConfirmationPanel(): TravelConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Travel information confirmed");
    return this;
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): TravelConfirmationPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Complete confirmation and proceed to tracker
  confirmAndProceed(): TravelConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinue();
    this.verifyRedirectionToProgressTracker();
    return this;
  }

  // Verify all elements on the page
  verifyAllPageElements(): TravelConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.verifyConfirmationPanel();
    this.verifyBackLink();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // Comprehensive page validation
  verifyCompletePageStructure(): TravelConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyNextStepsText();
    this.verifyContinueButtonStyling();
    this.verifyBackLink();
    return this;
  }

  // Descriptive method for the full Page flow
  completeConfirmationFlow(): TravelConfirmationPage {
    this.verifyAllPageElements();
    this.clickContinue();
    this.verifyRedirectionToProgressTracker();
    return this;
  }
}
