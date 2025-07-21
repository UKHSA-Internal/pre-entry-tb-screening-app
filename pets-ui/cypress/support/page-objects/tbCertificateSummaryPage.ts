//This holds all fields for the TB Certificate Summary Page

import { BasePage } from "../BasePage";

// Types for applicant information
interface ApplicantInfo {
  Name?: string;
  Nationality?: string;
  "Date of birth"?: string;
  Sex?: string;
  "Passport number"?: string;
  "Passport issue date"?: string;
  "Passport expiry date"?: string;
  "UKVI visa category"?: string;
}

// Types for address information
interface AddressInfo {
  "Address line 1"?: string;
  "Address line 2"?: string;
  "Town or city"?: string;
  Country?: string;
  County?: string;
  Postcode?: string;
}

// Types for clinic and certificate information
interface ClinicCertificateInfo {
  "Clinic name"?: string;
  "Certificate reference number"?: string;
  "Certificate issue date"?: string;
  "Certificate expiry date"?: string;
  "Declaring physician name"?: string;
  "Physician's comments"?: string;
}

// Types for screening information
interface ScreeningInfo {
  "Chest X-ray done"?: string;
  "Chest X-ray outcome"?: string;
  "Sputum collected"?: string;
  "Sputum outcome"?: string;
  Pregnant?: string;
  "Child under 11 years"?: string;
}

export class TbCertificateSummaryPage extends BasePage {
  constructor() {
    super("/tb-certificate-summary");
  }

  verifyPageLoaded(): TbCertificateSummaryPage {
    super.verifyPageHeading("Check certificate information");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information section
  verifyApplicantInfoSection(): TbCertificateSummaryPage {
    cy.contains("h2", "Visa applicant information").should("be.visible");
    return this;
  }

  // Verify applicant information
  verifyApplicantInfo(expectedInfo: ApplicantInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify current residential address section
  verifyCurrentAddressSection(): TbCertificateSummaryPage {
    cy.contains("h2", "Current residential address").should("be.visible");
    return this;
  }

  // Verify current residential address
  verifyCurrentAddress(expectedAddress: AddressInfo): TbCertificateSummaryPage {
    Object.entries(expectedAddress).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify proposed UK address section
  verifyProposedUkAddressSection(): TbCertificateSummaryPage {
    cy.contains("h2", "Proposed UK address").should("be.visible");
    return this;
  }

  // Verify proposed UK address
  verifyProposedUkAddress(expectedAddress: AddressInfo): TbCertificateSummaryPage {
    Object.entries(expectedAddress).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify clinic and certificate information section
  verifyClinicCertificateSection(): TbCertificateSummaryPage {
    cy.contains("h2", "Clinic and certificate information").should("be.visible");
    return this;
  }

  // Verify clinic and certificate information
  verifyClinicCertificateInfo(expectedInfo: ClinicCertificateInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify screening information section
  verifyScreeningInfoSection(): TbCertificateSummaryPage {
    cy.contains("h2", "Screening information").should("be.visible");
    return this;
  }

  // Verify screening information
  verifyScreeningInfo(expectedInfo: ScreeningInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): TbCertificateSummaryPage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Verify applicant photo is displayed
  verifyApplicantPhoto(): TbCertificateSummaryPage {
    cy.get(".applicant-photo-summary").should("be.visible").and("have.attr", "alt", "Applicant");
    return this;
  }

  // Verify declaration text
  verifyDeclarationText(): TbCertificateSummaryPage {
    cy.contains(
      "p",
      "By submitting this certificate information you are confirming that, to the best of your knowledge, there is no clinical suspicious of pulmonary TB.",
    ).should("be.visible");
    return this;
  }

  // Check if a specific field has a "Change" link
  checkChangeLink(fieldKey: string): Cypress.Chainable {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change");
  }

  // Click on change link for a specific field
  clickChangeLink(fieldKey: string): TbCertificateSummaryPage {
    this.checkChangeLink(fieldKey).click();
    return this;
  }

  // Verify change links exist for editable fields
  verifyChangeLinksExist(): TbCertificateSummaryPage {
    // Check for change links on clinic and certificate information fields
    const editableFields = ["Declaring physician name", "Physician's comments"];

    editableFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).then(($key) => {
        const $row = $key.closest(".govuk-summary-list__row");
        const $actions = $row.find("dd.govuk-summary-list__actions");

        if ($actions.length > 0) {
          cy.wrap($actions)
            .find("a")
            .should("contain", "Change")
            .and("have.attr", "href")
            .and("include", "/tb-certificate-declaration");
        }
      });
    });
    return this;
  }

  // Verify specific change link URLs
  verifySpecificChangeLinks(): TbCertificateSummaryPage {
    cy.contains("dt.govuk-summary-list__key", "Declaring physician name")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href")
      .and("include", "/tb-certificate-declaration#undefined");

    cy.contains("dt.govuk-summary-list__key", "Physician's comments")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href")
      .and("include", "/tb-certificate-declaration#physician-comments");

    return this;
  }

  // Click Submit button
  clickSubmit(): TbCertificateSummaryPage {
    cy.get('button[type="submit"]').contains("Submit").should("be.visible").click();
    return this;
  }

  // Verify submit button
  verifySubmitButton(): TbCertificateSummaryPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Submit");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tb-certificate-declaration");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateSummaryPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify page structure and layout
  verifyPageStructure(): TbCertificateSummaryPage {
    // Verify grid layout
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    cy.get(".govuk-grid-column-one-third").should("be.visible");

    // Verify all sections are present
    this.verifyApplicantInfoSection();
    this.verifyCurrentAddressSection();
    this.verifyProposedUkAddressSection();
    this.verifyClinicCertificateSection();
    this.verifyScreeningInfoSection();

    return this;
  }

  // Verify certificate reference number has special styling
  verifyCertificateReferenceNumberStyling(): TbCertificateSummaryPage {
    cy.get(".certificate-reference-nowrap").should("be.visible");
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(expectedUrl: string): TbCertificateSummaryPage {
    this.clickSubmit();
    cy.url().should("include", expectedUrl);
    return this;
  }

  // Verify complete page with all expected data
  verifyCompletePage(expectedData: {
    applicantInfo?: ApplicantInfo;
    currentAddress?: AddressInfo;
    proposedUkAddress?: AddressInfo;
    clinicCertificateInfo?: ClinicCertificateInfo;
    screeningInfo?: ScreeningInfo;
  }): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifyPageStructure();

    if (expectedData.applicantInfo) {
      this.verifyApplicantInfo(expectedData.applicantInfo);
    }

    if (expectedData.currentAddress) {
      this.verifyCurrentAddress(expectedData.currentAddress);
    }

    if (expectedData.proposedUkAddress) {
      this.verifyProposedUkAddress(expectedData.proposedUkAddress);
    }

    if (expectedData.clinicCertificateInfo) {
      this.verifyClinicCertificateInfo(expectedData.clinicCertificateInfo);
    }

    if (expectedData.screeningInfo) {
      this.verifyScreeningInfo(expectedData.screeningInfo);
    }

    this.verifyApplicantPhoto();
    this.verifyDeclarationText();
    this.verifyChangeLinksExist();
    this.verifySubmitButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifyPageStructure();
    this.verifyCertificateReferenceNumberStyling();
    this.verifyApplicantPhoto();
    this.verifyDeclarationText();
    this.verifyChangeLinksExist();
    this.verifySubmitButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Helper method to get all summary data
  getAllSummaryData(): Cypress.Chainable<{ [key: string]: string }> {
    const summaryData: { [key: string]: string } = {};

    return cy.get(".govuk-summary-list__row").then(($rows) => {
      $rows.each((_, row) => {
        const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
        const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();
        summaryData[key] = value;
      });
      return summaryData;
    });
  }

  // Verify expected summary data matches what's displayed
  verifyAllSummaryData(expectedData: { [key: string]: string }): TbCertificateSummaryPage {
    Object.entries(expectedData).forEach(([key, value]: [string, string]) => {
      this.verifySummaryValue(key, value);
    });
    return this;
  }
}
