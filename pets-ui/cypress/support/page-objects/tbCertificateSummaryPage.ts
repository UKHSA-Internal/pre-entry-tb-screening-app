// This holds all fields for the TB Certificate Summary Page - Handles both Cert issued and not issued scenarios
import { BasePage } from "../BasePage";

// Types for certificate not issued information
interface CertificateNotIssuedInfo {
  "Reason for not issuing certificate"?: string;
  "Declaring Physician's name"?: string;
  "Physician's comments"?: string;
}

// Types for applicant information (for not issued scenario)
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

  // Verify page loaded - works for both issued and not issued scenarios
  verifyPageLoaded(): TbCertificateSummaryPage {
    cy.url().should("include", "/tb-certificate-summary");
    cy.get("h1.govuk-heading-l").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // ============ Helper Methods for Scenario Detection ============

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

  // Verify certificate issued mode
  verifyCertificateIssuedMode(): TbCertificateSummaryPage {
    this.verifyPageHeadingForIssued();
    return this;
  }

  // Verify certificate not issued mode
  verifyCertificateNotIssuedMode(): TbCertificateSummaryPage {
    this.verifyPageHeadingForNotIssued();
    return this;
  }

  // ============ Notification Banner Section ============

  // Verify notification banner is visible
  verifyNotificationBanner(): TbCertificateSummaryPage {
    cy.get("section.govuk-notification-banner")
      .should("be.visible")
      .and("have.attr", "aria-labelledby", "govuk-notification-banner-title");
    return this;
  }

  // Verify notification banner title
  verifyNotificationBannerTitle(expectedTitle: string = "Important"): TbCertificateSummaryPage {
    cy.get(".govuk-notification-banner__header")
      .find("h2#govuk-notification-banner-title.govuk-notification-banner__title")
      .should("contain.text", expectedTitle);
    return this;
  }

  // Verify notification banner content about pulmonary TB referral
  verifyNotificationBannerContent(): TbCertificateSummaryPage {
    cy.get(".govuk-notification-banner__content")
      .should("be.visible")
      .find("p.govuk-body")
      .should(
        "contain.text",
        "If a visa applicant's chest X-rays indicate they have pulmonary TB, the panel physician must give them a referral letter and copies of the:",
      );
    return this;
  }

  // Verify notification banner list items
  verifyNotificationBannerList(): TbCertificateSummaryPage {
    cy.get(".govuk-notification-banner__content")
      .find("ul.govuk-body li")
      .should("have.length", 3)
      .then(($items) => {
        expect($items.eq(0).text().trim()).to.equal("chest X-ray");
        expect($items.eq(1).text().trim()).to.equal("radiology report");
        expect($items.eq(2).text().trim()).to.equal("medical record form");
      });
    return this;
  }

  // Comprehensive verification of notification banner
  verifyCompleteNotificationBanner(): TbCertificateSummaryPage {
    this.verifyNotificationBanner();
    this.verifyNotificationBannerTitle();
    this.verifyNotificationBannerContent();
    this.verifyNotificationBannerList();
    return this;
  }

  // ============ Visa Applicant Information Section ============

  // Verify visa applicant information section
  verifyVisaApplicantInfoSection(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Visa applicant information").should("be.visible");
    return this;
  }

  // Verify applicant information section (conditional for both scenarios)
  verifyApplicantInfoSection(): TbCertificateSummaryPage {
    this.isIssuedMode().then((isIssued) => {
      if (isIssued) {
        cy.contains("h2", "Visa applicant information").should("be.visible");
      }
    });
    return this;
  }

  // Verify applicant information - works for both scenarios
  verifyApplicantInfo(expectedInfo: ApplicantInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify applicant name
  verifyApplicantName(expectedName?: string): TbCertificateSummaryPage {
    if (expectedName) {
      cy.contains("dt.govuk-summary-list__key", "Name")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedName);
    } else {
      cy.contains("dt.govuk-summary-list__key", "Name")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify nationality
  verifyNationality(expectedNationality?: string): TbCertificateSummaryPage {
    if (expectedNationality) {
      cy.contains("dt.govuk-summary-list__key", "Nationality")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedNationality);
    } else {
      cy.contains("dt.govuk-summary-list__key", "Nationality")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify date of birth
  verifyDateOfBirth(expectedDOB?: string): TbCertificateSummaryPage {
    if (expectedDOB) {
      cy.contains("dt.govuk-summary-list__key", "Date of birth")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedDOB);
    } else {
      cy.contains("dt.govuk-summary-list__key", "Date of birth")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify sex
  verifySex(expectedSex?: string): TbCertificateSummaryPage {
    if (expectedSex) {
      cy.contains("dt.govuk-summary-list__key", "Sex")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedSex);
    } else {
      cy.contains("dt.govuk-summary-list__key", "Sex")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify passport number
  verifyPassportNumber(expectedPassportNumber?: string): TbCertificateSummaryPage {
    if (expectedPassportNumber) {
      cy.contains("dt.govuk-summary-list__key", "Passport number")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedPassportNumber);
    } else {
      cy.contains("dt.govuk-summary-list__key", "Passport number")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // ============ Certificate NOT Issued Section ============

  // Verify certificate not issued summary data - only if in not issued mode
  verifyCertificateNotIssuedInfo(expectedInfo: CertificateNotIssuedInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // ============ Screening Information Section ============

  // Verify screening information section - works for both scenarios
  verifyScreeningInfoSection(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Screening information").should("be.visible");
    return this;
  }

  verifyScreeningInfosection(): TbCertificateSummaryPage {
    return this.verifyScreeningInfoSection();
  }

  // Verify screening information - works for both scenarios
  verifyScreeningInfo(expectedInfo: ScreeningInfo): TbCertificateSummaryPage {
    Object.entries(expectedInfo).forEach(([key, value]: [string, string | undefined]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify chest X-ray done
  verifyChestXrayDone(expectedValue?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedValue) {
      section
        .contains("dt.govuk-summary-list__key", "Chest X-ray done")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedValue);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Chest X-ray done")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify chest X-ray outcome
  verifyChestXrayOutcome(expectedOutcome?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedOutcome) {
      section
        .contains("dt.govuk-summary-list__key", "Chest X-ray outcome")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedOutcome);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Chest X-ray outcome")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify sputum collected
  verifySputumCollected(expectedValue?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedValue) {
      section
        .contains("dt.govuk-summary-list__key", "Sputum collected")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedValue);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Sputum collected")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify sputum outcome
  verifySputumOutcome(expectedOutcome?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedOutcome) {
      section
        .contains("dt.govuk-summary-list__key", "Sputum outcome")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedOutcome);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Sputum outcome")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify pregnant status
  verifyPregnantStatus(expectedValue?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedValue) {
      section
        .contains("dt.govuk-summary-list__key", "Pregnant")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedValue);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Pregnant")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // Verify child under 11 years
  verifyChildUnder11Years(expectedValue?: string): TbCertificateSummaryPage {
    const section = cy
      .contains("h2.govuk-heading-m", "Screening information")
      .parent()
      .find("dl.govuk-summary-list");

    if (expectedValue) {
      section
        .contains("dt.govuk-summary-list__key", "Child under 11 years")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("contain", expectedValue);
    } else {
      section
        .contains("dt.govuk-summary-list__key", "Child under 11 years")
        .parent()
        .find("dd.govuk-summary-list__value")
        .should("be.visible");
    }
    return this;
  }

  // ============ Change Links ============

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
                .and("include", "/why-are-you-not-issuing-certificate");
            }
          });
        });
      }
    });
    return this;
  }

  // ============ Submission Section (Certificate Not Issued) ============

  // Verify "Now send the TB clearance outcome" heading
  verifySendOutcomeHeading(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Now send the TB clearance outcome").should("be.visible");
    return this;
  }

  // Verify warning text about not being able to change after submission
  verifySubmissionWarningText(): TbCertificateSummaryPage {
    cy.get("p.govuk-body")
      .contains(
        "You will not be able to change the TB clearance outcome after you submit this information.",
      )
      .should("be.visible");
    return this;
  }

  // Comprehensive verification of submission section
  verifyCompleteSubmissionSection(): TbCertificateSummaryPage {
    this.verifySendOutcomeHeading();
    this.verifySubmissionWarningText();
    this.verifySubmitButton();
    return this;
  }

  // ============ Page Actions ============

  // Verify submit button
  verifySubmitButton(): TbCertificateSummaryPage {
    cy.get('button[type="submit"].govuk-button')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Submit");
    return this;
  }

  // Click submit button
  clickSubmitButton(): TbCertificateSummaryPage {
    cy.get('button[type="submit"].govuk-button').click();
    return this;
  }
  // Click Submit button (alias)
  clickSubmit(): TbCertificateSummaryPage {
    return this.clickSubmitButton();
  }

  // Verify back link
  verifyBackLink(): TbCertificateSummaryPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/enter-clinic-certificate-information")
      .should("contain", "Back");
    return this;
  }

  // Verify back link for issued certificate
  verifyBackLinkForIssued(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("have.attr", "href", "/tb-certificate-declaration");
    return this;
  }

  // Verify back link for not issued certificate
  verifyBackLinkForNotIssued(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("have.attr", "href", "/why-are-you-not-issuing-certificate");
    return this;
  }

  // Verify back link navigation - context sensitive
  verifyBackLinkNavigation(): TbCertificateSummaryPage {
    cy.get(".govuk-back-link").should("be.visible").and("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): TbCertificateSummaryPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // ============ Standard Page Verifications ============

  // Verify service name in header
  verifyServiceName(): TbCertificateSummaryPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify page title
  verifyPageTitle(): TbCertificateSummaryPage {
    cy.title().should(
      "contain",
      "Check certificate information - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify main content is visible
  verifyMainContent(): TbCertificateSummaryPage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify grid layout
  verifyGridLayout(): TbCertificateSummaryPage {
    cy.get(".govuk-grid-row").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): TbCertificateSummaryPage {
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
  verifyBetaBanner(): TbCertificateSummaryPage {
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
  verifyUrl(): TbCertificateSummaryPage {
    cy.url().should("include", "/tb-certificate-summary");
    return this;
  }

  // ============ Comprehensive Verification Methods ============

  // Complete verification for Certificate NOT Issued scenario
  verifyCompleteNotIssuedPage(expectedData: CertificateNotIssuedInfo): TbCertificateSummaryPage {
    this.verifyPageLoaded();
    this.verifyCertificateNotIssuedMode();
    this.verifyCompleteNotificationBanner();
    this.verifyCertificateNotIssuedInfo(expectedData);
    this.verifyChangeLinksForNotIssued();
    this.verifyCompleteSubmissionSection();
    this.verifyBackLinkForNotIssued();
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
      } else {
        // Certificate not issued mode
        this.verifyCertificateNotIssuedMode();
        this.verifyChangeLinksForNotIssued();
      }
    });

    return this;
  }

  // Helper method to get summary value (inherited from BasePage but including here for reference)
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .parent()
      .find("dd.govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): TbCertificateSummaryPage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(expectedUrl: string): TbCertificateSummaryPage {
    this.clickSubmit();
    cy.url().should("include", expectedUrl);
    return this;
  }

  // ============ Comprehensive Verification Methods for Certificate ISSUED Scenario ============

  // Verify all visa applicant information fields
  verifyAllVisaApplicantInformation(): TbCertificateSummaryPage {
    this.verifyVisaApplicantInfoSection();
    this.verifyApplicantName();
    this.verifyNationality();
    this.verifyDateOfBirth();
    this.verifySex();
    this.verifyPassportNumber();
    return this;
  }

  // Verify all current residential address fields
  verifyAllCurrentResidentialAddressFields(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Current residential address").should("be.visible");
    // Just verify the section exists - individual fields can be verified with verifySummaryValue if needed
    return this;
  }

  // Verify all proposed UK address fields
  verifyAllProposedUKAddressFields(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Proposed UK address").should("be.visible");
    // Just verify the section exists - individual fields can be verified with verifySummaryValue if needed
    return this;
  }

  // Verify all clinic and certificate information fields
  verifyAllClinicCertificateInfo(): TbCertificateSummaryPage {
    cy.contains("h2.govuk-heading-m", "Clinic and certificate information").should("be.visible");
    // Verify key fields exist
    cy.contains("dt.govuk-summary-list__key", "Clinic name").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate reference number").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate issue date").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate expiry date").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Declaring physician name").should("be.visible");
    return this;
  }

  // Verify all screening information fields
  verifyAllScreeningInformation(): TbCertificateSummaryPage {
    this.verifyScreeningInfoSection();
    this.verifyChestXrayDone();
    this.verifyChestXrayOutcome();
    this.verifySputumCollected();
    this.verifySputumOutcome();
    this.verifyPregnantStatus();
    this.verifyChildUnder11Years();
    return this;
  }
}
