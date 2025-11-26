//This holds all fields on the Applicant Confirmation Page
import { BasePage } from "../BasePage";

export class ApplicantConfirmationPage extends BasePage {
  constructor() {
    super("/visa-applicant-details-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantConfirmationPage {
    // Wait for all the api calls to complete - intermittently slow have added a wait
    cy.get(".govuk-panel--confirmation", { timeout: 10000 }).should("be.visible");
    cy.get(".govuk-panel__title", { timeout: 10000 })
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

  // Verify back link points to applicant summary
  verifyBackLink(): ApplicantConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/visa-applicant-details-confirmed")
      .and("contain", "Back");
    return this;
  }

  // Verify breadcrumb navigation - not sure if Breadcrumbs will be re-implemented
  verifyBreadcrumbNavigation(): ApplicantConfirmationPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Verify service name - using inherited method from BasePage
  verifyServiceName(): ApplicantConfirmationPage {
    super.verifyServiceName();
    return this;
  }

  // Complete confirmation and proceed
  confirmAndProceed(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinue();
    this.verifyRedirectionAfterContinue();
    return this;
  }

  // Verify all elements on the page
  verifyAllPageElements(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.verifyBackLink();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // Verify the confirmation panel styling and content
  verifyConfirmationPanel(): ApplicantConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");

    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "Visa applicant details confirmed");
    return this;
  }

  // Verify page layout structure
  verifyPageLayout(): ApplicantConfirmationPage {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    return this;
  }

  // Comprehensive page validation
  verifyCompletePageStructure(): ApplicantConfirmationPage {
    this.verifyPageLayout();
    this.verifyConfirmationPanel();
    this.verifyNextStepsText();
    this.verifyContinueButtonStyling();
    this.verifyBackLink();
    return this;
  }
}
