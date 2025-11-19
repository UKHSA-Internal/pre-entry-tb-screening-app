// This holds all fields for the Sputum Decision Confirmation Page
import { BasePage } from "../BasePage";

export class SputumDecisionConfirmationPage extends BasePage {
  constructor() {
    super("/sputum-decision-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): SputumDecisionConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1.govuk-panel__title", "Sputum decision confirmed").should("be.visible");
    return this;
  }

  // Verify confirmation panel
  verifyConfirmationPanel(): SputumDecisionConfirmationPage {
    cy.get(".govuk-panel.confirmation-panel.govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title.confirmation-panel__title")
      .should("be.visible")
      .should("contain", "Sputum decision confirmed");
    return this;
  }

  // Verify "What happens next" section
  verifyWhatHappensNextSection(): SputumDecisionConfirmationPage {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    cy.contains("p.govuk-body", "We have sent the sputum decision to UKHSA.").should("be.visible");
    cy.contains("p.govuk-body", "You can now view a summary for this visa applicant.").should(
      "be.visible",
    );
    return this;
  }

  // Verify confirmation message about sending to UKHSA
  verifyConfirmationMessage(): SputumDecisionConfirmationPage {
    cy.contains("We have sent the sputum decision to UKHSA.").should("be.visible");
    return this;
  }

  // Verify summary message
  verifySummaryMessage(): SputumDecisionConfirmationPage {
    cy.contains("You can now view a summary for this visa applicant.").should("be.visible");
    return this;
  }

  // Verify continue button
  verifyContinueButton(): SputumDecisionConfirmationPage {
    cy.get('button[type="submit"].govuk-button').should("be.visible").should("contain", "Continue");
    return this;
  }

  // Click continue button
  clickContinueButton(): SputumDecisionConfirmationPage {
    cy.get('button[type="submit"].govuk-button').contains("Continue").click();
    return this;
  }

  // Click continue button and verify navigation to tracker
  clickContinueButtonAndVerifyNavigation(): SputumDecisionConfirmationPage {
    cy.get('button[type="submit"].govuk-button').contains("Continue").click();
    cy.url().should("include", "/tracker");
    return this;
  }

  // Verify "Search for another visa applicant" link
  verifySearchForAnotherVisaApplicantLink(): SputumDecisionConfirmationPage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]')
      .should("be.visible")
      .should("contain", "Search for another visa applicant");
    return this;
  }

  // Click "Search for another visa applicant" link
  clickSearchForAnotherVisaApplicantLink(): SputumDecisionConfirmationPage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]').click();
    return this;
  }

  // Verify page title
  verifyPageTitle(): SputumDecisionConfirmationPage {
    cy.title().should(
      "contain",
      "Sputum decision confirmed - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify main content is visible
  verifyMainContent(): SputumDecisionConfirmationPage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify grid layout
  verifyGridLayout(): SputumDecisionConfirmationPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): SputumDecisionConfirmationPage {
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
  verifyBetaBanner(): SputumDecisionConfirmationPage {
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
  verifyAllPageElements(): SputumDecisionConfirmationPage {
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
  completeConfirmationFlow(): SputumDecisionConfirmationPage {
    this.verifyPageLoaded();
    this.clickContinueButton();
    return this;
  }

  // Complete the confirmation flow with navigation verification
  completeConfirmationFlowWithVerification(): SputumDecisionConfirmationPage {
    this.verifyPageLoaded();
    this.clickContinueButtonAndVerifyNavigation();
    return this;
  }

  // Navigate to search for another applicant
  navigateToSearchForAnotherApplicant(): SputumDecisionConfirmationPage {
    this.verifyPageLoaded();
    this.clickSearchForAnotherVisaApplicantLink();
    return this;
  }

  // Verify confirmation message content
  verifyConfirmationMessageContent(): SputumDecisionConfirmationPage {
    cy.contains("We have sent the sputum decision to UKHSA.").should("be.visible");
    cy.contains("You can now view a summary for this visa applicant.").should("be.visible");
    return this;
  }

  // Verify URL
  verifyUrl(): SputumDecisionConfirmationPage {
    cy.url().should("include", "/sputum-decision-confirmed");
    return this;
  }

  // Verify heading structure
  verifyHeadingStructure(): SputumDecisionConfirmationPage {
    cy.get("h1.govuk-panel__title").should("have.length", 1);
    cy.get("h2.govuk-heading-m").should("be.visible");
    return this;
  }

  // Verify button attributes
  verifyButtonAttributes(): SputumDecisionConfirmationPage {
    cy.get('button[type="submit"].govuk-button')
      .should("have.attr", "data-module", "govuk-button")
      .should("have.css", "margin-top", "30px");
    return this;
  }

  // Verify complete page state
  verifyCompletePageState(): SputumDecisionConfirmationPage {
    this.verifyAllPageElements();
    this.verifyConfirmationMessageContent();
    this.verifyHeadingStructure();
    this.verifyButtonAttributes();
    return this;
  }

  // Verify panel styling
  verifyPanelStyling(): SputumDecisionConfirmationPage {
    cy.get(".govuk-panel.govuk-panel--confirmation")
      .should("have.class", "confirmation-panel")
      .should("be.visible");
    return this;
  }

  // Verify links structure
  verifyLinksStructure(): SputumDecisionConfirmationPage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]')
      .should("be.visible")
      .should("have.attr", "href");
    return this;
  }

  // Verify accessibility attributes
  verifyAccessibilityAttributes(): SputumDecisionConfirmationPage {
    cy.get("main#main-content")
      .should("have.attr", "role", "main")
      .should("have.attr", "tabindex", "-1");
    return this;
  }
}
