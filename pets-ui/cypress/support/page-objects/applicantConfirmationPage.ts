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
    cy.get(".govuk-panel__title").should("be.visible").and("contain", "Applicant record created");
    return this;
  }

  // Verify what happens next text
  verifyNextStepsText(): ApplicantConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now add travel information for this applicant").should("be.visible");
    return this;
  }

  // Click continue button to proceed to travel information
  clickContinueToTravelInformation(): ApplicantConfirmationPage {
    cy.contains("button", "Continue to travel information")
      .should("be.visible")
      .and("be.enabled")
      .click();
    return this;
  }

  // Verify redirection to travel information page
  verifyRedirectionToTravelInformation(): ApplicantConfirmationPage {
    this.verifyUrlContains("/travel-details");
    return this;
  }

  // Verify breadcrumb navigation - using inherited method from BasePage
  verifyBreadcrumbNavigation(): ApplicantConfirmationPage {
    super.verifyBreadcrumbNavigation();
    return this;
  }

  // Verify service name - using inherited method from BasePage
  verifyServiceName(): ApplicantConfirmationPage {
    super.verifyServiceName();
    return this;
  }

  // Complete confirmation and proceed to travel information
  confirmAndProceed(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.clickContinueToTravelInformation();
    this.verifyRedirectionToTravelInformation();
    return this;
  }

  // Verify all elements on the page
  verifyAllPageElements(): ApplicantConfirmationPage {
    this.verifyPageLoaded();
    this.verifyNextStepsText();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
