import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper } from "../helpers";

//This holds all fields on the Travel Confirmation Page
export class TravelConfirmationPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/travel-information-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): TravelConfirmationPage {
    cy.url().should("include", "/travel-information-confirmed");
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

  // Submit Form
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

  // Verify back link points to check travel information
  verifyBackLink(): TravelConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/check-travel-information")
      .and("contain", "Back");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TravelConfirmationPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
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

  // Verify search for another visa applicant link
  verifySearchForAnotherApplicantLink(): TravelConfirmationPage {
    cy.get('a[href="/search-for-visa-applicant"]')
      .should("be.visible")
      .and("contain", "Search for another visa applicant");
    return this;
  }

  // Click search for another visa applicant link
  clickSearchForAnotherApplicant(): TravelConfirmationPage {
    cy.get('a[href="/search-for-visa-applicant"]').click();
    return this;
  }

  // Verify redirection to search page
  verifyRedirectionToSearchPage(): TravelConfirmationPage {
    cy.url().should("include", "/search-for-visa-applicant");
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
    this.verifySearchForAnotherApplicantLink();
    this.verifyBackLink();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // Comprehensive page validation
  verifyCompletePageStructure(): TravelConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyNextStepsText();
    this.verifySearchForAnotherApplicantLink();
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
