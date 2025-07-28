//This holds all fields for the TB Certificate Confirmation Page

import { BasePage } from "../BasePage";

export class TbCertificateConfirmationPage extends BasePage {
  constructor() {
    super("/tb-certificate-confirmation");
  }

  verifyPageLoaded(): TbCertificateConfirmationPage {
    cy.url().should("include", "/tb-certificate-confirmation");
    cy.get(".govuk-panel").should("be.visible");
    return this;
  }

  // Verify confirmation panel is displayed with correct content (Certificate ISSUED)
  verifyConfirmationPanel(): TbCertificateConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "TB screening complete")
      .and("contain", "Certificate issued");
    return this;
  }

  // Verify confirmation panel for Certificate NOT ISSUED
  verifyConfirmationPanelNotIssued(): TbCertificateConfirmationPage {
    cy.get(".govuk-panel--warning").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "TB screening complete")
      .and("contain", "Certificate not issued");
    return this;
  }

  // Verify warning panel styling for not issued
  verifyWarningPanelStyling(): TbCertificateConfirmationPage {
    cy.get(".confirmation-panel--warning").should("be.visible");
    cy.get(".govuk-panel--warning").should("have.class", "confirmation-panel--warning");
    return this;
  }

  // Verify certificate reference number is displayed (only for issued certificates)
  verifyCertificateReferenceNumber(expectedRefNumber?: string): TbCertificateConfirmationPage {
    cy.get(".govuk-panel__body")
      .should("be.visible")
      .and("contain", "Certificate reference number");

    if (expectedRefNumber) {
      cy.get(".govuk-panel__body strong").should("be.visible").and("contain", expectedRefNumber);
    } else {
      // Verify that a reference number is present
      cy.get(".govuk-panel__body strong").should("be.visible");
    }
    return this;
  }

  // Verify completion message
  verifyCompletionMessage(): TbCertificateConfirmationPage {
    cy.contains("p", "The visa applicant TB screening is complete.").should("be.visible");
    return this;
  }

  // Verify "What happens next" section
  verifyWhatHappensNextSection(): TbCertificateConfirmationPage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "We've sent the certificate information to UKHSA.").should("be.visible");
    return this;
  }

  // Verify "View or print certificate" button (only for issued certificates)
  verifyViewPrintCertificateButton(): TbCertificateConfirmationPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "View or print certificate");
    return this;
  }

  // Click "View or print certificate" button
  clickViewPrintCertificateButton(): TbCertificateConfirmationPage {
    cy.get('button[type="submit"]')
      .contains("View or print certificate")
      .should("be.visible")
      .click();
    return this;
  }

  // Verify navigation links section
  verifyNavigationLinks(): TbCertificateConfirmationPage {
    // Verify "View a summary for this visa applicant" link
    cy.get('a[href="/tracker"]')
      .should("be.visible")
      .and("contain", "View a summary for this visa applicant");

    // Verify "Search for another visa applicant" link
    cy.contains(".govuk-link", "Search for another visa applicant")
      .should("be.visible")
      .and("have.attr", "href", "/applicant-search");

    return this;
  }

  // Verify feedback link
  verifyFeedbackLink(): TbCertificateConfirmationPage {
    cy.get('a[href*="forms.office.com"]')
      .should("be.visible")
      .and("contain", "What did you think of this service?");

    cy.contains("(takes 30 seconds)").should("be.visible");
    return this;
  }

  // Click navigation links
  clickViewSummaryLink(): TbCertificateConfirmationPage {
    cy.get('a[href="/tracker"]').click();
    return this;
  }

  clickSearchForAnotherApplicantLink(): TbCertificateConfirmationPage {
    cy.contains(".govuk-link", "Search for another visa applicant").click();
    return this;
  }

  clickFeedbackLink(): TbCertificateConfirmationPage {
    cy.get('a[href*="forms.office.com"]').click();
    return this;
  }

  // Verify back link navigation - context sensitive
  verifyBackLinkNavigation(): TbCertificateConfirmationPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tb-certificate-summary");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateConfirmationPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify grid layout structure
  verifyGridLayout(): TbCertificateConfirmationPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Get certificate reference number value (only for issued certificates)
  getCertificateReferenceNumber(): Cypress.Chainable<string> {
    return cy
      .get(".govuk-panel__body strong")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify certificate reference number format
  verifyCertificateReferenceNumberFormat(): TbCertificateConfirmationPage {
    cy.get(".govuk-panel__body strong")
      .invoke("text")
      .then((text) => text.trim())
      .should("match", /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    return this;
  }

  // Verification for Certificate ISSUED scenario
  verifyCompleteIssuedPage(expectedCertificateRef?: string): TbCertificateConfirmationPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyCertificateReferenceNumber(expectedCertificateRef);
    this.verifyCompletionMessage();
    this.verifyWhatHappensNextSection();
    this.verifyViewPrintCertificateButton();
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();
    this.verifyGridLayout();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    if (expectedCertificateRef) {
      this.verifyCertificateReferenceNumber(expectedCertificateRef);
    } else {
      this.verifyCertificateReferenceNumberFormat();
    }

    return this;
  }

  // Vserification for Certificate NOT ISSUED scenarios
  verifyCompleteNotIsuedPage(): TbCertificateConfirmationPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanelNotIssued();
    this.verifyWarningPanelStyling();
    this.verifyCompletionMessage();
    this.verifyWhatHappensNextSection();
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();
    this.verifyGridLayout();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Context-sensitive verification that automatically detects the scenario
  verifyAllPageElements(): TbCertificateConfirmationPage {
    this.verifyPageLoaded();
    this.verifyCompletionMessage();
    this.verifyWhatHappensNextSection();
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();
    this.verifyGridLayout();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    // Detect which scenario we're in and verify accordingly
    cy.get("body").then(($body) => {
      if ($body.find(".govuk-panel--confirmation").length > 0) {
        // Certificate issued scenario
        this.verifyConfirmationPanel();
        this.verifyCertificateReferenceNumber();
        this.verifyViewPrintCertificateButton();
      } else if ($body.find(".govuk-panel--warning").length > 0) {
        // Certificate not issued scenario
        this.verifyConfirmationPanelNotIssued();
        this.verifyWarningPanelStyling();
      }
    });

    return this;
  }

  // Navigate to tracker via summary link
  navigateToTracker(): TbCertificateConfirmationPage {
    this.clickViewSummaryLink();
    cy.url().should("include", "/tracker");
    return this;
  }

  // Navigate to applicant search
  navigateToApplicantSearch(): TbCertificateConfirmationPage {
    this.clickSearchForAnotherApplicantLink();
    cy.url().should("include", "/applicant-search");
    return this;
  }

  // Test all navigation options
  testAllNavigationOptions(): TbCertificateConfirmationPage {
    // Test view summary link (but don't actually click to maintain test flow)
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();

    // For issued certificates, test view/print certificate button
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("View or print certificate")').length > 0) {
        this.verifyViewPrintCertificateButton();
      }
    });

    return this;
  }

  // Method names for backward compatibility
  verifyConfirmationMessage(): TbCertificateConfirmationPage {
    return this.verifyCompletionMessage();
  }

  clickFinishButton(): TbCertificateConfirmationPage {
    return this.clickViewPrintCertificateButton();
  }

  verifyFinishButton(): TbCertificateConfirmationPage {
    return this.verifyViewPrintCertificateButton();
  }

  // Complete confirmation and navigate to tracker
  completeConfirmationAndGoToTracker(): TbCertificateConfirmationPage {
    this.verifyAllPageElements();
    this.navigateToTracker();
    return this;
  }
}
