//This holds all fields of the Medical Summary Page
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

// Type for applicant sex/type
export type ApplicantSex = "Male" | "Female" | "Child" | "Infant";

export class MedicalSummaryPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private summary = new SummaryHelper();

  constructor() {
    super("/check-medical-history-and-tb-symptoms");
  }

  // Format age string correctly for months or years
  formatAgeString(age: number, unit: "months" | "years"): string {
    if (unit === "months") {
      return age === 1 ? `${age} month old` : `${age} months old`;
    } else {
      return age === 1 ? `${age} year old` : `${age} years old`;
    }
  }

  // Verify age with automatic format detection
  verifyAge(age: number, unit: "months" | "years"): MedicalSummaryPage {
    const ageText = this.formatAgeString(age, unit);
    this.verifySummaryValue("Age", ageText);
    return this;
  }

  // Verify age with string (flexible input)
  verifyAgeString(ageText: string): MedicalSummaryPage {
    this.verifySummaryValue("Age", ageText);
    return this;
  }

  // Verify page loaded
  verifyPageLoaded(): MedicalSummaryPage {
    cy.url().should("include", "/check-medical-history-and-tb-symptoms");
    cy.contains("h1", "Check medical history and TB symptoms").should("be.visible");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === fieldKey;
      })
      .parent()
      .find(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): MedicalSummaryPage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Check if a field exists on the page
  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy
      .get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === fieldKey;
      })
      .then(($elements) => $elements.length > 0);
  }

  // Verify summary data with proper age handling
  verifySummaryData(data: {
    "Previous TB diagnosis or treatment"?: string;
    "TB symptoms in past 3 months"?: string;
    "Close contact with active TB"?: string;
    Age?: string | { value: number; unit: "months" | "years" };
  }): MedicalSummaryPage {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "Age" && typeof value === "object" && value !== null) {
        const ageData = value as { value: number; unit: "months" | "years" };
        this.verifyAge(ageData.value, ageData.unit);
      } else if (typeof value === "string") {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Click change link for a specific field - FIXED SELECTOR
  clickChangeLink(fieldKey: string): MedicalSummaryPage {
    cy.get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === fieldKey;
      })
      .parent()
      .find(".govuk-summary-list__actions a")
      .click();
    return this;
  }

  // Verify all summary values
  verifyAllSummaryValues(expectedValues: {
    "Date of medical screening"?: string;
    Age?: string;
    "Does the visa applicant have pulmonary TB symptoms?"?: string;
    "If yes, which pulmonary TB symptoms"?: string;
    "Give further details (optional)"?: string;
    "Has the visa applicant had pulmonary TB?"?: string;
    "If yes, give details (optional)"?: string;
    "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?"?: string;
    "If yes, give details"?: string;
    "Is the visa applicant pregnant?"?: string;
    "Does the visa applicant have menstrual periods?"?: string;
    "Physical examination notes (optional)"?: string;
    "Is an X-ray required?"?: string;
    "Reason X-ray is not required"?: string;
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
    sex?: ApplicantSex;
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
    reasonXrayNotRequired?: "Child (under 11 years)" | "Pregnant" | "Other";
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
          this.verifySummaryValue(
            "Does the visa applicant have pulmonary TB symptoms?",
            processedValue,
          );
          break;
        case "tbSymptomsList":
          if (processedValue) {
            this.verifySummaryValue("If yes, which pulmonary TB symptoms", processedValue);
          }
          break;
        case "otherSymptoms":
          this.verifySummaryValue("Give further details (optional)", processedValue);
          break;
        case "previousTb":
          this.verifySummaryValue("Has the visa applicant had pulmonary TB?", processedValue);
          break;
        case "previousTbDetail":
          this.verifySummaryValue("If yes, give details (optional)", processedValue);
          break;
        case "closeContactWithTb":
          this.verifySummaryValue(
            "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
            processedValue,
          );
          break;
        case "closeContactWithTbDetail":
          this.verifySummaryValue("If yes, give details", processedValue);
          break;
        case "pregnant":
          // Only verify if sex is Female
          if (enteredData.sex === "Female") {
            this.verifySummaryValue("Is the visa applicant pregnant?", processedValue);
          }
          break;
        case "menstrualPeriods":
          // Only verify if sex is Female
          if (enteredData.sex === "Female") {
            this.verifySummaryValue(
              "Does the visa applicant have menstrual periods?",
              processedValue,
            );
          }
          break;
        case "physicalExamNotes":
          this.verifySummaryValue("Physical examination notes (optional)", processedValue);
          break;
        case "xrayRequired":
          this.verifySummaryValue("Is an X-ray required?", processedValue);
          break;
        case "reasonXrayNotRequired":
          this.verifySummaryValue("Reason X-ray is not required", processedValue);
          break;
      }
    });
    return this;
  }

  /**
   * Fully validate summary with sex-aware field checking
   * Now dynamically handles male/female/child/infant applicants
   */
  fullyValidateSummary(enteredData: {
    dateOfMedicalScreening?: string;
    age?: string;
    sex?: ApplicantSex; // Added sex parameter
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
    reasonXrayNotRequired?: "Child (under 11 years)" | "Pregnant" | "Other";
  }): MedicalSummaryPage {
    // Build expected fields based on applicant sex
    const expectedFields = [
      "Date of medical screening",
      "Age",
      "Does the visa applicant have pulmonary TB symptoms?",
      "If yes, which pulmonary TB symptoms",
      "Give further details (optional)",
      "Has the visa applicant had pulmonary TB?",
      "If yes, give details (optional)",
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
      "If yes, give details",
    ];

    // Only add pregnancy fields for female applicants
    if (enteredData.sex === "Female") {
      expectedFields.push("Is the visa applicant pregnant?");
      expectedFields.push("Does the visa applicant have menstrual periods?");
    }

    // Add common fields that appear for all
    expectedFields.push("Physical examination notes (optional)");
    expectedFields.push("Is an X-ray required?");

    // Verify all expected fields exist
    expectedFields.forEach((field) => {
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === field;
        })
        .should("exist");
    });

    // If NOT female, verify pregnancy fields do NOT exist
    if (enteredData.sex && enteredData.sex !== "Female") {
      this.isFieldPresent("Is the visa applicant pregnant?").should("be.false");
      this.isFieldPresent("Does the visa applicant have menstrual periods?").should("be.false");
    }

    // Validate the entered data matches what's displayed
    this.validateSummaryMatchesEnteredData(enteredData);

    return this;
  }

  // Verify back link
  verifyBackLink(): MedicalSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href")
      .and("match", /\/(is-xray-required|medical-history-female)/);
    return this;
  }

  // Verify service name
  verifyServiceName(): MedicalSummaryPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): MedicalSummaryPage {
    this.gds.verifyBreadcrumbNavigation();
    return this;
  }

  // Verify submission section
  verifySubmissionSection(): MedicalSummaryPage {
    cy.contains("h2", "Now send your summary").should("be.visible");
    return this;
  }

  // Confirm details and submit
  confirmDetails(): MedicalSummaryPage {
    this.button.clickSaveAndContinue();
    return this;
  }

  // Verify redirection after confirming details
  verifyRedirectionAfterConfirm(): MedicalSummaryPage {
    cy.url().should("include", "/medical-history-and-tb-symptoms-confirmed");
    return this;
  }

  // Verify change links targets
  verifyChangeLinksTargets(): MedicalSummaryPage {
    const expectedFragments: { [key: string]: string } = {
      "Date of medical screening": "#date-of-medical-screening",
      Age: "#age",
      "Does the visa applicant have pulmonary TB symptoms?": "#tb-symptoms",
      "Has the visa applicant had pulmonary TB?": "#previous-tb",
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?":
        "#close-contact",
      "Physical examination notes (optional)": "#physical-exam-notes",
      "Is an X-ray required?": "#xray-required",
    };

    Object.entries(expectedFragments).forEach(([fieldKey, fragment]) => {
      // Check if field exists first
      this.isFieldPresent(fieldKey).then((exists) => {
        if (exists) {
          cy.get(".govuk-summary-list__key")
            .filter((_index, element) => {
              return element.textContent?.trim() === fieldKey;
            })
            .parent()
            .find(".govuk-summary-list__actions a")
            .should("have.attr", "href")
            .and("include", fragment);
        }
      });
    });

    return this;
  }

  // Verify all change links are visible
  verifyAllChangeLinksVisible(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__actions a").each(($link) => {
      cy.wrap($link).should("be.visible").and("contain", "Change");
    });
    return this;
  }

  // Verify optional fields show "Not provided"
  verifyOptionalFieldsNotProvided(): MedicalSummaryPage {
    const optionalFields = [
      "Give further details (optional)",
      "If yes, give details (optional)",
      "Physical examination notes (optional)",
    ];

    optionalFields.forEach((field) => {
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === field;
        })
        .parent()
        .find(".govuk-summary-list__value")
        .should("contain", "Not provided");
    });
    return this;
  }

  // Verify continue button styling
  verifyContinueButton(): MedicalSummaryPage {
    cy.get("button[type='submit']")
      .should("contain", "Submit and continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button")
      .and("have.attr", "style")
      .and("include", "margin-top");
    return this;
  }

  // Verify continue button is visible and enabled
  verifyContinueButtonState(): MedicalSummaryPage {
    cy.get("button[type='submit']")
      .should("be.visible")
      .and("be.enabled")
      .and("contain", "Submit and continue");
    return this;
  }

  /**
   * Verify all fields based on sex
   * Dynamically determines which fields should be present
   */
  verifyAllFieldsPresent(sex?: ApplicantSex): MedicalSummaryPage {
    const requiredFields = [
      "Date of medical screening",
      "Age",
      "Does the visa applicant have pulmonary TB symptoms?",
      "If yes, which pulmonary TB symptoms",
      "Give further details (optional)",
      "Has the visa applicant had pulmonary TB?",
      "If yes, give details (optional)",
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
      "If yes, give details",
    ];

    // Only add pregnancy fields for female applicants
    if (sex === "Female") {
      requiredFields.push("Is the visa applicant pregnant?");
      requiredFields.push("Does the visa applicant have menstrual periods?");
    }

    requiredFields.push("Physical examination notes (optional)");
    requiredFields.push("Is an X-ray required?");

    requiredFields.forEach((field) => {
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === field;
        })
        .should("exist");
    });

    // Verify pregnancy fields do NOT exist for non-females
    if (sex && sex !== "Female") {
      this.isFieldPresent("Is the visa applicant pregnant?").should("be.false");
      this.isFieldPresent("Does the visa applicant have menstrual periods?").should("be.false");
    }

    return this;
  }

  // Verify X-ray required field is present
  verifyXrayRequiredField(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === "Is an X-ray required?";
      })
      .should("exist");
    return this;
  }

  // Verify X-ray required value
  verifyXrayRequiredValue(expectedValue: "Yes" | "No"): MedicalSummaryPage {
    this.verifySummaryValue("Is an X-ray required?", expectedValue);
    return this;
  }

  // Verify "Reason X-ray is not required" field is present
  verifyReasonXrayNotRequiredField(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === "Reason X-ray is not required";
      })
      .should("exist");
    return this;
  }

  // Verify "Reason X-ray is not required" value
  verifyReasonXrayNotRequiredValue(
    expectedValue: "Child (under 11 years)" | "Pregnant" | "Other",
  ): MedicalSummaryPage {
    this.verifySummaryValue("Reason X-ray is not required", expectedValue);
    return this;
  }

  // Verify "Reason X-ray is not required" field is NOT present (when X-ray is required)
  verifyReasonXrayNotRequiredFieldNotPresent(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__key")
      .filter((_index, element) => {
        return element.textContent?.trim() === "Reason X-ray is not required";
      })
      .should("not.exist");
    return this;
  }

  // Click change link for "Reason X-ray is not required"
  clickChangeReasonXrayNotRequired(): MedicalSummaryPage {
    this.clickChangeLink("Reason X-ray is not required");
    return this;
  }

  // Verify scenario: X-ray NOT required (child, pregnant, or other)
  verifyXrayNotRequiredScenario(
    reason: "Child (under 11 years)" | "Pregnant" | "Other",
  ): MedicalSummaryPage {
    this.verifyXrayRequiredValue("No");
    this.verifyReasonXrayNotRequiredField();
    this.verifyReasonXrayNotRequiredValue(reason);
    return this;
  }

  // Verify scenario: X-ray IS required
  verifyXrayRequiredScenario(): MedicalSummaryPage {
    this.verifyXrayRequiredValue("Yes");
    this.verifyReasonXrayNotRequiredFieldNotPresent();
    return this;
  }

  // Verify current page structure
  verifyCurrentPageStructure(sex?: ApplicantSex): MedicalSummaryPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent(sex);
    this.verifyChangeLinksTargets();
    this.verifyAllChangeLinksVisible();
    this.verifyOptionalFieldsNotProvided();
    this.verifySubmissionSection();
    this.verifyContinueButton();
    this.verifyServiceName();
    return this;
  }

  // Verify page elements comprehensively
  verifyAllPageElements(sex?: ApplicantSex): MedicalSummaryPage {
    this.verifyCurrentPageStructure(sex);
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
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === fieldKey;
        })
        .parent()
        .find(".govuk-summary-list__value")
        .should("contain", "Not provided");
    }
    return this;
  }

  // Verify GOV.UK footer is present
  verifyFooter(): MedicalSummaryPage {
    cy.get(".govuk-footer").should("be.visible");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): MedicalSummaryPage {
    cy.get(".govuk-footer__link").contains("Privacy").should("be.visible");
    cy.get(".govuk-footer__link").contains("Accessibility statement").should("be.visible");
    return this;
  }

  // Verify phase banner
  verifyPhaseBanner(): MedicalSummaryPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag").contains("BETA").should("be.visible");
    cy.get(".govuk-phase-banner__text").should("contain", "This is a new service");
    return this;
  }

  // Verify sign out link in header
  verifySignOutLink(): MedicalSummaryPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Verify GOV.UK header logo
  verifyGovUKLogo(): MedicalSummaryPage {
    cy.get(".govuk-header__logo").should("be.visible");
    cy.get(".govuk-header__logotype").should("exist");
    return this;
  }

  // Verify skip link
  verifySkipLink(): MedicalSummaryPage {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain", "Skip to main content");
    return this;
  }

  // Comprehensive page validation including all GOV.UK components
  verifyCompletePageStructure(sex?: ApplicantSex): MedicalSummaryPage {
    this.verifySkipLink();
    this.verifyGovUKLogo();
    this.verifyServiceName();
    this.verifySignOutLink();
    this.verifyPhaseBanner();
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent(sex);
    this.verifySubmissionSection();
    this.verifyContinueButton();
    this.verifyFooter();
    this.verifyFooterLinks();
    return this;
  }
}
