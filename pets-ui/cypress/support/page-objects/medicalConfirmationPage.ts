//This holds all fields of the Medical Confirmation Page

import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper, ConfirmationHelper } from "../helpers";

export class MedicalConfirmationPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private confirmation = new ConfirmationHelper();

  constructor() {
    super("/tb-symptoms-medical-history-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): MedicalConfirmationPage {
    cy.url().should("include", "/tb-symptoms-medical-history-confirmed");
    cy.contains("h1", "TB symptoms and medical history confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Verify confirmation panel is displayed
  verifyConfirmationPanel(): MedicalConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1", "TB symptoms and medical history confirmed").should("be.visible");
    return this;
  }

  // Verify the "What happens next" section
  verifyNextStepsSection(): MedicalConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now view a summary for this visa applicant.").should("be.visible");
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
      .and("have.attr", "href", "/check-medical-screening");
    return this;
  }

  // Click back link
  clickBackLink(): MedicalConfirmationPage {
    cy.get(".govuk-back-link").should("be.visible").click();
    return this;
  }

  // Verify page title
  verifyPageTitle(): MedicalConfirmationPage {
    cy.title().should(
      "include",
      "Medical history and TB symptoms confirmed - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify service name in header
  verifyServiceName(): MedicalConfirmationPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify sign out link in header
  verifySignOutLink(): MedicalConfirmationPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Verify "Search for another visa applicant" link
  verifySearchForAnotherApplicantLink(): MedicalConfirmationPage {
    cy.get(".govuk-link--no-visited-state")
      .contains("Search for another visa applicant")
      .should("be.visible")
      .and("have.attr", "href", "/search-for-visa-applicant");
    return this;
  }

  // Click "Search for another visa applicant" link
  clickSearchForAnotherApplicant(): MedicalConfirmationPage {
    cy.get(".govuk-link--no-visited-state")
      .contains("Search for another visa applicant")
      .should("be.visible")
      .click();
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): MedicalConfirmationPage {
    cy.get(".govuk-phase-banner").should("exist");
    cy.get(".govuk-tag").contains("BETA").should("be.visible");
    cy.contains("This is a new service. Help us improve it and").should("be.visible");
    return this;
  }

  // Verify feedback link in beta banner
  verifyFeedbackLink(): MedicalConfirmationPage {
    cy.get('.govuk-phase-banner a[target="_blank"]')
      .contains("give your feedback")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "forms.office.com");
    return this;
  }

  // Verify continue button styling
  verifyContinueButtonStyling(): MedicalConfirmationPage {
    cy.contains("button", "Continue")
      .should("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button")
      .and("have.css", "margin-top", "30px");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): MedicalConfirmationPage {
    cy.get(".govuk-footer").should("exist");
    cy.get('.govuk-footer__link[href="/privacy-notice"]').contains("Privacy").should("be.visible");
    cy.get('.govuk-footer__link[href="/accessibility-statement"]')
      .contains("Accessibility statement")
      .should("be.visible");
    return this;
  }

  // Check all elements on confirmation page
  verifyAllConfirmationElements(): MedicalConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    cy.contains("button", "Continue").should("be.visible");
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    this.verifySearchForAnotherApplicantLink();
    return this;
  }

  // Verify page layout structure
  verifyPageLayout(): MedicalConfirmationPage {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    cy.get(".govuk-width-container").should("exist");
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
    this.verifyBetaBanner();
    this.verifyNextStepsSection();
    this.verifyConfirmationPanel();
    this.verifyBackLinkNavigation();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    this.verifySignOutLink();
    this.verifySearchForAnotherApplicantLink();
    this.verifyFooterLinks();
    return this;
  }

  // Comprehensive page validation
  verifyCompletePageStructure(): MedicalConfirmationPage {
    this.verifyPageLayout();
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    this.verifyContinueButtonStyling();
    this.verifyBackLinkNavigation();
    this.verifySearchForAnotherApplicantLink();
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
