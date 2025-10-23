import { BasePage } from "../BasePage";

//This holds all fields of the Medical Summary Page
export class MedicalSummaryPage extends BasePage {
  constructor() {
    super("/check-medical-screening");
  }

  // Verify page loaded
  verifyPageLoaded(): MedicalSummaryPage {
    cy.url().should("include", "/check-medical-screening");
    cy.contains("h1", "Check medical screening").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): MedicalSummaryPage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Click change link for a specific field
  clickChangeLink(fieldKey: string): MedicalSummaryPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify all summary values
  verifyAllSummaryValues(expectedValues: {
    "Date of medical screening"?: string;
    Age?: string;
    "Does the applicant have pulmonary TB symptoms?"?: string;
    "Pulmonary TB symptoms"?: string;
    "Other symptoms"?: string;
    "Applicant history if under 11"?: string;
    "Additional details of applicant history if under 11"?: string;
    "Has the applicant ever had pulmonary TB?"?: string;
    "Detail of applicant's previous pulmonary TB"?: string;
    "Has the applicant had close contact with any person with active pulmonary TB within the past year?"?: string;
    "Details of applicant's close contact with any person with active pulmonary TB"?: string;
    "Is the applicant pregnant?"?: string;
    "Does the applicant have menstrual periods?"?: string;
    "Physical examination notes"?: string;
    "Is an X-ray required?"?: string;
  }): MedicalSummaryPage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Validate that summary matches the entered medical screening data
  validateSummaryMatchesEnteredData(enteredData: {
    dateOfMedicalScreening?: string;
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
    xrayRequired?: "Yes" | "No";
  }): MedicalSummaryPage {
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
        case "dateOfMedicalScreening":
          this.verifySummaryValue("Date of medical screening", processedValue);
          break;
        case "age":
          this.verifySummaryValue("Age", processedValue);
          break;
        case "tbSymptoms":
          this.verifySummaryValue("Does the applicant have pulmonary TB symptoms?", processedValue);
          break;
        case "tbSymptomsList":
          if (processedValue) {
            this.verifySummaryValue("Pulmonary TB symptoms", processedValue);
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
          this.verifySummaryValue("Has the applicant ever had pulmonary TB?", processedValue);
          break;
        case "previousTbDetail":
          this.verifySummaryValue("Detail of applicant's previous pulmonary TB", processedValue);
          break;
        case "closeContactWithTb":
          this.verifySummaryValue(
            "Has the applicant had close contact with any person with active pulmonary TB within the past year?",
            processedValue,
          );
          break;
        case "closeContactWithTbDetail":
          this.verifySummaryValue(
            "Details of applicant's close contact with any person with active pulmonary TB",
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
        case "xrayRequired":
          this.verifySummaryValue("Is an X-ray required?", processedValue);
          break;
      }
    });
    return this;
  }

  // Validation method to check all entered fields
  fullyValidateSummary(enteredData: {
    dateOfMedicalScreening?: string;
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
    xrayRequired?: "Yes" | "No";
  }): MedicalSummaryPage {
    // Verify all the fields exist in the summary
    const expectedFields = [
      "Date of medical screening",
      "Age",
      "Does the applicant have pulmonary TB symptoms?",
      "Pulmonary TB symptoms",
      "Other symptoms",
      "Applicant history if under 11",
      "Additional details of applicant history if under 11",
      "Has the applicant ever had pulmonary TB?",
      "Detail of applicant's previous pulmonary TB",
      "Has the applicant had close contact with any person with active pulmonary TB within the past year?",
      "Details of applicant's close contact with any person with active pulmonary TB",
      "Is the applicant pregnant?",
      "Does the applicant have menstrual periods?",
      "Physical examination notes",
      "Is an X-ray required?",
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
    return this;
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
  confirmDetails(): MedicalSummaryPage {
    cy.get("button[type='submit']").contains("Save and continue").should("be.visible").click();
    return this;
  }

  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get("dt.govuk-summary-list__key").then(($elements) => {
      const keys = $elements.map((_, el) => Cypress.$(el).text()).get();
      return keys.includes(fieldKey);
    });
  }

  // Verify redirection after confirming details
  verifyRedirectionAfterConfirm(): MedicalSummaryPage {
    cy.url().should("include", "/medical-confirmation");
    return this;
  }

  getTotalSummaryItems(): Cypress.Chainable<number> {
    return cy.get(".govuk-summary-list__row").its("length");
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): MedicalSummaryPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Verify all change links work by checking they point to the url fragments
  verifyChangeLinksTargets(): MedicalSummaryPage {
    const expectedFragments = {
      "Date of medical screening": "#medical-screening-completion-date",
      Age: "#age",
      "Does the applicant have pulmonary TB symptoms?": "#tb-symptoms",
      "Pulmonary TB symptoms": "#tb-symptoms-list",
      "Other symptoms": "#other-symptoms-detail",
      "Applicant history if under 11": "#under-eleven-conditions",
      "Additional details of applicant history if under 11": "#under-eleven-conditions-detail",
      "Has the applicant ever had pulmonary TB?": "#previous-tb",
      "Detail of applicant's previous pulmonary TB": "#previous-tb-detail",
      "Has the applicant had close contact with any person with active pulmonary TB within the past year?":
        "#close-contact-with-tb",
      "Details of applicant's close contact with any person with active pulmonary TB":
        "#close-contact-with-tb-detail",
      "Is the applicant pregnant?": "#pregnant",
      "Does the applicant have menstrual periods?": "#menstrual-periods",
      "Physical examination notes": "#physical-exam-notes",
      "Is an X-ray required?": "#chest-xray-taken",
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

  // Verify back link points to X-ray question page
  verifyBackLink(): MedicalSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/is-an-x-ray-required")
      .and("contain", "Back");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): MedicalSummaryPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify optional fields show "Not provided" when empty
  verifyOptionalFieldsNotProvided(): MedicalSummaryPage {
    const optionalFields = [
      "Pulmonary TB symptoms",
      "Other symptoms",
      "Additional details of applicant history if under 11",
      "Detail of applicant's previous pulmonary TB",
      "Details of applicant's close contact with any person with active pulmonary TB",
      "Physical examination notes",
    ];

    optionalFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field)
        .siblings(".govuk-summary-list__value")
        .should("contain", "Not provided");
    });
    return this;
  }

  // Verify continue button styling
  verifyContinueButton(): MedicalSummaryPage {
    cy.get("button[type='submit']")
      .should("contain", "Save and continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify all fields are present on the page
  verifyAllFieldsPresent(): MedicalSummaryPage {
    const requiredFields = [
      "Date of medical screening",
      "Age",
      "Does the applicant have pulmonary TB symptoms?",
      "Pulmonary TB symptoms",
      "Other symptoms",
      "Applicant history if under 11",
      "Additional details of applicant history if under 11",
      "Has the applicant ever had pulmonary TB?",
      "Detail of applicant's previous pulmonary TB",
      "Has the applicant had close contact with any person with active pulmonary TB within the past year?",
      "Details of applicant's close contact with any person with active pulmonary TB",
      "Is the applicant pregnant?",
      "Does the applicant have menstrual periods?",
      "Physical examination notes",
      "Is an X-ray required?",
    ];

    requiredFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
    return this;
  }

  // Verify X-ray required field is present
  verifyXrayRequiredField(): MedicalSummaryPage {
    cy.contains("dt.govuk-summary-list__key", "Is an X-ray required?").should("exist");
    return this;
  }

  // Verify X-ray required value
  verifyXrayRequiredValue(expectedValue: "Yes" | "No"): MedicalSummaryPage {
    this.verifySummaryValue("Is an X-ray required?", expectedValue);
    return this;
  }

  // Verify current page structure
  verifyCurrentPageStructure(): MedicalSummaryPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyChangeLinksTargets();
    this.verifyOptionalFieldsNotProvided();
    this.verifyContinueButton();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify page elements comprehensively
  verifyAllPageElements(): MedicalSummaryPage {
    this.verifyCurrentPageStructure();
    this.verifyBreadcrumbNavigation();
    return this;
  }

  // Complete form submission flow
  completeFormSubmission(): MedicalSummaryPage {
    this.verifyPageLoaded();
    this.confirmDetails();
    this.verifyRedirectionAfterConfirm();
    return this;
  }

  // Helper method to verify if a field has a value or shows "Not provided"
  verifyFieldHasValueOrNotProvided(fieldKey: string, expectedValue?: string): MedicalSummaryPage {
    if (expectedValue) {
      this.verifySummaryValue(fieldKey, expectedValue);
    } else {
      // Check if it shows "Not provided" for optional fields
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__value")
        .should("contain", "Not provided");
    }
    return this;
  }
}
