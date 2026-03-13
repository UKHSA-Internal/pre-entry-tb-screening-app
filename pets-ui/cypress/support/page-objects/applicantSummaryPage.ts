/**
 * ApplicantSummaryPage - Dynamic Page Object Model for the Applicant Summary Page
 * Automatically handles Male, Female, Child, and Infant applicant types
 * Methods intelligently adapt based on the data provided
 */
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

// Type definitions for applicant data
export type ApplicantType = "Male" | "Female" | "Child" | "Infant";

export interface ApplicantData {
  fullName: string;
  dateOfBirth: string;
  sex?: ApplicantType;
  nationality: string;
  passportNumber: string;
  countryOfIssue: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  townOrCity: string;
  provinceOrState: string;
  postcode: string;
  country: string;
  photo: string;
  // Additional fields that might appear for certain applicant types
  parentGuardianName?: string;
  parentGuardianRelationship?: string;
  [key: string]: string | undefined; // Allow for any additional fields
}

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
  // DYNAMIC FIELD VERIFICATION
  // ============================================================

  /**
   * Get the expected fields based on applicant type
   * This is the single source of truth for what fields should appear
   */
  private getExpectedFields(applicantType?: ApplicantType): string[] {
    // Base fields that appear for all applicant types
    const baseFields = [
      "Full name",
      "Date of birth",
      "Sex",
      "Nationality",
      "Passport number",
      "Country of issue",
      "Passport issue date",
      "Passport expiry date",
      "Home address line 1",
      "Home address line 2 (optional)",
      "Home address line 3 (optional)",
      "Town or city",
      "Province or state",
      "Postcode",
      "Country",
      "Photo",
    ];

    // Additional fields based on applicant type
    const typeSpecificFields: { [key: string]: string[] } = {
      Child: ["Parent/Guardian name", "Parent/Guardian relationship"],
      Infant: ["Parent/Guardian name", "Parent/Guardian relationship"],
      // Male and Female have no additional fields
      Male: [],
      Female: [],
    };

    if (applicantType && typeSpecificFields[applicantType]) {
      return [...baseFields, ...typeSpecificFields[applicantType]];
    }

    return baseFields;
  }

  /**
   * Verify all expected fields are present
   * Automatically determines which fields to check based on applicant type
   */
  verifyAllFieldsPresent(applicantType?: ApplicantType): ApplicantSummaryPage {
    const expectedFields = this.getExpectedFields(applicantType);
    this.summary.verifyRequiredSummaryFields(expectedFields);
    return this;
  }

  /**
   * Verify all fields based on the sex value currently displayed on the page
   * Reads the sex from the page and verifies appropriate fields
   */
  verifyAllFieldsBasedOnDisplayedSex(): ApplicantSummaryPage {
    this.getSex().then((sex) => {
      const applicantType = sex as ApplicantType;
      this.verifyAllFieldsPresent(applicantType);
    });
    return this;
  }

  // ============================================================
  // DYNAMIC VALUE VERIFICATION
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
   * Get the sex/applicant type from the summary
   */
  getSex(): Cypress.Chainable<string> {
    return this.getSummaryValue("Sex");
  }

  /**
   * Verify the sex/applicant type
   */
  verifySex(sex: ApplicantType): ApplicantSummaryPage {
    this.summary.verifySummaryValue("Sex", sex);
    return this;
  }

  /**
   * Verify all summary values dynamically
   * Only verifies the fields that are provided in the data object
   * Automatically handles optional fields
   */
  verifyAllSummaryValues(expectedValues: Partial<ApplicantData>): ApplicantSummaryPage {
    // Map our field names to summary list keys
    const fieldMapping: { [key: string]: string } = {
      fullName: "Full name",
      dateOfBirth: "Date of birth",
      sex: "Sex",
      nationality: "Nationality",
      passportNumber: "Passport number",
      countryOfIssue: "Country of issue",
      passportIssueDate: "Passport issue date",
      passportExpiryDate: "Passport expiry date",
      addressLine1: "Home address line 1",
      addressLine2: "Home address line 2 (optional)",
      addressLine3: "Home address line 3 (optional)",
      townOrCity: "Town or city",
      provinceOrState: "Province or state",
      postcode: "Postcode",
      country: "Country",
      photo: "Photo",
      parentGuardianName: "Parent/Guardian name",
      parentGuardianRelationship: "Parent/Guardian relationship",
    };

    // Verify each provided value
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        const summaryKey = fieldMapping[key] || key;
        this.verifySummaryValue(summaryKey, value);
      }
    });

    return this;
  }

  /**
   * Verify complete applicant summary - works for any applicant type
   * Automatically determines what to verify based on the data provided
   */
  verifyCompleteSummary(applicantData: ApplicantData): ApplicantSummaryPage {
    // Verify applicant type/sex if provided
    if (applicantData.sex) {
      this.verifySex(applicantData.sex);
      this.verifyAllFieldsPresent(applicantData.sex);
    } else {
      this.verifyAllFieldsPresent();
    }

    // Verify all provided values
    this.verifyAllSummaryValues(applicantData);

    // Handle optional address fields
    if (!applicantData.addressLine2) {
      this.verifyNotProvidedText("Home address line 2 (optional)");
    }

    if (!applicantData.addressLine3) {
      this.verifyNotProvidedText("Home address line 3 (optional)");
    }

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

  /**
   * Verify all optional address fields not provided
   */
  verifyOptionalAddressFieldsNotProvided(): ApplicantSummaryPage {
    this.verifyNotProvidedText("Home address line 2 (optional)");
    this.verifyNotProvidedText("Home address line 3 (optional)");
    return this;
  }

  // ============================================================
  // CHANGE LINK VERIFICATION & INTERACTION
  // ============================================================

  /**
   * Click change link for a specific field
   */
  clickChangeLink(fieldKey: string): ApplicantSummaryPage {
    this.summary.clickChangeLink(fieldKey);
    return this;
  }

  /**
   * Click change link for Sex field
   */
  clickChangeSex(): ApplicantSummaryPage {
    this.clickChangeLink("Sex");
    return this;
  }

  /**
   * Verify change link exists for a field
   */
  verifyChangeLinkExists(fieldKey: string): ApplicantSummaryPage {
    cy.get(".govuk-summary-list__row")
      .contains(".govuk-summary-list__key", fieldKey)
      .parents(".govuk-summary-list__row")
      .find(".govuk-summary-list__actions")
      .should("contain", "Change");
    return this;
  }

  /**
   * Verify all change links work
   * Dynamically checks based on fields present on the page
   */
  verifyAllChangeLinksWork(): ApplicantSummaryPage {
    cy.get(".govuk-summary-list__row").each(($row) => {
      cy.wrap($row)
        .find(".govuk-summary-list__actions a")
        .should("be.visible")
        .and("contain", "Change");
    });
    return this;
  }

  /**
   * Verify change links have correct targets
   */
  verifyChangeLinksTargets(): ApplicantSummaryPage {
    const expectedFragments: { [key: string]: string | undefined } = {
      "Full name": "#name",
      "Date of birth": "#birth-date",
      Sex: "#sex",
      Nationality: "#country-of-nationality",
      "Passport number": "#passport-number",
      "Country of issue": "#country-of-issue",
      "Passport issue date": "#passport-issue-date",
      "Passport expiry date": "#passport-expiry-date",
      "Home address line 1": "#address-1",
      "Home address line 2 (optional)": "#address-2",
      "Home address line 3 (optional)": "#address-3",
      "Town or city": "#town-or-city",
      "Province or state": "#province-or-state",
      Postcode: "#postcode",
      Country: "#address-country",
      Photo: undefined, // Photo goes to different page
    };

    Object.entries(expectedFragments).forEach(([fieldKey, fragment]) => {
      // Check if field exists on page first
      this.isFieldPresent(fieldKey).then((exists) => {
        if (exists) {
          cy.get(".govuk-summary-list__row")
            .contains(".govuk-summary-list__key", fieldKey)
            .parents(".govuk-summary-list__row")
            .find(".govuk-summary-list__actions a")
            .should("be.visible")
            .and("contain", "Change");

          if (fragment) {
            cy.get(".govuk-summary-list__row")
              .contains(".govuk-summary-list__key", fieldKey)
              .parents(".govuk-summary-list__row")
              .find(".govuk-summary-list__actions a")
              .should("have.attr", "href")
              .and("include", fragment);
          }
        }
      });
    });

    return this;
  }

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  /**
   * Click submit and continue button
   */
  submitAndContinue(): ApplicantSummaryPage {
    cy.get("button[type='submit']").contains("Submit and continue").should("be.visible").click();
    return this;
  }

  /**
   * Alias for submitAndContinue
   */
  confirmDetails(): ApplicantSummaryPage {
    this.submitAndContinue();
    return this;
  }

  /**
   * Verify submit button exists
   */
  verifySubmitButton(): ApplicantSummaryPage {
    cy.get("button[type='submit']")
      .contains("Submit and continue")
      .should("be.visible")
      .and("have.class", "govuk-button");
    return this;
  }

  /**
   * Verify redirection after submission
   */
  verifyRedirectionAfterSubmit(): ApplicantSummaryPage {
    cy.url().should("not.include", "/check-visa-applicant-details");
    return this;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  /**
   * Verify back link
   */
  verifyBackLink(): ApplicantSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/upload-visa-applicant-photo")
      .and("contain", "Back");
    return this;
  }

  /**
   * Click back link
   */
  clickBackLink(): ApplicantSummaryPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Check if a field is present on the page
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
   * Verify total number of fields
   */
  verifyTotalFieldCount(expectedCount: number): ApplicantSummaryPage {
    this.getTotalSummaryItems().should("equal", expectedCount);
    return this;
  }

  /**
   * Verify breadcrumb navigation
   */
  verifyBreadcrumbNavigation(): ApplicantSummaryPage {
    this.gds.verifyBreadcrumbNavigation();
    return this;
  }

  /**
   * Verify complete page structure
   */
  verifyPageStructure(): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.gds.verifyStandardPageElements();
    this.verifySubmitButton();
    this.verifyBackLink();
    return this;
  }

  // ============================================================
  // COMPLETE FLOW - WORKS FOR ANY APPLICANT TYPE
  // ============================================================

  /**
   * Complete applicant verification flow - works for any applicant type
   * This is the main method you should use - it handles everything automatically
   *
   * @param applicantData - The applicant data to verify
   * @returns this for method chaining
   *
   * @example
   * // Male applicant
   * applicantSummaryPage.completeApplicantVerification({
   *   fullName: "John Smith",
   *   sex: "Male",
   *   dateOfBirth: "1 January 1990",
   *   // ... other fields
   * });
   *
   * @example
   * // Female applicant
   * applicantSummaryPage.completeApplicantVerification({
   *   fullName: "Jane Doe",
   *   sex: "Female",
   *   // ... other fields
   * });
   *
   * @example
   * // Child applicant
   * applicantSummaryPage.completeApplicantVerification({
   *   fullName: "Tommy Smith",
   *   sex: "Child",
   *   parentGuardianName: "John Smith",
   *   // ... other fields
   * });
   */
  completeApplicantVerification(applicantData: ApplicantData): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.verifyCompleteSummary(applicantData);
    this.submitAndContinue();
    return this;
  }

  /**
   * Verify applicant summary without submitting
   * Useful when you want to verify but not submit (e.g., testing change links)
   */
  verifyApplicantSummary(applicantData: ApplicantData): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.verifyCompleteSummary(applicantData);
    return this;
  }

  /**
   * Quick verification - just checks key fields are correct
   * Useful for smoke tests or when you don't need to verify everything
   */
  quickVerify(data: {
    fullName: string;
    sex?: ApplicantType;
    nationality: string;
    passportNumber: string;
  }): ApplicantSummaryPage {
    this.verifyPageLoaded();
    this.verifySummaryValue("Full name", data.fullName);
    this.verifySummaryValue("Nationality", data.nationality);
    this.verifySummaryValue("Passport number", data.passportNumber);

    if (data.sex) {
      this.verifySex(data.sex);
    }

    return this;
  }

  /**
   * Verify and log all current values on the page
   * Useful for debugging or creating test data
   */
  logAllSummaryValues(): ApplicantSummaryPage {
    cy.get(".govuk-summary-list__row").each(($row) => {
      const key = $row.find(".govuk-summary-list__key").text().trim();
      const value = $row.find(".govuk-summary-list__value").text().trim();
      cy.log(`${key}: ${value}`);
    });
    return this;
  }

  /**
   * Get all summary data as an object
   * Useful for assertions or data-driven tests
   */
  getAllSummaryData(): Cypress.Chainable<{ [key: string]: string }> {
    const summaryData: { [key: string]: string } = {};

    return cy.get(".govuk-summary-list__row").then(($rows) => {
      $rows.each((index, row) => {
        const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
        const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();
        summaryData[key] = value;
      });
      return summaryData;
    });
  }
}
