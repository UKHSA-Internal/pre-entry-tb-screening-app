//This holds all fields of the Medical Summary Page
import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper, SummaryHelper } from "../helpers";

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
  // ✅ UPDATED: Verify summary data with proper age handling
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
          this.verifySummaryValue("Has the visa applicant had pulmonary TB?", processedValue);
          break;
        case "previousTbDetail":
          this.verifySummaryValue("Detail of applicant's previous pulmonary TB", processedValue);
          break;
        case "closeContactWithTb":
          this.verifySummaryValue(
            "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
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
          this.verifySummaryValue("Is the visa applicant pregnant?", processedValue);
          break;
        case "menstrualPeriods":
          this.verifySummaryValue(
            "Does the visa applicant have menstrual periods?",
            processedValue,
          );
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
    reasonXrayNotRequired?: "Child (under 11 years)" | "Pregnant" | "Other";
  }): MedicalSummaryPage {
    // Verify all the fields exist in the summary
    const expectedFields = [
      "Date of medical screening",
      "Age",
      "Does the visa applicant have pulmonary TB symptoms?",
      "If yes, which pulmonary TB symptoms",
      "Give further details (optional)",
      "Medical history for under 11",
      "Give further details (optional)",
      "Has the visa applicant had pulmonary TB?",
      "If yes, give details (optional)",
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
      "If yes, give details",
      "Is the visa applicant pregnant?",
      "Does the visa applicant have menstrual periods?",
      "Physical examination notes (optional)",
      "Is an X-ray required?",
    ];

    // Check that all expected fields are present
    expectedFields.forEach((field) => {
      this.isFieldPresent(field).should(
        "eq",
        true,
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
    cy.get("button[type='submit']")
      .contains("Submit and continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .click();
    return this;
  }

  // Verify submission section
  verifySubmissionSection(): MedicalSummaryPage {
    cy.contains("h2", "Now send the medical history and TB symptoms").should("be.visible");
    cy.contains(
      "p",
      "You will not be able to change the medical history and TB symptoms after you submit this information.",
    ).should("be.visible");
    return this;
  }

  // Verify submission confirmation message
  verifySubmissionConfirmationMessage(): MedicalSummaryPage {
    cy.contains(
      "p",
      "You will not be able to change the medical history and TB symptoms after you submit this information.",
    ).should("be.visible");
    return this;
  }

  // Verify redirection after confirmation
  verifyRedirectionAfterConfirm(): MedicalSummaryPage {
    // This should be overridden with the actual expected URL
    cy.url().should("not.include", "/check-medical-history-and-tb-symptoms");
    return this;
  }

  // Check if a specific field is present - FIXED
  isFieldPresent(fieldKey: string): Cypress.Chainable<boolean> {
    return cy.get(".govuk-summary-list__key").then(($keys) => {
      const keys = Array.from($keys).map((el) => el.textContent?.trim());
      const isPresent = keys.includes(fieldKey);
      return isPresent;
    });
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): MedicalSummaryPage {
    cy.get(".govuk-breadcrumbs").should("be.visible");
    return this;
  }

  // Verify Change link targets point to correct anchors
  verifyChangeLinksTargets(): MedicalSummaryPage {
    const expectedFragments: Record<string, string> = {
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
      "Reason X-ray is not required": "#reason-xray-not-taken",
    };

    Object.entries(expectedFragments).forEach(([key, fragment]) => {
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === key;
        })
        .parent()
        .find(".govuk-summary-list__actions a")
        .should("have.attr", "href")
        .and("include", fragment);
    });
    return this;
  }

  // Verify all Change links are visible
  verifyAllChangeLinksVisible(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__actions").each(($action) => {
      cy.wrap($action)
        .find("a.govuk-link")
        .should("be.visible")
        .and("contain", "Change")
        .and("have.class", "govuk-link--no-visited-state");
    });
    return this;
  }

  // Verify visually hidden text in Change links
  verifyChangeLinksVisuallyHiddenText(): MedicalSummaryPage {
    cy.get(".govuk-summary-list__actions a").each(($link) => {
      cy.wrap($link).find(".govuk-visually-hidden").should("exist");
    });
    return this;
  }

  // Verify back link points to correct page (dynamic based on scenario)
  verifyBackLink(expectedHref: string = "/reason-x-ray-not-required"): MedicalSummaryPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", expectedHref)
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

  // Verify optional fields show "Not provided" when empty - FIXED SELECTOR
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

  // Verify all fields are present on the page (base fields) - FIXED SELECTOR
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
      cy.get(".govuk-summary-list__key")
        .filter((_index, element) => {
          return element.textContent?.trim() === field;
        })
        .should("exist");
    });
    return this;
  }

  // Verify X-ray required field is present - FIXED SELECTOR
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

  // Verify "Reason X-ray is not required" field is present - FIXED SELECTOR
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

  // Verify "Reason X-ray is not required" field is NOT present (when X-ray is required) - FIXED SELECTOR
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
  verifyCurrentPageStructure(): MedicalSummaryPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyChangeLinksTargets();
    this.verifyAllChangeLinksVisible();
    this.verifyOptionalFieldsNotProvided();
    this.verifySubmissionSection();
    this.verifyContinueButton();
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
  verifyCompletePageStructure(): MedicalSummaryPage {
    this.verifySkipLink();
    this.verifyGovUKLogo();
    this.verifyServiceName();
    this.verifySignOutLink();
    this.verifyPhaseBanner();
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifySubmissionSection();
    this.verifyContinueButton();
    this.verifyFooter();
    this.verifyFooterLinks();
    return this;
  }
}
