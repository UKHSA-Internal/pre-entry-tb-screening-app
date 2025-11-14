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

  // Updated methods for TbCertificateConfirmationPage to handle iframe certificate display

  // Method to test certificate button that loads content in same page/iframe
  testCertificateIframeDisplay(): TbCertificateConfirmationPage {
    // Verify button exists before clicking
    this.verifyViewPrintCertificateButton();

    // Click the "View or print certificate" button
    this.clickViewPrintCertificateButton();

    // Wait for iframe content to load
    cy.wait(2000);

    // Check if an iframe appeared or content changed
    cy.get("body").then(($body) => {
      // Look for iframe containing certificate
      const iframes = $body.find("iframe");
      if (iframes.length > 0) {
        cy.log("Certificate iframe detected");
        this.verifyCertificateIframeLoaded();
      } else {
        // Check if URL changed but we're still on same domain
        cy.url().then((url) => {
          if (url.includes("certificate") || url.includes("print")) {
            cy.log("Certificate page loaded in same window");
            this.verifyCertificatePage();
          } else {
            cy.log("Button clicked - checking for other content changes");
          }
        });
      }
    });

    return this;
  }

  // Method to verify certificate iframe is loaded and functional
  verifyCertificateIframeLoaded(): TbCertificateConfirmationPage {
    // Check for iframe with blob URL (as seen in the DOM)
    cy.get('iframe[src*="blob:"]', { timeout: 10000 })
      .should("be.visible")
      .should("have.attr", "src")
      .and("match", /^blob:/);

    // Verify iframe container
    cy.get('div[style*="width: 1100px"]')
      .should("be.visible")
      .should("have.css", "width", "1100px")
      .should("have.css", "height", "770px");

    // Verify print link is present
    cy.get("a.print-trigger").should("be.visible").should("contain", "Print the certificate");

    cy.log("Certificate iframe loaded successfully");

    return this;
  }

  // Method to verify we're on a certificate page (if navigation occurred)
  verifyCertificatePage(): TbCertificateConfirmationPage {
    // Check for certificate page elements
    cy.get("h1").should("contain", "TB clearance certificate");

    // Look for certificate content or print functionality
    cy.get("body").should("contain", "certificate");

    cy.log("Certificate page verified");

    return this;
  }
  // Method to test the print functionality within iframe
  testPrintFunctionalityInIframe(): TbCertificateConfirmationPage {
    // After iframe is loaded, test the print link
    this.verifyCertificateIframeLoaded();

    // Click the print link if it exists
    cy.get("a.print-trigger").then(($printLink) => {
      if ($printLink.length > 0) {
        // Test print link (may trigger browser print dialog)
        cy.wrap($printLink).click();
        cy.log("Print link clicked");

        // Wait for any print dialog or action
        cy.wait(1000);

        // Verify we're still on the same page
        cy.get('iframe[src*="blob:"]').should("be.visible");
      }
    });

    return this;
  }

  // Comprehensive test for certificate display and print functionality
  testCompleteCertificateFlow(): TbCertificateConfirmationPage {
    // Start on confirmation page
    cy.url().should("include", "/tb-certificate-confirmation");
    this.verifyViewPrintCertificateButton();

    // Click to view certificate
    this.testCertificateIframeDisplay();

    // If iframe loaded, test print functionality
    cy.get("body").then(($body) => {
      if ($body.find('iframe[src*="blob:"]').length > 0) {
        this.testPrintFunctionalityInIframe();

        // Verify back navigation if back link exists
        cy.get(".govuk-back-link").then(($backLink) => {
          if ($backLink.length > 0) {
            cy.wrap($backLink).should("contain", "Back").click();
            cy.url().should("include", "/tb-certificate-confirmation");
            cy.log("Successfully navigated back to confirmation page");
          }
        });
      }
    });

    return this;
  }
}
