// This holds all fields for the Clinic Certificate Info Page
import { BasePage } from "../BasePage";

export class ClinicCertificateInfoPage extends BasePage {
  constructor() {
    super("/clinic-certificate-information");
  }

  // Verify page loaded
  verifyPageLoaded(): ClinicCertificateInfoPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .should("contain", "Enter clinic and certificate information");
    return this;
  }

  // Verify summary list with clinic and certificate details
  verifySummaryList(): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify clinic name
  verifyClinicName(expectedName: string = "PETS Test Clinic"): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Clinic name")
      .parent()
      .find("dd.govuk-summary-list__value")
      .should("contain", expectedName);
    return this;
  }

  // Verify certificate reference number
  verifyCertificateReferenceNumber(expectedRef?: string): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate reference number")
      .parent()
      .find("dd.govuk-summary-list__value")
      .should("be.visible");

    if (expectedRef) {
      cy.get("dl.govuk-summary-list")
        .contains("dt.govuk-summary-list__key", "Certificate reference number")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedRef);
    }
    return this;
  }

  // Verify certificate issue date
  verifyCertificateIssueDate(expectedDate?: string): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue date")
      .parent()
      .find("dd.govuk-summary-list__value")
      .should("be.visible");

    if (expectedDate) {
      cy.get("dl.govuk-summary-list")
        .contains("dt.govuk-summary-list__key", "Certificate issue date")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedDate);
    }
    return this;
  }

  // Verify certificate issue expiry
  verifyCertificateIssueExpiry(expectedExpiry?: string): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
      .parent()
      .find("dd.govuk-summary-list__value")
      .should("be.visible");

    if (expectedExpiry) {
      cy.get("dl.govuk-summary-list")
        .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedExpiry);
    }
    return this;
  }

  // Verify certificate expiry is 6 months from issue date
  verifyCertificateExpiryIs6MonthsFromIssueDate(): ClinicCertificateInfoPage {
    // Get issue date
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue date")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((issueDateText) => {
        const issueDate = new Date(issueDateText.trim());

        // Calculate expected expiry date (6 months from issue date)
        const expectedExpiryDate = new Date(issueDate);
        expectedExpiryDate.setMonth(expectedExpiryDate.getMonth() + 6);

        // Format expected expiry date to match the display format (e.g., "26 April 2026")
        const expectedExpiryFormatted = expectedExpiryDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Get actual expiry date and verify
        cy.get("dl.govuk-summary-list")
          .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
          .parent()
          .find("dd.govuk-summary-list__value")
          .invoke("text")
          .then((expiryDateText) => {
            const actualExpiry = expiryDateText.trim();
            expect(actualExpiry).to.equal(expectedExpiryFormatted);
          });
      });
    return this;
  }

  // Alternative method:Verify expiry date is exactly 6 months after issue date
  verifyCertificateExpiryDateCalculation(): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue date")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((issueDateText) => {
        const issueDate = new Date(issueDateText.trim());

        cy.get("dl.govuk-summary-list")
          .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
          .parent()
          .find("dd.govuk-summary-list__value")
          .invoke("text")
          .then((expiryDateText) => {
            const expiryDate = new Date(expiryDateText.trim());

            // Calculate difference in months
            const monthsDifference =
              (expiryDate.getFullYear() - issueDate.getFullYear()) * 12 +
              (expiryDate.getMonth() - issueDate.getMonth());

            // Verify the difference is exactly 6 months
            expect(monthsDifference).to.equal(
              6,
              `Certificate expiry should be 6 months from issue date. Issue: ${issueDateText.trim()}, Expiry: ${expiryDateText.trim()}`,
            );

            // Also verify the day matches
            expect(expiryDate.getDate()).to.equal(
              issueDate.getDate(),
              `Certificate expiry day should match issue day`,
            );
          });
      });
    return this;
  }

  // Verify certificate expiry is 3 months from issue date (for close contact with TB scenario)
  verifyCertificateExpiryIs3MonthsFromIssueDate(): ClinicCertificateInfoPage {
    // Get issue date
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue date")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((issueDateText) => {
        const issueDate = new Date(issueDateText.trim());

        // Calculate expected expiry date (3 months from issue date)
        const expectedExpiryDate = new Date(issueDate);
        expectedExpiryDate.setMonth(expectedExpiryDate.getMonth() + 3);

        // Format expected expiry date to match the display format (e.g., "26 April 2026")
        const expectedExpiryFormatted = expectedExpiryDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Get actual expiry date and verify
        cy.get("dl.govuk-summary-list")
          .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
          .parent()
          .find("dd.govuk-summary-list__value")
          .invoke("text")
          .then((expiryDateText) => {
            const actualExpiry = expiryDateText.trim();
            expect(actualExpiry).to.equal(expectedExpiryFormatted);
          });
      });
    return this;
  }

  // Verify expiry date is exactly 3 months after issue date (for close contact with TB scenario)
  verifyCertificateExpiryDateCalculation3Months(): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate issue date")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((issueDateText) => {
        const issueDate = new Date(issueDateText.trim());

        cy.get("dl.govuk-summary-list")
          .contains("dt.govuk-summary-list__key", "Certificate issue expiry")
          .parent()
          .find("dd.govuk-summary-list__value")
          .invoke("text")
          .then((expiryDateText) => {
            const expiryDate = new Date(expiryDateText.trim());

            // Calculate difference in months
            const monthsDifference =
              (expiryDate.getFullYear() - issueDate.getFullYear()) * 12 +
              (expiryDate.getMonth() - issueDate.getMonth());

            // Verify the difference is exactly 3 months
            expect(monthsDifference).to.equal(
              3,
              `Certificate expiry should be 3 months from issue date (close contact with TB). Issue: ${issueDateText.trim()}, Expiry: ${expiryDateText.trim()}`,
            );

            // Also verify the day matches
            expect(expiryDate.getDate()).to.equal(
              issueDate.getDate(),
              `Certificate expiry day should match issue day`,
            );
          });
      });
    return this;
  }

  // Verify declaring physician's name field
  verifyDeclaringPhysicianNameField(): ClinicCertificateInfoPage {
    cy.get("#declaring-physician-name.govuk-form-group").should("be.visible");
    cy.get("label[for='declaring-physician-name-field']")
      .should("be.visible")
      .should("contain", "Declaring Physician's name");
    cy.get("#declaring-physician-name-field")
      .should("be.visible")
      .should("have.attr", "data-testid", "declaring-physician-name");
    return this;
  }

  // Enter declaring physician's name
  enterDeclaringPhysicianName(name: string): ClinicCertificateInfoPage {
    cy.get("#declaring-physician-name-field").clear().type(name);
    return this;
  }

  // Verify physician's notes field
  verifyPhysicianNotesField(): ClinicCertificateInfoPage {
    cy.get("#physician-comments.govuk-form-group").should("be.visible");
    cy.get("label[for='physician-comments-field']")
      .should("be.visible")
      .should("contain", "Physician's notes (optional)");
    cy.get("#physician-comments-field")
      .should("be.visible")
      .should("have.attr", "data-testid", "physician-comments");
    return this;
  }

  // Enter physician's notes
  enterPhysicianNotes(notes: string): ClinicCertificateInfoPage {
    cy.get("#physician-comments-field").clear().type(notes);
    return this;
  }

  // Verify continue button
  verifyContinueButton(): ClinicCertificateInfoPage {
    cy.get('button[type="submit"].govuk-button').should("be.visible").should("contain", "Continue");
    return this;
  }

  // Click continue button
  clickContinueButton(): ClinicCertificateInfoPage {
    cy.get('button[type="submit"].govuk-button').click();
    return this;
  }

  // Verify back link
  verifyBackLink(): ClinicCertificateInfoPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/will-you-issue-tb-clearance-certificate")
      .should("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): ClinicCertificateInfoPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify page title
  verifyPageTitle(): ClinicCertificateInfoPage {
    cy.title().should(
      "contain",
      "Enter clinic and certificate information - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify main content is visible
  verifyMainContent(): ClinicCertificateInfoPage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): ClinicCertificateInfoPage {
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
  verifyBetaBanner(): ClinicCertificateInfoPage {
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
  verifyAllPageElements(): ClinicCertificateInfoPage {
    this.verifyPageLoaded();
    this.verifySummaryList();
    this.verifyClinicName();
    this.verifyCertificateReferenceNumber();
    this.verifyCertificateIssueDate();
    this.verifyCertificateIssueExpiry();
    this.verifyDeclaringPhysicianNameField();
    this.verifyPhysicianNotesField();
    this.verifyContinueButton();
    this.verifyBackLink();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Complete the form with required information
  completeForm(physicianName: string, notes?: string): ClinicCertificateInfoPage {
    this.verifyPageLoaded();
    this.enterDeclaringPhysicianName(physicianName);

    if (notes) {
      this.enterPhysicianNotes(notes);
    }

    this.clickContinueButton();
    return this;
  }

  // Get certificate reference number value
  getCertificateReferenceNumber(): Cypress.Chainable<string> {
    return cy
      .get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate reference number")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Save certificate reference number for later use
  saveCertificateReferenceNumber(
    aliasName: string = "certificateRefNumber",
  ): ClinicCertificateInfoPage {
    cy.get("dl.govuk-summary-list")
      .contains("dt.govuk-summary-list__key", "Certificate reference number")
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim())
      .as(aliasName);
    return this;
  }

  // Verify certificate reference number matches saved value
  verifySavedCertificateReferenceNumber(
    aliasName: string = "certificateRefNumber",
  ): ClinicCertificateInfoPage {
    cy.get(`@${aliasName}`).then((savedRefNumber) => {
      cy.get("dl.govuk-summary-list")
        .contains("dt.govuk-summary-list__key", "Certificate reference number")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", savedRefNumber);
    });
    return this;
  }

  // Complete form and save certificate reference number
  completeFormAndSaveCertificateRef(
    physicianName: string,
    notes?: string,
    aliasName: string = "certificateRefNumber",
  ): ClinicCertificateInfoPage {
    this.verifyPageLoaded();
    this.saveCertificateReferenceNumber(aliasName);
    this.enterDeclaringPhysicianName(physicianName);

    if (notes) {
      this.enterPhysicianNotes(notes);
    }

    this.clickContinueButton();
    return this;
  }

  // Verify URL
  verifyUrl(): ClinicCertificateInfoPage {
    cy.url().should("include", "/clinic-certificate-information");
    return this;
  }

  // Verify form validation error for declaring physician name (if field is required)
  verifyDeclaringPhysicianNameError(errorMessage?: string): ClinicCertificateInfoPage {
    cy.get("#declaring-physician-name.govuk-form-group--error").should("be.visible");

    if (errorMessage) {
      cy.get("#declaring-physician-name .govuk-error-message")
        .should("be.visible")
        .should("contain", errorMessage);
    }
    return this;
  }
}
