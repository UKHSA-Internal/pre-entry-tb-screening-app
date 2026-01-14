/**
 * ApplicantSummaryPage - REFACTORED EXAMPLE
 * Demonstrates the new composition-based approach for summary pages
 * This page displays a summary of applicant details and allows changes
 */
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

export class ApplicantSummaryPage extends BasePage {
  // Helper instances
  private summary = new SummaryHelper();
  private button = new ButtonHelper();
  private gds = new GdsComponentHelper();

  constructor() {
    super("/check-visa-applicant-details");
  }

  // ============================================================
  // PAGE VERIFICATION
  // ============================================================

  verifyPageLoaded(): ApplicantSummaryPage {
    this.gds.verifyPageHeading("Check visa applicant details");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // ============================================================
  // SUMMARY FIELD VERIFICATION
  // ============================================================

  verifyAllFieldsPresent(): ApplicantSummaryPage {
    const requiredFields = [
      "Full name",
      "Sex",
      "Nationality",
      "Date of birth",
      "Passport number",
      "Country of issue",
      "Passport issue date",
      "Passport expiry date",
      "Home address line 1",
      "Home address line 2 (optional)",
      "Home address line 3 (optional)",
      "Town or city",
      "Province or state",
      "Country",
      "Postcode",
      "Photo",
    ];

    this.summary.verifyRequiredSummaryFields(requiredFields);
    return this;
  }

  // ============================================================
  // SUMMARY VALUE VERIFICATION
  // ============================================================

  /**
   * Get a single summary value
   */
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return this.summary.getSummaryValue(fieldKey);
  }

  /**
   * Verify a single summary value
   */
  verifySummaryValue(fieldKey: string, expectedValue: string): ApplicantSummaryPage {
    this.summary.verifySummaryValue(fieldKey, expectedValue);
    return this;
  }

  /**
   * Verify all summary values at once
   */
  verifyAllSummaryValues(expectedValues: {
    "Full name"?: string;
    Sex?: string;
    Nationality?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
    "Country of issue"?: string;
    "Passport issue date"?: string;
    "Passport expiry date"?: string;
    "Home address line 1"?: string;
    "Home address line 2 (optional)"?: string;
    "Home address line 3 (optional)"?: string;
    "Town or city"?: string;
    "Province or state"?: string;
    Country?: string;
    Postcode?: string;
    Photo?: string;
  }): ApplicantSummaryPage {
    this.summary.verifyAllSummaryValues(expectedValues);
    return this;
  }

  // ============================================================
  // OPTIONAL FIELD VERIFICATION
  // ============================================================

  /**
   * Verify "Not provided" text for optional fields
   */
  verifyNotProvidedText(fieldKey: string): ApplicantSummaryPage {
    this.summary.verifyNotProvidedText(fieldKey);
    return this;
  }

  /**
   * Verify multiple fields show "Not provided"
   */
  verifyMultipleNotProvidedFields(fieldKeys: string[]): ApplicantSummaryPage {
    this.summary.verifyMultipleNotProvidedFields(fieldKeys);
    return this;
  }

  // ============================================================
  // CHANGE LINK VERIFICATION
  // ============================================================

  /**
   * Click change link for a specific field
   */
  clickChangeLink(fieldKey: string): ApplicantSummaryPage {
    this.summary.clickChangeLink(fieldKey);
    return this;
  }

  /**
   * Verify all change links work
   */
  verifyChangeLinksTargets(): ApplicantSummaryPage {
    const expectedFragments = {
      "Full name": "#name",
      Sex: "#sex",
      Nationality: "#country-of-nationality",
      "Date of birth": "#birth-date",
      "Passport issue date": "#passport-issue-date",
      "Passport expiry date": "#passport-expiry-date",
      "Home address line 1": "#address-1",
      "Home address line 2 (optional)": "#address-2",
      "Home address line 3 (optional)": "#address-3",
      "Town or city": "#town-or-city",
      "Province or state": "#province-or-state",
      Country: "#country",
      Postcode: "#postcode",
    };

    this.summary.verifyChangeLinksTargets(expectedFragments);
    return this;
  }

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  /**
   * Confirm details and submit
   */
  confirmDetails(): ApplicantSummaryPage {
    this.button.clickSaveAndContinue();
    return this;
  }

  /**
   * Verify redirection after confirming details
   */
  verifyRedirectionAfterConfirm(): ApplicantSummaryPage {
    cy.url().should("include", "/visa-applicant-details-confirmed");
    return this;
  }

  // ============================================================
  // ADDITIONAL VERIFICATIONS
  // ============================================================

  /**
   * Check if a field is present
   */
  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return this.summary.isFieldPresent(fieldKey);
  }

  /**
   * Count total number of summary list items
   */
  getTotalSummaryItems(): Cypress.Chainable<number> {
    return this.summary.getTotalSummaryItems();
  }

  /**
   * Verify breadcrumb navigation
   */
  verifyBreadcrumbNavigation(): ApplicantSummaryPage {
    this.gds.verifyBreadcrumbNavigation();
    return this;
  }

  /**
   * Verify page structure
   */
  verifyPageStructure(): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.gds.verifyStandardPageElements();
    return this;
  }
}
