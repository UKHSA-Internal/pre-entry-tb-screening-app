// This holds all fields for the Radiological Outcome Confirmation Page
import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper, ConfirmationHelper } from "../helpers";

export class RadiologicalOutcomeConfPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private confirmation = new ConfirmationHelper();

  constructor() {
    super("/radiological-outcome-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): RadiologicalOutcomeConfPage {
    cy.get(".govuk-panel--confirmation", { timeout: 30000 }).should("be.visible");
    cy.contains("h1.govuk-panel__title", "Radiological outcome confirmed", {
      timeout: 30000,
    }).should("be.visible");
    return this;
  }

  // Verify confirmation panel
  verifyConfirmationPanel(): RadiologicalOutcomeConfPage {
    cy.get(".govuk-panel.confirmation-panel.govuk-panel--confirmation", { timeout: 30000 }).should(
      "be.visible",
    );
    cy.get(".govuk-panel__title.confirmation-panel__title", { timeout: 30000 })
      .should("be.visible")
      .should("contain", "Radiological outcome confirmed");
    return this;
  }

  // Verify "What happens next" section
  verifyWhatHappensNextSection(): RadiologicalOutcomeConfPage {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    cy.contains("p.govuk-body", "We have sent the radiological outcome to UKHSA.").should(
      "be.visible",
    );
    cy.contains("p.govuk-body", "You can now view summary for this visa applicant.").should(
      "be.visible",
    );
    return this;
  }

  // Verify continue button
  verifyContinueButton(): RadiologicalOutcomeConfPage {
    cy.get('button[type="submit"].govuk-button').should("be.visible").should("contain", "Continue");
    return this;
  }

  // Click continue button
  clickContinueButton(): RadiologicalOutcomeConfPage {
    cy.get('button[type="submit"].govuk-button').contains("Continue").click();
    return this;
  }

  // Verify "Search for another visa applicant" link
  verifySearchForAnotherVisaApplicantLink(): RadiologicalOutcomeConfPage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]')
      .should("be.visible")
      .should("contain", "Search for another visa applicant");
    return this;
  }

  // Click "Search for another visa applicant" link
  clickSearchForAnotherVisaApplicantLink(): RadiologicalOutcomeConfPage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]').click();
    return this;
  }

  // Click back link
  clickBackLink(): RadiologicalOutcomeConfPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify page title
  verifyPageTitle(): RadiologicalOutcomeConfPage {
    // Wait for page to fully load before checking title
    cy.get(".govuk-panel--confirmation", { timeout: 30000 }).should("be.visible");
    cy.get(".govuk-panel__title.confirmation-panel__title", { timeout: 30000 }).should(
      "be.visible",
    );
    // Use more flexible title check to handle CI environment variations
    cy.title({ timeout: 30000 }).should("include", "Radiological outcome confirmed");
    cy.title({ timeout: 30000 }).should("include", "GOV.UK");
    return this;
  }

  // Verify main content is visible
  verifyMainContent(): RadiologicalOutcomeConfPage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify grid layout
  verifyGridLayout(): RadiologicalOutcomeConfPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): RadiologicalOutcomeConfPage {
    cy.get("footer.govuk-footer").should("be.visible");
    cy.get('a.govuk-footer__link[href="/privacy-notice"]')
      .should("be.visible")
      .should("contain", "Privacy");
    cy.get('a.govuk-footer__link[href="/accessibility-statement"]')
      .should("be.visible")
      .should("contain", "Accessibility statement");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): RadiologicalOutcomeConfPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag")
      .should("be.visible")
      .should("contain", "BETA");
    cy.get(".govuk-phase-banner__text").should(
      "contain",
      "This is a new service. Help us improve it and",
    );
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): RadiologicalOutcomeConfPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyWhatHappensNextSection();
    this.verifyContinueButton();
    this.verifySearchForAnotherVisaApplicantLink();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Complete the confirmation flow
  completeConfirmationFlow(): RadiologicalOutcomeConfPage {
    this.verifyPageLoaded();
    this.clickContinueButton();
    return this;
  }

  // Navigate to search for another applicant
  navigateToSearchForAnotherApplicant(): RadiologicalOutcomeConfPage {
    this.verifyPageLoaded();
    this.clickSearchForAnotherVisaApplicantLink();
    return this;
  }

  // Verify confirmation message content
  verifyConfirmationMessageContent(): RadiologicalOutcomeConfPage {
    cy.contains("We have sent the radiological outcome to UKHSA.").should("be.visible");
    cy.contains("You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  // Verify URL
  verifyUrl(): RadiologicalOutcomeConfPage {
    cy.url().should("include", "/radiological-outcome-confirmed");
    return this;
  }
}
