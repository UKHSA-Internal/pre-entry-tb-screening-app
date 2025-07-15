//This holds all fields on the Applicant Confirmation Page
import { BasePage } from "../BasePage";

export class ApplicantConfirmationPage extends BasePage {
  constructor() {
    super("/applicant-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantConfirmationPage {
    // Wait for all the api calls to complete - intermittently slow have added a wait
    cy.wait(10000);
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Visa applicant details confirmed");
    return this;
  }

  // Verify what happens next text
  verifyNextStepsText(): ApplicantConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  // Click continue button
  clickContinue(): ApplicantConfirmationPage {
    cy.contains("button", "Continue").should("be.visible").and("be.enabled").click();
    return this;
  }

  // Verify redirection to progress tracker
  verifyRedirectionAfterContinue(): ApplicantConfirmationPage {
    // Based on the text "return to the progress tracker", should redirect to tracker
    cy.url().should("include", "/tracker");
    return this;
  }

  // Verify back link points to applicant summary - UPDATED based on DOM
  verifyBackLink(): ApplicantConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/applicant-summary")
      .and("contain", "Back");
    return this;
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): ApplicantConfirmationPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Verify service name - using inherited method from BasePage
  verifyServiceName(): ApplicantConfirmationPage {
    super.verifyServiceName();
    return this;
  }

  // UPDATED: Complete confirmation and proceed (flow may have changed)
  confirmAndProceed(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinue();
    this.verifyRedirectionAfterContinue();
    return this;
  }

  // Verify all elements on the page - UPDATED to include back link
  verifyAllPageElements(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.verifyBackLink();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // NEW: Verify the confirmation panel styling and content
  verifyConfirmationPanel(): ApplicantConfirmationPage {
    cy.get(".govuk-panel--confirmation")
      .should("be.visible")
      .and("have.css", "margin-bottom", "40px");

    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Visa applicant details confirmed")
      .and("have.css", "margin-block", "30px")
      .and("have.css", "margin-inline", "20px");

    return this;
  }

  // NEW: Verify page layout structure
  verifyPageLayout(): ApplicantConfirmationPage {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    return this;
  }

  // NEW: Verify the continue button styling
  verifyContinueButtonStyling(): ApplicantConfirmationPage {
    cy.contains("button", "Continue")
      .should("have.attr", "type", "submit")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button")
      .and("have.css", "margin-top", "30px");
    return this;
  }

  // NEW: Comprehensive page validation
  verifyCompletePageStructure(): ApplicantConfirmationPage {
    this.verifyPageLayout();
    this.verifyConfirmationPanel();
    this.verifyNextStepsText();
    this.verifyContinueButtonStyling();
    this.verifyBackLink();
    return this;
  }
}
