//This holds all fields for the TB Certificate Print Page

import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper } from "../helpers";

export class TbCertificatePrintPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/tb-certificate-print");
  }

  verifyPageLoaded(): TbCertificatePrintPage {
    cy.url().should("include", "/tb-certificate-print");
    cy.get("h1").should("contain", "TB clearance certificate");
    return this;
  }

  // Verify the print certificate link/button is visible
  verifyPrintCertificateLink(): TbCertificatePrintPage {
    cy.get("a.print-trigger").should("be.visible").and("contain", "Print the certificate");

    cy.get('a.print-trigger img[alt="Print Certificate"]').should("be.visible");

    return this;
  }

  // Click the print certificate link
  clickPrintCertificate(): TbCertificatePrintPage {
    cy.get("a.print-trigger").click();
    return this;
  }

  // Verify the certificate iframe is displayed
  verifyCertificateIframeDisplayed(): TbCertificatePrintPage {
    cy.get('iframe[src*="blob:"]')
      .should("be.visible")
      .and("have.css", "width", "100%")
      .and("have.css", "height", "100%");
    return this;
  }

  // Verify the iframe container dimensions
  verifyIframeContainer(): TbCertificatePrintPage {
    cy.get('div[style*="width: 1100px"]')
      .should("be.visible")
      .and("have.css", "width", "1100px")
      .and("have.css", "height", "770px");
    return this;
  }

  // Verify certificate content within iframe (limited verification due to blob URL)
  verifyCertificateContent(): TbCertificatePrintPage {
    // Since the iframe contains a blob URL, we can only verify its presence
    // The actual certificate content verification would need to be done differently
    // in a real implementation, possibly by checking the blob content or using
    // a different approach for certificate generation

    cy.get('iframe[src*="blob:"]').should("exist");

    // Verify iframe source contains expected parameters
    cy.get('iframe[src*="#toolbar=0"]').should("exist");

    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): TbCertificatePrintPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tb-certificate-confirmation");
    return this;
  }

  // Click back link to return to confirmation page
  clickBackLink(): TbCertificatePrintPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificatePrintPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify page structure and layout
  verifyPageStructure(): TbCertificatePrintPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-full").should("be.visible");
    cy.get(".govuk-main-wrapper").should("be.visible");
    return this;
  }

  // Verify print functionality (simulated)
  verifyPrintFunctionality(): TbCertificatePrintPage {
    // For now, we verify the print trigger elements are present
    this.verifyPrintCertificateLink();
    this.verifyCertificateIframeDisplayed();

    return this;
  }

  // Verify certificate data is displayed (what we can verify from the DOM structure)
  verifyCertificateStructure(): TbCertificatePrintPage {
    // Since the certificate is in an iframe with blob URL,
    // we can verify the iframe structure but not the content directly
    this.verifyIframeContainer();
    this.verifyCertificateIframeDisplayed();
    return this;
  }

  // Complete verification of all page elements
  verifyAllPageElements(): TbCertificatePrintPage {
    this.verifyPageLoaded();
    this.verifyPageStructure();
    this.verifyPrintCertificateLink();
    this.verifyCertificateIframeDisplayed();
    this.verifyIframeContainer();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Test print workflow
  testPrintWorkflow(): TbCertificatePrintPage {
    this.verifyAllPageElements();
    this.verifyPrintFunctionality();
    return this;
  }

  // Navigate back to confirmation page
  navigateBackToConfirmation(): TbCertificatePrintPage {
    this.clickBackLink();
    cy.url().should("include", "/tb-certificate-confirmation");
    return this;
  }

  // Wait for certificate to load (if needed)
  waitForCertificateLoad(): TbCertificatePrintPage {
    cy.get('iframe[src*="blob:"]', { timeout: 10000 }).should("be.visible");
    return this;
  }

  // Verify print button accessibility
  verifyPrintLinkAccessibility(): TbCertificatePrintPage {
    cy.get("a.print-trigger").should("have.class", "govuk-link").and("be.visible");

    cy.get("a.print-trigger img")
      .should("have.attr", "alt", "Print Certificate")
      .and("have.attr", "height", "32");

    return this;
  }

  // Method for handling potential print dialog (browser-dependent)
  handlePrintDialog(): TbCertificatePrintPage {
    // In real implementation, might need to handle browser print dialog
    // This is highly browser-dependent and may require special handling
    // For now, we just verify the print trigger works

    cy.window().then((win) => {
      // You could spy on window.print if the implementation uses it
      cy.stub(win, "print").as("printStub");
    });

    return this;
  }

  // Verify certificate download/print functionality
  verifyCertificateDownloadability(): TbCertificatePrintPage {
    // Check if the blob URL is accessible (basic check)
    cy.get("iframe").then(($iframe) => {
      const src = $iframe.attr("src");
      expect(src).to.match(/^blob:/);
    });

    return this;
  }
}
