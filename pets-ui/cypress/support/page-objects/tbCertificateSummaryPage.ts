//This holds all fields for the TB Certificate Summary Page - Handles both Cert issued and not issued scenarios

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

// Types for certificate not issued information
interface CertificateNotIssuedInfo {
  "Reason for not issuing certificate"?: string;
  "Declaring Physician's name"?: string;
  "Physician's comments"?: string;
}

export class TbCertificateSummaryPage extends BasePage {
  constructor() {
    super("/tb-certificate-summary");
  }

  verifyPageLoaded(): TbCertificateSummaryPage {
    cy.url().should("include", "/tb-certificate-summary");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Helper method to check if we're in issued mode
  isIssuedMode(): Cypress.Chainable<boolean> {
    return cy.get("h1").then(($h1) => {
      const heading = $h1.text().trim();
      return heading.includes("Check certificate information");
    });
  }

  // Helper method to check if we're in not issued mode
  isNotIssuedMode(): Cypress.Chainable<boolean> {
    return cy.get("h1").then(($h1) => {
      const heading = $h1.text().trim();
      return heading.includes("Check TB clearance outcome");
    });
  }

  // Verify page heading based on certificate status
  verifyPageHeadingForIssued(): TbCertificateSummaryPage {
    cy.get("h1").should("contain", "Check certificate information");
    return this;
  }

  verifyPageHeadingForNotIssued(): TbCertificateSummaryPage {
    cy.get("h1").should("contain", "Check TB clearance outcome");
    return this;
  }

  // CONDITIONAL METHODS FOR BOTH SCENARIOS
  // Verify applicant information section - only if in issued mode
  verifyApplicantInfoSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Visa applicant information").should("be.visible");
      }
    });
    return this;
  }

  // Verify applicant information - only if in issued mode
  verifyApplicantInfo(expectedInfo: ApplicantInfo): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify current residential address section - only if in issued mode
  verifyCurrentAddressSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Current residential address").should("be.visible");
      }
    });
    return this;
  }

  // Verify current residential address - only if in issued mode
  verifyCurrentAddress(expectedAddress: AddressInfo): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        Object.entries(expectedAddress).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify proposed UK address section - only if in issued mode
  verifyProposedUkAddressSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Proposed UK address").should("be.visible");
      }
    });
    return this;
  }

  // Verify proposed UK address - only if in issued mode
  verifyProposedUkAddress(expectedAddress: AddressInfo): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        Object.entries(expectedAddress).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify clinic and certificate information section - only if in issued mode
  verifyClinicCertificateSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Clinic and certificate information").should("be.visible");
      }
    });
    return this;
  }

  // Verify clinic and certificate information - only if in issued mode
  verifyClinicCertificateInfo(expectedInfo: ClinicCertificateInfo): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify screening information section - only if in issued mode
  verifyScreeningInfoSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Screening information").should("be.visible");
      }
    });
    return this;
  }

  // Verify screening information - only if in issued mode
  verifyScreeningInfo(expectedInfo: ScreeningInfo): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify applicant photo - only if in issued mode
  verifyApplicantPhoto(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.get(".applicant-photo-summary")
          .should("be.visible")
          .and("have.attr", "alt", "Applicant");
      }
    });
    return this;
  }

  // Verify declaration text - only if in issued mode
  verifyDeclarationText(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains(
          "p",
          "By submitting this certificate information you are confirming that, to the best of your knowledge, there is no clinical suspicious of pulmonary TB.",
        ).should("be.visible");
      }
    });
    return this;
  }

  // Verify certificate not issued summary data - only if in not issued mode
  verifyCertificateNotIssuedInfo(expectedInfo: CertificateNotIssuedInfo): TbCertificateSummaryPage {
    this.isNotIssuedMode().then((isNotIssued) => {
      if (isNotIssued) {
        Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
          if (value !== undefined) {
            this.verifySummaryValue(key, value);
          }
        });
      }
    });
    return this;
  }

  // Verify the page is in "certificate not issued" mode
  verifyCertificateNotIssuedMode(): TbCertificateSummaryPage {
    this.verifyPageHeadingForNotIssued();

    // In Cert not issued mode, we should see the specific fields for not issuing
    cy.contains("dt.govuk-summary-list__key", "Reason for not issuing certificate").should(
      "be.visible",
    );
    cy.contains("dt.govuk-summary-list__key", "Declaring Physician's name").should("be.visible");

    // Verify that issued-mode elements do NOT exist
    cy.contains("h2", "Visa applicant information").should("not.exist");
    cy.contains("h2", "Clinic and certificate information").should("not.exist");
    cy.contains("h2", "Screening information").should("not.exist");
    cy.get(".applicant-photo-summary").should("not.exist");

    return this;
  }

  // Verify the page is in "certificate issued" mode
  verifyCertificateIssuedMode(): TbCertificateSummaryPage {
    this.verifyPageHeadingForIssued();

    // Verify that issued-mode sections exist
    cy.contains("h2", "Visa applicant information").should("be.visible");
    cy.contains("h2", "Clinic and certificate information").should("be.visible");
    cy.contains("h2", "Screening information").should("be.visible");

    // Verify that not-issued-mode specific elements do NOT exist
    cy.contains("dt.govuk-summary-list__key", "Reason for not issuing certificate").should(
      "not.exist",
    );

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

  // Verify change links exist for editable fields (for issued certificates)
  verifyChangeLinksExist(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
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
      }
    });
    return this;
  }

  // Verify change links for Cert not issued scenario
  verifyChangeLinksForNotIssued(): TbCertificateSummaryPage {
    this.isNotIssuedMode().then((isNotIssued) => {
      if (isNotIssued) {
        const editableFields = [
          "Reason for not issuing certificate",
          "Declaring Physician's name",
          "Physician's comments",
        ];

        editableFields.forEach((field) => {
          cy.get("body").then(($body) => {
            if ($body.find(`dt:contains("${field}")`).length > 0) {
              cy.contains("dt.govuk-summary-list__key", field)
                .siblings(".govuk-summary-list__actions")
                .find("a")
                .should("contain", "Change")
                .and("have.attr", "href")
                .and("include", "/tb-certificate-not-issued");
            }
          });
        });
      }
    });
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

  // Verify back link navigation - context sensitive
  verifyBackLinkNavigation(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("be.visible").and("contain", "Back");
    return this;
  }

  // Verify back link for issued certificate
  verifyBackLinkForIssued(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("have.attr", "href", "/tb-certificate-declaration");
    return this;
  }

  // Verify back link for not issued certificate
  verifyBackLinkForNotIssued(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("have.attr", "href", "/tb-certificate-not-issued");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateSummaryPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(expectedUrl: string): TbCertificateSummaryPage {
    this.clickSubmit();
    cy.url().should("include", expectedUrl);
    return this;
  }

  // Complete verification for Certificate NOT Issued scenario
  verifyCompleteNotIssuedPage(expectedData: CertificateNotIssuedInfo): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifyCertificateNotIssuedMode();
    this.verifyCertificateNotIssuedInfo(expectedData);
    this.verifyChangeLinksForNotIssued();
    this.verifySubmitButton();
    this.verifyBackLinkForNotIssued();
    this.verifyServiceName();
    return this;
  }

  // Verify complete page with all expected data (for issued certificates)
  verifyCompleteIssuedPage(expectedData: {
    applicantInfo?: ApplicantInfo;
    currentAddress?: AddressInfo;
    proposedUkAddress?: AddressInfo;
    clinicCertificateInfo?: ClinicCertificateInfo;
    screeningInfo?: ScreeningInfo;
  }): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifyCertificateIssuedMode();

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
    this.verifyBackLinkForIssued();
    this.verifyServiceName();

    return this;
  }

  // Check all elements on the page - auto-detects mode and verifies it accordingly
  verifyAllPageElements(): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifySubmitButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    // Auto-detect mode and verify accordingly
    cy.get("body").then(($body) => {
      if ($body.find('h1:contains("Check certificate information")').length > 0) {
        // Certificate issued mode
        this.verifyCertificateIssuedMode();
        this.verifyApplicantPhoto();
        this.verifyDeclarationText();
        this.verifyChangeLinksExist();
      } else {
        // Certificate not issued mode
        this.verifyCertificateNotIssuedMode();
        this.verifyChangeLinksForNotIssued();
      }
    });

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

  // Test change links functionality for not issued scenario
  testChangeLinksForNotIssued(): TbCertificateSummaryPage {
    this.isNotIssuedMode().then((isNotIssued) => {
      if (isNotIssued) {
        // Test reason change link
        this.clickChangeLink("Reason for not issuing certificate");
        cy.url().should("include", "/tb-certificate-not-issued");
        cy.go("back");

        // Test physician name change link
        this.clickChangeLink("Declaring Physician's name");
        cy.url().should("include", "/tb-certificate-not-issued");
        cy.go("back");

        // Test physician comments change link (if exists)
        cy.get("body").then(($body) => {
          if ($body.find('dt:contains("Physician\'s comments")').length > 0) {
            this.clickChangeLink("Physician's comments");
            cy.url().should("include", "/tb-certificate-not-issued");
            cy.go("back");
          }
        });
      }
    });

    return this;
  }
}
