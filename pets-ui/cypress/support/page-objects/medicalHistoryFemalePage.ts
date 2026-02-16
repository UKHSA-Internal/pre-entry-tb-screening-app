// This holds all fields of the Medical History: Female Page

import { BasePage } from "../BasePageNew";
import { ButtonHelper, ErrorHelper, FormHelper, GdsComponentHelper } from "../helpers";

// Interface for medical history female form data
interface MedicalHistoryFemaleFormData {
  pregnant: "Yes" | "No" | "Do not know";
  menstrualPeriods: "Yes" | "No" | "Do not know";
}

export class MedicalHistoryFemalePage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

  constructor() {
    super("/medical-history-female");
  }

  // Verify Medical History Female Page
  verifyPageLoaded(): MedicalHistoryFemalePage {
    cy.url().should("include", "/medical-history-female");
    cy.get("h1.govuk-heading-l").should("contain", "Medical history: female");
    cy.contains("h2", "Is the visa applicant pregnant?").should("be.visible");
    cy.contains("h2", "Does the visa applicant have menstrual periods?").should("be.visible");
    return this;
  }

  // Select pregnancy status
  selectPregnancyStatus(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    cy.get(`input[name="pregnant"][value="${option}"]`).check({ force: true });
    return this;
  }

  // Alias for selectPregnancyStatus
  selectPregnant(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    return this.selectPregnancyStatus(option);
  }

  // Verify pregnancy status is selected
  verifyPregnancyStatusSelected(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    cy.get(`input[name="pregnant"][value="${option}"]`).should("be.checked");
    return this;
  }

  // Select menstrual periods status
  selectMenstrualPeriods(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    cy.get(`input[name="menstrualPeriods"][value="${option}"]`).check({ force: true });
    return this;
  }

  // Alias for selectMenstrualPeriods
  selectMenstrualPeriodsStatus(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    return this.selectMenstrualPeriods(option);
  }

  // Verify menstrual periods status is selected
  verifyMenstrualPeriodsSelected(option: "Yes" | "No" | "Do not know"): MedicalHistoryFemalePage {
    cy.get(`input[name="menstrualPeriods"][value="${option}"]`).should("be.checked");
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: MedicalHistoryFemaleFormData): MedicalHistoryFemalePage {
    this.selectPregnancyStatus(data.pregnant);
    this.selectMenstrualPeriods(data.menstrualPeriods);
    return this;
  }

  // Fill form with mandatory fields only
  fillMandatoryFields(data: MedicalHistoryFemaleFormData): MedicalHistoryFemalePage {
    return this.fillCompleteForm(data);
  }

  // Form submission methods
  submitForm(): MedicalHistoryFemalePage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Alias for submitForm
  clickSaveAndContinue(): MedicalHistoryFemalePage {
    return this.submitForm();
  }

  // Click the continue button
  clickContinue(): void {
    cy.get('button[type="submit"]').contains("Continue").click();
  }

  // Alternative click continue with return type
  clickContinueButton(): MedicalHistoryFemalePage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Click the back link
  clickBack(): void {
    cy.get(".govuk-back-link").click();
  }

  // Verify redirection to X-ray required page (next page in the flow)
  verifyRedirectedToXrayPage(): MedicalHistoryFemalePage {
    cy.url().should("include", "/is-xray-required");
    return this;
  }

  // Error validation methods
  validateErrorSummaryVisible(): MedicalHistoryFemalePage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorContainsText(text: string): MedicalHistoryFemalePage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  // Individual field error validations
  validatePregnancyFieldError(): MedicalHistoryFemalePage {
    this.error.validateFieldError("pregnant");
    return this;
  }

  validateMenstrualPeriodsFieldError(): MedicalHistoryFemalePage {
    this.error.validateFieldError("menstrual-periods");
    return this;
  }

  // Comprehensive validation method
  validateFormErrors(errors: {
    pregnant?: string;
    menstrualPeriods?: string;
  }): MedicalHistoryFemalePage {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "pregnant":
          this.error.validateFieldError("pregnant", message);
          break;
        case "menstrualPeriods":
          this.error.validateFieldError("menstrual-periods", message);
          break;
      }
    });

    return this;
  }

  // Detailed error message validation
  validateErrorMessage(...expectedTexts: string[]): MedicalHistoryFemalePage {
    this.validateErrorSummaryVisible();

    // Get the error summary list text
    cy.get(".govuk-error-summary__list").then(($list) => {
      const listText = $list.text();

      // Check that each expected text is present in the error summary
      expectedTexts.forEach((expectedText) => {
        cy.wrap(listText).should(
          "include",
          expectedText,
          `Expected error message "${expectedText}" not found in error summary`,
        );
      });
    });

    return this;
  }

  // Verify all required fields are present on the page
  verifyAllFieldsPresent(): MedicalHistoryFemalePage {
    cy.get("#pregnant").should("be.visible");
    cy.get("#menstrual-periods").should("be.visible");
    cy.get('button[type="submit"]').should("be.visible").and("contain", "Continue");
    return this;
  }

  // Verify all pregnancy options are present
  verifyAllPregnancyOptionsPresent(): MedicalHistoryFemalePage {
    const expectedOptions = ["Yes", "No", "Do not know"];

    expectedOptions.forEach((option) => {
      cy.get(`input[name="pregnant"][value="${option}"]`).should("exist");
    });
    return this;
  }

  // Verify all menstrual periods options are present
  verifyAllMenstrualPeriodsOptionsPresent(): MedicalHistoryFemalePage {
    const expectedOptions = ["Yes", "No", "Do not know"];

    expectedOptions.forEach((option) => {
      cy.get(`input[name="menstrualPeriods"][value="${option}"]`).should("exist");
    });
    return this;
  }

  // Verify error messages
  verifyErrorSummary(): MedicalHistoryFemalePage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  verifyErrorMessage(fieldId: string, expectedMessage: string): MedicalHistoryFemalePage {
    cy.get(`#${fieldId}-error`).should("contain.text", expectedMessage);
    return this;
  }

  // Verify field-level error for a specific field
  verifyFieldError(fieldId: string): MedicalHistoryFemalePage {
    cy.get(`#${fieldId}`).should("have.class", "govuk-form-group--error");
    return this;
  }

  // Verify Back link
  verifyBackLink(): MedicalHistoryFemalePage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/record-medical-history-tb-symptoms")
      .and("contain", "Back");
    return this;
  }

  // Verify Service Name
  verifyServiceName(): MedicalHistoryFemalePage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify footer
  verifyFooter(): MedicalHistoryFemalePage {
    cy.get(".govuk-footer").should("be.visible");
    return this;
  }

  // Click the sign out link
  clickSignOut(): void {
    cy.get("#sign-out").click();
  }

  // Verify page heading
  verifyPageHeading(): MedicalHistoryFemalePage {
    cy.get("h1.govuk-heading-l").should("contain", "Medical history: female");
    return this;
  }

  // Verify pregnancy question heading
  verifyPregnancyQuestionVisible(): MedicalHistoryFemalePage {
    cy.contains("h2", "Is the visa applicant pregnant?").should("be.visible");
    return this;
  }

  // Verify menstrual periods question heading
  verifyMenstrualPeriodsQuestionVisible(): MedicalHistoryFemalePage {
    cy.contains("h2", "Does the visa applicant have menstrual periods?").should("be.visible");
    return this;
  }

  // Method to verify all mandatory fields are completed
  verifyMandatoryFieldsCompleted(): MedicalHistoryFemalePage {
    // Verify pregnancy status is selected
    cy.get('input[name="pregnant"]:checked').should("exist");

    // Verify menstrual periods status is selected
    cy.get('input[name="menstrualPeriods"]:checked').should("exist");

    return this;
  }

  // Clear all form fields
  clearAllFields(): MedicalHistoryFemalePage {
    // Uncheck all radio buttons
    cy.get('input[name="pregnant"]:checked').then(($radio) => {
      if ($radio.length > 0) {
        cy.wrap($radio).uncheck({ force: true });
      }
    });

    cy.get('input[name="menstrualPeriods"]:checked').then(($radio) => {
      if ($radio.length > 0) {
        cy.wrap($radio).uncheck({ force: true });
      }
    });

    return this;
  }

  // Verify form validation state
  verifyFormValidationState(data: {
    pregnant?: "Yes" | "No" | "Do not know";
    menstrualPeriods?: "Yes" | "No" | "Do not know";
  }): MedicalHistoryFemalePage {
    if (data.pregnant) {
      this.verifyPregnancyStatusSelected(data.pregnant);
    }

    if (data.menstrualPeriods) {
      this.verifyMenstrualPeriodsSelected(data.menstrualPeriods);
    }

    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): MedicalHistoryFemalePage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyAllFieldsPresent();
    this.verifyAllPregnancyOptionsPresent();
    this.verifyAllMenstrualPeriodsOptionsPresent();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify continue button is visible
  verifyContinueButtonVisible(): MedicalHistoryFemalePage {
    cy.get('button[type="submit"]').should("be.visible").and("contain", "Continue");
    return this;
  }

  // Verify phase banner
  verifyPhaseBanner(): MedicalHistoryFemalePage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag").should("contain", "BETA");
    return this;
  }

  // Verify GOV.UK header
  verifyGovUkHeader(): MedicalHistoryFemalePage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logotype").should("be.visible");
    return this;
  }

  // Verify Sign out link
  verifySignOutLink(): MedicalHistoryFemalePage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }
}
