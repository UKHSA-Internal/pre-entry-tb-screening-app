//This holds all fields of the Applicant Summary Page
import { BasePage } from "../BasePage";

export class ApplicantSummaryPage extends BasePage {
  constructor() {
    super("/check-applicant-details");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantSummaryPage {
    cy.contains("h1", "Check applicant details").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify all fields are present on the page
  verifyAllFieldsPresent(): ApplicantSummaryPage {
    const requiredFields = [
      "Name",
      "Sex",
      "Country of nationality",
      "Date of birth",
      "Passport number",
      "Country of issue",
      "Passport issue date",
      "Passport expiry date",
      "Home address line 1",
      "Home address line 2",
      "Home address line 3",
      "Town or city",
      "Province or state",
      "Country",
      "Postcode",
      "Applicant Photo",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
    return this;
  }

  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): ApplicantSummaryPage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Click change link for a specific field
  clickChangeLink(fieldKey: string): ApplicantSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify all summary values
  verifyAllSummaryValues(expectedValues: {
    Name?: string;
    Sex?: string;
    "Country of nationality"?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
    "Country of issue"?: string;
    "Passport issue date"?: string;
    "Passport expiry date"?: string;
    "Home address line 1"?: string;
    "Home address line 2"?: string;
    "Home address line 3"?: string;
    "Town or city"?: string;
    "Province or state"?: string;
    Country?: string;
    Postcode?: string;
    "Applicant Photo"?: string;
  }): ApplicantSummaryPage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify "Not provided" text for optional fields
  verifyNotProvidedText(fieldKey: string): ApplicantSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .should("contain.text", "Not provided");
    return this;
  }

  // Verify multiple fields show "Not provided"
  verifyMultipleNotProvidedFields(fieldKeys: string[]): ApplicantSummaryPage {
    fieldKeys.forEach((fieldKey) => {
      this.verifyNotProvidedText(fieldKey);
    });
    return this;
  }

  confirmDetails(): ApplicantSummaryPage {
    cy.contains("button", "Save and continue").should("be.visible").click();
    return this;
  }

  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get("dt.govuk-summary-list__key").then(($elements) => {
      const keys = $elements.map((_, el) => Cypress.$(el).text()).get();
      return keys.includes(fieldKey);
    });
  }

  // Verify redirection after confirming details
  verifyRedirectionAfterConfirm(): ApplicantSummaryPage {
    cy.url().should("include", "/visa-applicant-details-confirmed");
    return this;
  }

  // Count total number of summary list items
  getTotalSummaryItems(): Cypress.Chainable<number> {
    return cy.get(".govuk-summary-list__row").its("length");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): ApplicantSummaryPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Verify all change links work
  verifyChangeLinksTargets(): ApplicantSummaryPage {
    const expectedFragments = {
      Name: "#name",
      Sex: "#sex",
      "Country of nationality": "#country-of-nationality",
      "Date of birth": "#birth-date",
      "Passport number": "#passport-number",
      "Country of issue": "#country-of-issue",
      "Passport issue date": "#passport-issue-date",
      "Passport expiry date": "#passport-expiry-date",
      "Home address line 1": "#address-1",
      "Home address line 2": "#address-2",
      "Home address line 3": "#address-3",
      "Town or city": "#town-or-city",
      "Province or state": "#province-or-state",
      Country: "#address-country",
      Postcode: "#postcode",
      "Applicant Photo": "/upload-visa-applicant-photo",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
    return this;
  }

  // Verify change link for specific field
  verifyChangeLinkTarget(fieldKey: string, expectedHref: string): ApplicantSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("have.attr", "href")
      .and("include", expectedHref);
    return this;
  }

  // Verify change link has visually hidden text for accessibility
  verifyChangeLinkAccessibility(fieldKey: string): ApplicantSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change")
      .find(".govuk-visually-hidden")
      .should("exist");
    return this;
  }

  // Verify all change links have no visited state styling
  verifyChangeLinksStyling(): ApplicantSummaryPage {
    cy.get(".govuk-summary-list__actions a").each(($link) => {
      cy.wrap($link).should("have.class", "govuk-link--no-visited-state");
    });
    return this;
  }

  // Verify optional address fields show "Enter" links when empty
  verifyOptionalAddressFields(): ApplicantSummaryPage {
    // Check if address line 2 shows "Enter" link when empty
    cy.contains("dt.govuk-summary-list__key", "Home address line 2")
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", "Enter home address line 2 (optional)");

    // Check if address line 3 shows "Enter" link when empty
    cy.contains("dt.govuk-summary-list__key", "Home address line 3")
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", "Enter home address line 3 (optional)");
    return this;
  }

  // Verify back link points to correct page
  verifyBackLink(): ApplicantSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/upload-visa-applicant-photo")
      .and("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): ApplicantSummaryPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ApplicantSummaryPage {
    cy.get(".govuk-header__service-name")
      .first()
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify that optional fields can be empty or have "Enter" links
  verifyOptionalFieldsHandling(): ApplicantSummaryPage {
    // Verify address line 2 and 3 can show "Enter" links (Where no data has been entered in those fields)
    cy.get(".govuk-summary-list__row").each(($row) => {
      const key = $row.find(".govuk-summary-list__key").text();
      const value = $row.find(".govuk-summary-list__value");

      if (key.includes("Home address line 2") || key.includes("Home address line 3")) {
        // These fields might contain "Enter" links when empty
        cy.wrap(value).should("exist");
      }
    });
    return this;
  }

  // Get change link URL for a specific field
  getChangeLinkUrl(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .invoke("attr", "href");
  }

  // Verify applicant photo filename is displayed
  verifyApplicantPhotoDisplayed(expectedFilename?: string): ApplicantSummaryPage {
    if (expectedFilename) {
      this.verifySummaryValue("Applicant Photo", expectedFilename);
    } else {
      // Just verify the field exists
      cy.contains("dt.govuk-summary-list__key", "Applicant Photo").should("exist");
    }
    return this;
  }

  // Verify Save and continue button exists
  verifySaveAndContinueButtonExists(): ApplicantSummaryPage {
    cy.contains("button", "Save and continue")
      .should("be.visible")
      .and("have.attr", "type", "submit")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify beta banner exists
  verifyBetaBanner(): ApplicantSummaryPage {
    cy.get(".govuk-phase-banner")
      .should("be.visible")
      .within(() => {
        cy.contains(".govuk-tag", "BETA").should("be.visible");
        cy.contains("This is a new service. Help us improve it and").should("be.visible");
      });
    return this;
  }

  // Verify Sign Out link exists
  verifySignOutLinkExists(): ApplicantSummaryPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain.text", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Click Sign Out link
  clickSignOut(): ApplicantSummaryPage {
    cy.get("#sign-out").click();
    return this;
  }

  // Verify footer links exist
  verifyFooterLinks(): ApplicantSummaryPage {
    cy.get(".govuk-footer").within(() => {
      cy.contains("a", "Privacy").should("be.visible").and("have.attr", "href", "/privacy-notice");
      cy.contains("a", "Accessibility statement")
        .should("be.visible")
        .and("have.attr", "href", "/accessibility-statement");
    });
    return this;
  }

  // Click Privacy link
  clickPrivacyLink(): ApplicantSummaryPage {
    cy.contains(".govuk-footer a", "Privacy").click();
    return this;
  }

  // Click Accessibility Statement link
  clickAccessibilityStatementLink(): ApplicantSummaryPage {
    cy.contains(".govuk-footer a", "Accessibility statement").click();
    return this;
  }

  // Verify GOV.UK logo exists
  verifyGovUKLogo(): ApplicantSummaryPage {
    cy.get(".govuk-header__logo")
      .should("be.visible")
      .find("svg")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Verify skip to main content link
  verifySkipLink(): ApplicantSummaryPage {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain.text", "Skip to main content");
    return this;
  }

  // Verify summary list structure
  verifySummaryListStructure(): ApplicantSummaryPage {
    cy.get(".govuk-summary-list").within(() => {
      cy.get(".govuk-summary-list__row").should("have.length.at.least", 16);
      cy.get(".govuk-summary-list__key").should("exist");
      cy.get(".govuk-summary-list__value").should("exist");
      cy.get(".govuk-summary-list__actions").should("exist");
    });
    return this;
  }

  // Verify all summary rows have change links
  verifyAllRowsHaveChangeLinks(): ApplicantSummaryPage {
    cy.get(".govuk-summary-list__row").each(($row) => {
      cy.wrap($row).find(".govuk-summary-list__actions a").should("exist").and("contain", "Change");
    });
    return this;
  }

  // Verify specific summary row structure
  verifySummaryRowStructure(fieldKey: string): ApplicantSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .parent()
      .within(() => {
        cy.get(".govuk-summary-list__key").should("exist");
        cy.get(".govuk-summary-list__value").should("exist");
        cy.get(".govuk-summary-list__actions").should("exist");
      });
    return this;
  }

  // Verify complete page structure
  verifyCompletePageStructure(): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.verifyBackLink();
    this.verifySummaryListStructure();
    this.verifySaveAndContinueButtonExists();
    return this;
  }

  // Verify page URL
  verifyPageUrl(): ApplicantSummaryPage {
    cy.url().should("include", "/check-applicant-details");
    return this;
  }

  // Verify passport details section
  verifyPassportDetailsSection(): ApplicantSummaryPage {
    const passportFields = [
      "Passport number",
      "Country of issue",
      "Passport issue date",
      "Passport expiry date",
    ];

    passportFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("be.visible");
    });
    return this;
  }

  // Verify personal details section
  verifyPersonalDetailsSection(): ApplicantSummaryPage {
    const personalFields = ["Name", "Sex", "Country of nationality", "Date of birth"];

    personalFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("be.visible");
    });
    return this;
  }

  // Verify address details section
  verifyAddressDetailsSection(): ApplicantSummaryPage {
    const addressFields = [
      "Home address line 1",
      "Home address line 2",
      "Home address line 3",
      "Town or city",
      "Province or state",
      "Country",
      "Postcode",
    ];

    addressFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("be.visible");
    });
    return this;
  }

  // Verify all required sections exist
  verifyAllSections(): ApplicantSummaryPage {
    this.verifyPersonalDetailsSection();
    this.verifyPassportDetailsSection();
    this.verifyAddressDetailsSection();
    cy.contains("dt.govuk-summary-list__key", "Applicant Photo").should("be.visible");
    return this;
  }
}
