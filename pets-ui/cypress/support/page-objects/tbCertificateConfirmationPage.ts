//This holds all fields for the TB Certificate Confirmation Page

import { BasePage } from "../BasePage";

export class TbCertificateConfirmationPage extends BasePage {
  constructor() {
    super("/tb-certificate-confirmation");
  }

  verifyPageLoaded(): TbCertificateConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title").should("be.visible").and("contain", "TB screening complete");
    return this;
  }

  // Verify confirmation panel is displayed with correct content
  verifyConfirmationPanel(): TbCertificateConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title")
      .should("be.visible")
      .and("contain", "TB screening complete")
      .and("contain", "Certificate issued");
    return this;
  }

  // Verify certificate reference number is displayed
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

  // Verify "View or print certificate" button
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

    return this;
  }

  // Verify feedback link
  verifyFeedbackLink(): TbCertificateConfirmationPage {
    cy.get('a[href*="forms.office.com"]')
      .should("be.visible")
      .and("contain", "What did you think of this service?");
    return this;
  }

  // Click navigation links
  clickViewSummaryLink(): TbCertificateConfirmationPage {
    cy.get('a[href="/tracker"]').click();
    return this;
  }

  clickFeedbackLink(): TbCertificateConfirmationPage {
    cy.get('a[href*="forms.office.com"]').click();
    return this;
  }

  // Verify back link navigation
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
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify grid layout structure
  verifyGridLayout(): TbCertificateConfirmationPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Get certificate reference number value
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

  // Get the current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after navigation
  checkRedirectionAfterAction(expectedUrlPath: string): TbCertificateConfirmationPage {
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Verify all content sections are present
  verifyAllContentSections(): TbCertificateConfirmationPage {
    this.verifyConfirmationPanel();
    this.verifyCertificateReferenceNumber();
    this.verifyCompletionMessage();
    this.verifyWhatHappensNextSection();
    this.verifyViewPrintCertificateButton();
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();
    return this;
  }

  // Complete page verification
  verifyCompletePage(expectedCertificateRef?: string): TbCertificateConfirmationPage {
    this.verifyPageLoaded();
    this.verifyGridLayout();
    this.verifyAllContentSections();

    if (expectedCertificateRef) {
      this.verifyCertificateReferenceNumber(expectedCertificateRef);
    } else {
      this.verifyCertificateReferenceNumberFormat();
    }

    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Verify all elements on the page
  verifyAllPageElements(): TbCertificateConfirmationPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyCertificateReferenceNumber();
    this.verifyCompletionMessage();
    this.verifyWhatHappensNextSection();
    this.verifyViewPrintCertificateButton();
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();
    this.verifyGridLayout();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Test all navigation options
  testAllNavigationOptions(): TbCertificateConfirmationPage {
    // Test view/print certificate button
    this.verifyViewPrintCertificateButton();

    // Test navigation links (but don't actually click to maintain test flow)
    this.verifyNavigationLinks();
    this.verifyFeedbackLink();

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

  checkRedirectionAfterFinish(expectedUrlPath: string): TbCertificateConfirmationPage {
    this.clickViewPrintCertificateButton();
    return this.checkRedirectionAfterAction(expectedUrlPath);
  }
}
