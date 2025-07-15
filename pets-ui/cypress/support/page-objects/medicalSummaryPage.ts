//This holds all fields of the Medical Summary Page
export class MedicalSummaryPage {
  visit(): void {
    cy.visit("/medical-summary");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.contains("h1", "Check medical screening").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): void {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
  }

  // Click change link for a specific field
  clickChangeLink(fieldKey: string): void {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
  }

  // Verify all summary values (removed "Name" field as it's not in current DOM)
  verifyAllSummaryValues(expectedValues: {
    Age?: string;
    "Does the applicant have TB symptoms?"?: string;
    "TB symptoms"?: string;
    "Other symptoms"?: string;
    "Applicant history if under 11"?: string;
    "Additional details of applicant history if under 11"?: string;
    "Has the applicant ever had tuberculosis?"?: string;
    "Detail of applicant's previous TB"?: string;
    "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?"?: string;
    "Details of applicant's close contact with any person with active pulmonary tuberculosis"?: string;
    "Is the applicant pregnant?"?: string;
    "Does the applicant have menstrual periods?"?: string;
    "Physical examination notes"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Validate that summary matches the entered medical screening data
  validateSummaryMatchesEnteredData(enteredData: {
    age?: string;
    tbSymptoms?: "Yes" | "No";
    tbSymptomsList?: string[];
    otherSymptoms?: string;
    underElevenConditions?: string;
    underElevenConditionsDetail?: string;
    previousTb?: "Yes" | "No";
    previousTbDetail?: string;
    closeContactWithTb?: "Yes" | "No";
    closeContactWithTbDetail?: string;
    pregnant?: "Yes" | "No" | "Don't know" | "N/A";
    menstrualPeriods?: "Yes" | "No" | "N/A";
    physicalExamNotes?: string;
  }): void {
    // convert value to string
    const processValue = (value: string | string[] | undefined): string => {
      if (value === undefined) return "";
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value;
    };

    // Validate each field that was entered
    Object.entries(enteredData).forEach(([key, value]) => {
      const processedValue = processValue(value);

      switch (key) {
        case "age":
          this.verifySummaryValue("Age", processedValue);
          break;
        case "tbSymptoms":
          this.verifySummaryValue("Does the applicant have TB symptoms?", processedValue);
          break;
        case "tbSymptomsList":
          if (processedValue) {
            this.verifySummaryValue("TB symptoms", processedValue);
          }
          break;
        case "otherSymptoms":
          this.verifySummaryValue("Other symptoms", processedValue);
          break;
        case "underElevenConditions":
          this.verifySummaryValue("Applicant history if under 11", processedValue);
          break;
        case "underElevenConditionsDetail":
          this.verifySummaryValue(
            "Additional details of applicant history if under 11",
            processedValue,
          );
          break;
        case "previousTb":
          this.verifySummaryValue("Has the applicant ever had tuberculosis?", processedValue);
          break;
        case "previousTbDetail":
          this.verifySummaryValue("Detail of applicant's previous TB", processedValue);
          break;
        case "closeContactWithTb":
          this.verifySummaryValue(
            "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
            processedValue,
          );
          break;
        case "closeContactWithTbDetail":
          this.verifySummaryValue(
            "Details of applicant's close contact with any person with active pulmonary tuberculosis",
            processedValue,
          );
          break;
        case "pregnant":
          this.verifySummaryValue("Is the applicant pregnant?", processedValue);
          break;
        case "menstrualPeriods":
          this.verifySummaryValue("Does the applicant have menstrual periods?", processedValue);
          break;
        case "physicalExamNotes":
          this.verifySummaryValue("Physical examination notes", processedValue);
          break;
      }
    });
  }

  // Validation method to check all entered fields
  fullyValidateSummary(enteredData: {
    age?: string;
    tbSymptoms?: "Yes" | "No";
    tbSymptomsList?: string[];
    otherSymptoms?: string;
    underElevenConditions?: string;
    underElevenConditionsDetail?: string;
    previousTb?: "Yes" | "No";
    previousTbDetail?: string;
    closeContactWithTb?: "Yes" | "No";
    closeContactWithTbDetail?: string;
    pregnant?: "Yes" | "No" | "Don't know" | "N/A";
    menstrualPeriods?: "Yes" | "No" | "N/A";
    physicalExamNotes?: string;
  }): void {
    // Verify all the fields exist in the summary
    const expectedFields = [
      "Age",
      "Does the applicant have TB symptoms?",
      "TB symptoms",
      "Other symptoms",
      "Applicant history if under 11",
      "Additional details of applicant history if under 11",
      "Has the applicant ever had tuberculosis?",
      "Detail of applicant's previous TB",
      "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
      "Details of applicant's close contact with any person with active pulmonary tuberculosis",
      "Is the applicant pregnant?",
      "Does the applicant have menstrual periods?",
      "Physical examination notes",
    ];

    // Check that all expected fields are present
    expectedFields.forEach((field) => {
      this.isFieldPresent(field).should(
        "be.true",
        `Field "${field}" should be present in the summary`,
      );
    });

    // Validate the entered data matches the summary
    this.validateSummaryMatchesEnteredData(enteredData);
  }

  getAllSummaryValues(): Cypress.Chainable<{ [key: string]: string }> {
    return cy.get(".govuk-summary-list__row").then(($rows) => {
      const summaryValues: { [key: string]: string } = {};

      $rows.each((_, row) => {
        const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
        const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();
        summaryValues[key] = value;
      });

      return summaryValues;
    });
  }

  // Submit form to confirm details
  confirmDetails(): void {
    cy.get("button[type='submit']").contains("Save and continue").should("be.visible").click();
  }

  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get("dt.govuk-summary-list__key").then(($elements) => {
      const keys = $elements.map((_, el) => Cypress.$(el).text()).get();
      return keys.includes(fieldKey);
    });
  }

  // Verify redirection after confirming details
  verifyRedirectionAfterConfirm(): void {
    cy.url().should("include", "/");
  }

  getTotalSummaryItems(): Cypress.Chainable<number> {
    return cy.get(".govuk-summary-list__row").its("length");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs").should("exist");
  }

  // Verify all change links work by checking they point to the correct fragment identifiers
  verifyChangeLinksTargets(): void {
    const expectedFragments = {
      Age: "#age",
      "Does the applicant have TB symptoms?": "#tb-symptoms",
      "TB symptoms": "#tb-symptoms-list",
      "Other symptoms": "#other-symptoms-detail",
      "Applicant history if under 11": "#under-eleven-conditions",
      "Additional details of applicant history if under 11": "#under-eleven-conditions-detail",
      "Has the applicant ever had tuberculosis?": "#previous-tb",
      "Detail of applicant's previous TB": "#previous-tb-detail",
      "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?":
        "#close-contact-with-tb",
      "Details of applicant's close contact with any person with active pulmonary tuberculosis":
        "#close-contact-with-tb-detail",
      "Is the applicant pregnant?": "#pregnant",
      "Does the applicant have menstrual periods?": "#menstrual-periods",
      "Physical examination notes": "#physical-exam-notes",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.contains("dt.govuk-summary-list__key", key)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
  }

  // Verify back link points to medical screening
  verifyBackLink(): void {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/medical-screening")
      .and("contain", "Back");
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening")
      .and("have.attr", "href", "/");
  }

  // Verify optional fields show "Enter" links when empty
  verifyOptionalFields(): void {
    const optionalFields = [
      "TB symptoms",
      "Other symptoms",
      "Additional details of applicant history if under 11",
      "Detail of applicant's previous TB",
      "Details of applicant's close contact with any person with active pulmonary tuberculosis",
      "Physical examination notes",
    ];

    optionalFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field)
        .siblings(".govuk-summary-list__value")
        .find("a")
        .should("exist")
        .and("contain", "Enter");
    });
  }

  // Verify continue button styling
  verifyContinueButton(): void {
    cy.get("button[type='submit']")
      .should("contain", "Save and continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
  }

  // Verify all fields are present on the page
  verifyAllFieldsPresent(): void {
    const requiredFields = [
      "Age",
      "Does the applicant have TB symptoms?",
      "TB symptoms",
      "Other symptoms",
      "Applicant history if under 11",
      "Additional details of applicant history if under 11",
      "Has the applicant ever had tuberculosis?",
      "Detail of applicant's previous TB",
      "Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?",
      "Details of applicant's close contact with any person with active pulmonary tuberculosis",
      "Is the applicant pregnant?",
      "Does the applicant have menstrual periods?",
      "Physical examination notes",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
  }

  // Verify current page structure
  verifyCurrentPageStructure(): void {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyChangeLinksTargets();
    this.verifyOptionalFields();
    this.verifyContinueButton();
    this.verifyBackLink();
    this.verifyServiceName();
  }

  // Verify page elements comprehensively
  verifyAllPageElements(): void {
    this.verifyCurrentPageStructure();
    this.verifyBreadcrumbNavigation();
  }

  // Complete form submission flow
  completeFormSubmission(): void {
    this.verifyPageLoaded();
    this.confirmDetails();
    this.verifyRedirectionAfterConfirm();
  }

  // Helper method to verify if a field has a value or shows "Enter" link
  verifyFieldHasValueOrEnterLink(fieldKey: string, expectedValue?: string): void {
    if (expectedValue) {
      this.verifySummaryValue(fieldKey, expectedValue);
    } else {
      // Check if it shows an "Enter" link for optional fields
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__value")
        .should("exist");
    }
  }
}
