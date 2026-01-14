// This holds all fields for the TB Screening Complete Page
import { BasePage } from "../BasePage";

export class TbScreeningCompletePage extends BasePage {
  constructor() {
    super("/tb-screening-complete");
  }

  // Verify page loaded - works for both issued and not issued scenarios
  verifyPageLoaded(): TbScreeningCompletePage {
    cy.url().should("include", "/tb-screening-complete");
    cy.contains("h1.govuk-panel__title", "TB screening complete").should("be.visible");
    return this;
  }

  // ============ Helper Methods for Scenario Detection ============

  // Helper method to check if we're in issued mode
  isIssuedMode(): Cypress.Chainable<boolean> {
    return cy.get("h1.govuk-panel__title").then(($h1) => {
      const heading = $h1.text();
      return heading.includes("Certificate available");
    });
  }

  // Helper method to check if we're in not issued mode
  isNotIssuedMode(): Cypress.Chainable<boolean> {
    return cy.get("h1.govuk-panel__title").then(($h1) => {
      const heading = $h1.text();
      return heading.includes("Certificate not issued");
    });
  }

  // ============ Scenario-Specific Verification Methods ============

  // Verify confirmation panel for ISSUED scenario
  verifyPanelForIssued(): TbScreeningCompletePage {
    cy.get(".govuk-panel.confirmation-panel.govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title.confirmation-panel__title").should(
      "contain",
      "Certificate available",
    );
    return this;
  }

  // Verify confirmation panel for NOT ISSUED scenario
  verifyPanelForNotIssued(): TbScreeningCompletePage {
    cy.get(
      ".govuk-panel.confirmation-panel.govuk-panel--warning.confirmation-panel--warning",
    ).should("be.visible");
    cy.get(".govuk-panel__title.confirmation-panel__title").should(
      "contain",
      "Certificate not issued",
    );
    return this;
  }

  // Verify confirmation panel - auto-detects scenario
  verifyPanel(): TbScreeningCompletePage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get(".govuk-panel.confirmation-panel.govuk-panel--confirmation").should("be.visible");
      } else {
        cy.get(
          ".govuk-panel.confirmation-panel.govuk-panel--warning.confirmation-panel--warning",
        ).should("be.visible");
      }
    });
    return this;
  }

  // Verify confirmation panel title - auto-detects scenario
  verifyPanelTitle(): TbScreeningCompletePage {
    cy.get(".govuk-panel__title.confirmation-panel__title")
      .should("be.visible")
      .should("contain", "TB screening complete");

    // The second line will be either "Certificate issued" or "Certificate not issued"
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get(".govuk-panel__title.confirmation-panel__title").should(
          "contain",
          "Certificate available",
        );
      } else {
        cy.get(".govuk-panel__title.confirmation-panel__title").should(
          "contain",
          "Certificate not issued",
        );
      }
    });
    return this;
  }

  // Verify confirmation panel body - only for ISSUED scenario
  verifyPanelBody(): TbScreeningCompletePage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get(".govuk-panel__body.confirmation-panel__body")
          .should("be.visible")
          .should("contain", "Your reference number");
      }
    });
    return this;
  }

  // Verify certificate reference number is displayed - only for ISSUED scenario
  verifyCertRefDisplayed(): TbScreeningCompletePage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get("strong.confirmation-panel__reference-number")
          .should("be.visible")
          .invoke("text")
          .should("not.be.empty");
      }
    });
    return this;
  }

  // Verify certificate reference number matches expected value
  verifyCertRef(expectedRef: string): TbScreeningCompletePage {
    cy.get("strong.confirmation-panel__reference-number")
      .should("be.visible")
      .should("contain", expectedRef);
    return this;
  }

  // Verify certificate reference number matches saved value from earlier in the flow
  verifySavedCertRef(aliasName: string = "certificateRefNumber"): TbScreeningCompletePage {
    cy.get(`@${aliasName}`).then((savedRefNumber) => {
      cy.get("strong.confirmation-panel__reference-number")
        .should("be.visible")
        .invoke("text")
        .then((displayedRef) => {
          expect(displayedRef.trim()).to.equal(savedRefNumber);
        });
    });
    return this;
  }
  // Click "Return to tracker" link from TB Cert Summary Page
  clickReturnToTracker(): TbScreeningCompletePage {
    cy.get('button[type="submit"].govuk-button')
      .should("be.visible")
      .and("contains.text", "Return to tracker")
      .click();
    return this;
  }
  // Get certificate reference number value
  getCertRef(): Cypress.Chainable<string> {
    return cy
      .get("strong.confirmation-panel__reference-number")
      .invoke("text")
      .then((text) => text.trim());
  }
  // Save certificate reference number for later use
  saveCertRef(aliasName: string = "certificateRefNumber"): TbScreeningCompletePage {
    cy.get("strong.confirmation-panel__reference-number")
      .invoke("text")
      .then((text) => text.trim())
      .as(aliasName);
    return this;
  }

  // Verify screening complete message
  verifyCompleteMessage(): TbScreeningCompletePage {
    cy.get("p.govuk-body")
      .contains("The visa applicant TB screening is complete")
      .should("be.visible");
    return this;
  }

  // Verify "What happens next" section
  verifyWhatHappensNext(): TbScreeningCompletePage {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    return this;
  }

  // Verify UKHSA notification message
  verifyUKHSAMessage(): TbScreeningCompletePage {
    cy.get("p.govuk-body")
      .contains("We have sent the certificate information to UKHSA")
      .should("be.visible");
    return this;
  }

  // Verify "View or print certificate" button - only for ISSUED scenario
  verifyViewCertButton(): TbScreeningCompletePage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get(".confirmation-action-button")
          .find('button[type="submit"].govuk-button')
          .should("be.visible")
          .should("contain", "View or print certificate");
      }
    });
    return this;
  }

  // Verify "View or print certificate" button does NOT exist - for NOT ISSUED scenario
  verifyViewCertButtonNotExists(): TbScreeningCompletePage {
    cy.contains("View or print certificate").should("not.exist");
    return this;
  }

  // Click "View or print certificate" button
  clickViewCertButton(): TbScreeningCompletePage {
    cy.get(".confirmation-action-button").find('button[type="submit"].govuk-button').click();
    return this;
  }
  // Click "Check or change certificate information" button
  clickCheckChangeButton(): TbScreeningCompletePage {
    cy.get(".confirmation-secondary-button")
      .find('button[type="submit"]')
      .should("be.visible")
      .should("contain", "Check or change certificate information")
      .click();
    return this;
  }

  // Verify "View a summary for this visa applicant" link
  verifySummaryLink(): TbScreeningCompletePage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/tracker"]')
      .should("be.visible")
      .should("contain", "View a summary for this visa applicant");
    return this;
  }

  // Click "View a summary for this visa applicant" link
  clickSummaryLink(): TbScreeningCompletePage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/tracker"]').click();
    return this;
  }

  // Verify "Search for another visa applicant" link
  verifySearchLink(): TbScreeningCompletePage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]')
      .should("be.visible")
      .should("contain", "Search for another visa applicant");
    return this;
  }

  // Click "Search for another visa applicant" link
  clickSearchLink(): TbScreeningCompletePage {
    cy.get('a.govuk-link.govuk-link--no-visited-state[href="/search-for-visa-applicant"]').click();
    return this;
  }

  // Verify feedback link
  verifyFeedbackLink(): TbScreeningCompletePage {
    cy.get("p.govuk-body")
      .find("a.govuk-link.govuk-link--no-visited-state")
      .contains("What did you think of this service?")
      .should("be.visible");
    return this;
  }

  // Click feedback link
  clickFeedbackLink(): TbScreeningCompletePage {
    cy.get("p.govuk-body")
      .find("a.govuk-link.govuk-link--no-visited-state")
      .contains("What did you think of this service?")
      .click();
    return this;
  }

  // Verify page title
  verifyPageTitle(): TbScreeningCompletePage {
    cy.title().should(
      "contain",
      "TB screening complete - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify main content is visible
  verifyMainContent(): TbScreeningCompletePage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify grid layout
  verifyGridLayout(): TbScreeningCompletePage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): TbScreeningCompletePage {
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
  verifyBetaBanner(): TbScreeningCompletePage {
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

  // Verify URL
  verifyUrl(): TbScreeningCompletePage {
    cy.url().should("include", "/tb-screening-complete");
    return this;
  }

  // Verify all confirmation panel elements - auto-detects scenario
  verifyAllPanelElements(): TbScreeningCompletePage {
    this.verifyPanel();
    this.verifyPanelTitle();

    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        this.verifyPanelBody();
        this.verifyCertRefDisplayed();
      }
    });
    return this;
  }

  // Verify all content sections
  verifyAllContent(): TbScreeningCompletePage {
    this.verifyCompleteMessage();
    this.verifyWhatHappensNext();
    this.verifyUKHSAMessage();
    return this;
  }

  // Verify all action buttons and links - this auto-detects scenario
  verifyAllActions(): TbScreeningCompletePage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        this.verifyViewCertButton();
      } else {
        this.verifyViewCertButtonNotExists();
      }
    });

    this.verifySummaryLink();
    this.verifySearchLink();
    this.verifyFeedbackLink();
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyAllPanelElements();
    this.verifyAllContent();
    this.verifyAllActions();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Verify all page elements with saved certificate reference validation
  verifyAllWithSavedRef(aliasName: string = "certificateRefNumber"): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyAllPanelElements();
    this.verifySavedCertRef(aliasName);
    this.verifyAllContent();
    this.verifyAllActions();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Navigate to view certificate
  goToViewCert(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.clickViewCertButton();
    return this;
  }

  // Navigate to view summary
  goToSummary(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.clickSummaryLink();
    return this;
  }

  // Navigate to search for another applicant
  goToSearch(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.clickSearchLink();
    return this;
  }

  // Complete the certification flow and verify reference number
  completeWithRefValidation(aliasName: string = "certificateRefNumber"): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyPanel();
    this.verifySavedCertRef(aliasName);
    this.verifyCompleteMessage();
    this.verifyUKHSAMessage();
    return this;
  }

  // Verify certificate reference matches value from another page
  verifyCertRefMatches(expectedRef: string): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyCertRef(expectedRef);
    return this;
  }

  // Log certificate reference number to console
  logCertRef(): TbScreeningCompletePage {
    this.getCertRef().then((refNumber) => {
      cy.log(`Certificate Reference Number: ${refNumber}`);
    });
    return this;
  }

  // ============ Scenario-Specific Comprehensive Verification Methods ============

  // Verify all page elements for CERTIFICATE ISSUED scenario
  verifyAllPageElementsForIssued(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyPanelForIssued();
    this.verifyPanelTitle();
    this.verifyPanelBody();
    this.verifyCertRefDisplayed();
    this.verifyAllContent();
    this.verifyViewCertButton();
    this.verifySummaryLink();
    this.verifySearchLink();
    this.verifyFeedbackLink();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Verify all page elements for CERTIFICATE NOT ISSUED scenario
  verifyAllPageElementsForNotIssued(): TbScreeningCompletePage {
    this.verifyPageLoaded();
    this.verifyPanelForNotIssued();
    this.verifyPanelTitle();
    this.verifyCompleteMessage();
    this.verifyWhatHappensNext();
    this.verifyUKHSAMessage();
    this.verifyViewCertButtonNotExists();
    this.verifySummaryLink();
    this.verifySearchLink();
    this.verifyFeedbackLink();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Verify confirmation panel with correct styling for NOT ISSUED
  verifyWarningPanelStyling(): TbScreeningCompletePage {
    cy.get(".govuk-panel--warning").should("be.visible");
    cy.get(".confirmation-panel--warning").should("be.visible");
    return this;
  }

  // Verify confirmation panel title for NOT ISSUED specifically
  verifyConfirmationPanelNotIssued(): TbScreeningCompletePage {
    cy.get(".govuk-panel__title.confirmation-panel__title")
      .should("be.visible")
      .should("contain", "TB screening complete")
      .should("contain", "Certificate not issued");
    return this;
  }

  // Verify confirmation panel title for ISSUED specifically
  verifyConfirmationPanelIssued(): TbScreeningCompletePage {
    cy.get(".govuk-panel__title.confirmation-panel__title")
      .should("be.visible")
      .should("contain", "TB screening complete")
      .should("contain", "Certificate issued");
    return this;
  }
}
