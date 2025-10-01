// This holds all fields of the Medical Screening Page

import { BasePage } from "../BasePage";

// Interface for medical screening form data
interface MedicalScreeningFormData {
  screeningDate?: {
    day: string;
    month: string;
    year: string;
  };
  age: string;
  tbSymptoms: "Yes" | "No";
  tbSymptomsList?: string[];
  otherSymptoms?: string;
  underElevenConditions?: string[];
  underElevenConditionsDetail?: string;
  previousTb: "Yes" | "No";
  previousTbDetails?: string;
  closeContactWithTb: "Yes" | "No";
  closeContactDetails?: string;
  pregnant: "Yes" | "No" | "Do not know" | "Not applicable - the visa applicant is not female";
  menstrualPeriods:
    | "Yes"
    | "No"
    | "Do not know"
    | "Not applicable - the visa applicant is not female";
  physicalExamNotes: string;
}

export class MedicalScreeningPage extends BasePage {
  constructor() {
    super("/medical-screening");
  }

  // Verify Medical Screening Page
  verifyPageLoaded(): MedicalScreeningPage {
    cy.url().should("include", "/medical-screening");
    cy.get("h1.govuk-heading-l").should("contain", "Record medical history and TB symptoms");
    return this;
  }

  // Medical Screening Completion Date methods
  fillScreeningDate(day: string, month: string, year: string): MedicalScreeningPage {
    cy.get("#medical-screening-completion-date-day").clear().type(day);
    cy.get("#medical-screening-completion-date-month").clear().type(month);
    cy.get("#medical-screening-completion-date-year").clear().type(year);
    return this;
  }

  setScreeningDateToToday(): MedicalScreeningPage {
    cy.get('[data-testid="medical-screening-completion-date-quickfill-today"]').click();
    return this;
  }

  setScreeningDateToYesterday(): MedicalScreeningPage {
    cy.get('[data-testid="medical-screening-completion-date-quickfill-yesterday"]').click();
    return this;
  }

  verifyScreeningDateFieldsVisible(): MedicalScreeningPage {
    cy.get("#medical-screening-completion-date-day").should("be.visible");
    cy.get("#medical-screening-completion-date-month").should("be.visible");
    cy.get("#medical-screening-completion-date-year").should("be.visible");
    return this;
  }

  // Fill in form with valid data
  fillAge(age: string): MedicalScreeningPage {
    cy.get("#age-field").clear().type(age);
    return this;
  }

  selectTbSymptoms(option: "Yes" | "No"): MedicalScreeningPage {
    cy.get(`input[name="tbSymptoms"][value="${option}"]`).check({ force: true });
    return this;
  }

  selectTbSymptomsList(symptoms: string[]): MedicalScreeningPage {
    symptoms.forEach((symptom) => {
      cy.get(`input[name="tbSymptomsList"][value="${symptom}"]`)
        .should("exist")
        .check({ force: true })
        .should("be.checked");
    });
    return this;
  }

  fillOtherSymptoms(text: string): MedicalScreeningPage {
    cy.get("#other-symptoms-detail-field").clear().type(text);
    return this;
  }

  selectUnderElevenOption(option: string): MedicalScreeningPage {
    cy.get(`input[name="underElevenConditions"][value="${option}"]`)
      .should("exist")
      .check({ force: true });
    return this;
  }

  fillUnderElevenDetails(text: string): MedicalScreeningPage {
    cy.get("#under-eleven-conditions-detail-field").clear().type(text);
    return this;
  }

  selectPreviousTb(option: "Yes" | "No"): MedicalScreeningPage {
    cy.get(`input[name="previousTb"][value="${option}"]`).check({ force: true });
    return this;
  }

  fillPreviousTbDetails(text: string): MedicalScreeningPage {
    cy.get("#previous-tb-detail-field").clear().type(text);
    return this;
  }

  selectCloseContact(option: "Yes" | "No"): MedicalScreeningPage {
    cy.get(`input[name="closeContactWithTb"][value="${option}"]`).check({ force: true });
    return this;
  }

  fillCloseContactDetails(text: string): MedicalScreeningPage {
    cy.get("#close-contact-with-tb-detail-field").clear().type(text);
    return this;
  }

  selectPregnancyStatus(
    option: "Yes" | "No" | "Do not know" | "Not applicable - the visa applicant is not female",
  ): MedicalScreeningPage {
    cy.get(`input[name="pregnant"][value="${option}"]`).check({ force: true });
    return this;
  }

  selectMenstrualPeriods(
    option: "Yes" | "No" | "Do not know" | "Not applicable - the visa applicant is not female",
  ): MedicalScreeningPage {
    cy.get(`input[name="menstrualPeriods"][value="${option}"]`).check({ force: true });
    return this;
  }

  fillPhysicalExamNotes(text: string): MedicalScreeningPage {
    cy.get("#physical-exam-notes-field").clear().type(text);
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: MedicalScreeningFormData): MedicalScreeningPage {
    if (data.screeningDate) {
      this.fillScreeningDate(
        data.screeningDate.day,
        data.screeningDate.month,
        data.screeningDate.year,
      );
    }

    this.fillAge(data.age);
    this.selectTbSymptoms(data.tbSymptoms);

    if (data.tbSymptoms === "Yes" && data.tbSymptomsList && data.tbSymptomsList.length > 0) {
      this.selectTbSymptomsList(data.tbSymptomsList);

      if (data.otherSymptoms) {
        this.fillOtherSymptoms(data.otherSymptoms);
      }
    }

    if (data.underElevenConditions && data.underElevenConditions.length > 0) {
      data.underElevenConditions.forEach((condition) => {
        this.selectUnderElevenOption(condition);
      });

      if (data.underElevenConditionsDetail) {
        this.fillUnderElevenDetails(data.underElevenConditionsDetail);
      }
    }

    this.selectPreviousTb(data.previousTb);

    if (data.previousTb === "Yes" && data.previousTbDetails) {
      this.fillPreviousTbDetails(data.previousTbDetails);
    }

    this.selectCloseContact(data.closeContactWithTb);

    if (data.closeContactWithTb === "Yes" && data.closeContactDetails) {
      this.fillCloseContactDetails(data.closeContactDetails);
    }

    this.selectPregnancyStatus(data.pregnant);
    this.selectMenstrualPeriods(data.menstrualPeriods);
    this.fillPhysicalExamNotes(data.physicalExamNotes);

    return this;
  }

  // Form submission
  submitForm(): MedicalScreeningPage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Verify redirection to Medical Summary Page
  verifyRedirectedToSummary(): MedicalScreeningPage {
    cy.url().should("include", "/medical-summary");
    return this;
  }

  // Error validation
  validateErrorSummaryVisible(): MedicalScreeningPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorContainsText(text: string): MedicalScreeningPage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  // Individual field error validations
  validateScreeningDateFieldError(): MedicalScreeningPage {
    this.validateFieldError("medical-screening-completion-date");
    return this;
  }

  validateAgeFieldError(): MedicalScreeningPage {
    this.validateFieldError("age");
    return this;
  }

  validateTbSymptomsFieldError(): MedicalScreeningPage {
    this.validateFieldError("tb-symptoms");
    return this;
  }

  validateTbSymptomsListFieldError(): MedicalScreeningPage {
    this.validateFieldError("tb-symptoms-list");
    return this;
  }

  validateUnderElevenConditionsFieldError(): MedicalScreeningPage {
    this.validateFieldError("under-eleven-conditions");
    return this;
  }

  validatePreviousTbFieldError(): MedicalScreeningPage {
    this.validateFieldError("previous-tb");
    return this;
  }

  validateCloseContactFieldError(): MedicalScreeningPage {
    this.validateFieldError("close-contact-with-tb");
    return this;
  }

  validatePregnancyFieldError(): MedicalScreeningPage {
    this.validateFieldError("pregnant");
    return this;
  }

  validateMenstrualPeriodsFieldError(): MedicalScreeningPage {
    this.validateFieldError("menstrual-periods");
    return this;
  }

  // Comprehensive validation method
  validateFormErrors(errors: {
    screeningDate?: string;
    age?: string;
    tbSymptoms?: string;
    tbSymptomsList?: string;
    underElevenConditions?: string;
    previousTb?: string;
    closeContact?: string;
    pregnant?: string;
    menstrualPeriods?: string;
  }): MedicalScreeningPage {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "screeningDate":
          this.validateFieldError("medical-screening-completion-date", message);
          break;
        case "age":
          this.validateFieldError("age", message);
          break;
        case "tbSymptoms":
          this.validateFieldError("tb-symptoms", message);
          break;
        case "tbSymptomsList":
          this.validateFieldError("tb-symptoms-list", message);
          break;
        case "underElevenConditions":
          this.validateFieldError("under-eleven-conditions", message);
          break;
        case "previousTb":
          this.validateFieldError("previous-tb", message);
          break;
        case "closeContact":
          this.validateFieldError("close-contact-with-tb", message);
          break;
        case "pregnant":
          this.validateFieldError("pregnant", message);
          break;
        case "menstrualPeriods":
          this.validateFieldError("menstrual-periods", message);
          break;
      }
    });

    return this;
  }

  // Detailed error message validation
  validateErrorMessage(...expectedTexts: string[]): MedicalScreeningPage {
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

  // Verify all form fields are present
  verifyAllFieldsPresent(): MedicalScreeningPage {
    cy.get("#medical-screening-completion-date-day").should("be.visible");
    cy.get("#medical-screening-completion-date-month").should("be.visible");
    cy.get("#medical-screening-completion-date-year").should("be.visible");
    cy.get("#age-field").should("be.visible");
    cy.get('input[name="tbSymptoms"]').should("exist");
    cy.get('input[name="previousTb"]').should("exist");
    cy.get('input[name="closeContactWithTb"]').should("exist");
    cy.get('input[name="pregnant"]').should("exist");
    cy.get('input[name="menstrualPeriods"]').should("exist");
    cy.get("#physical-exam-notes-field").should("be.visible");
    return this;
  }

  // Verify back link
  verifyBackLink(): MedicalScreeningPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/tracker")
      .and("contain", "Back");
    return this;
  }

  // Verify service name
  verifyServiceName(): MedicalScreeningPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Method for selecting child TB history - maps to under eleven conditions
  selectChildTbHistory(option: string): MedicalScreeningPage {
    cy.get(`input[name="underElevenConditions"][value="${option}"]`)
      .should("exist")
      .check({ force: true });
    return this;
  }

  // More specific method for under eleven conditions with better naming
  selectUnderElevenConditions(condition: string): MedicalScreeningPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`)
      .should("exist")
      .check({ force: true });
    return this;
  }

  // Method to select multiple under eleven conditions
  selectMultipleUnderElevenConditions(conditions: string[]): MedicalScreeningPage {
    conditions.forEach((condition) => {
      cy.get(`input[name="underElevenConditions"][value="${condition}"]`)
        .should("exist")
        .check({ force: true });
    });
    return this;
  }

  // Verification methods for under eleven conditions
  verifyUnderElevenConditionsVisible(): MedicalScreeningPage {
    cy.get("#under-eleven-conditions").should("be.visible");
    cy.contains("If the visa applicant is a child aged 11 or under, have they ever had:").should(
      "be.visible",
    );
    return this;
  }

  verifyUnderElevenConditionSelected(condition: string): MedicalScreeningPage {
    cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("be.checked");
    return this;
  }

  // Method to verify all under eleven condition options are present
  verifyAllUnderElevenConditionsPresent(): MedicalScreeningPage {
    const expectedConditions = [
      "Thoracic surgery",
      "Cyanosis",
      "Chronic respiratory disease",
      "Respiratory insufficiency that limits activity",
      "None of these",
      "Not applicable - applicant is aged 11 or over",
    ];

    expectedConditions.forEach((condition) => {
      cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("exist");
    });
    return this;
  }

  // Method to clear all under eleven conditions
  clearAllUnderElevenConditions(): MedicalScreeningPage {
    cy.get('input[name="underElevenConditions"]:checked').each(($el) => {
      cy.wrap($el).uncheck({ force: true });
    });
    return this;
  }

  // Enhanced method for TB symptoms list with better verification
  selectTbSymptomsListWithVerification(symptoms: string[]): MedicalScreeningPage {
    symptoms.forEach((symptom) => {
      cy.get(`input[name="tbSymptomsList"][value="${symptom}"]`)
        .should("exist")
        .check({ force: true })
        .should("be.checked");

      // Log for debugging
      cy.log(`Selected TB symptom: ${symptom}`);
    });
    return this;
  }

  // Method to verify all TB symptoms options are present
  verifyAllTbSymptomsPresent(): MedicalScreeningPage {
    const expectedSymptoms = [
      "Cough",
      "Night sweats",
      "Haemoptysis (coughing up blood)",
      "Weight loss",
      "Fever",
      "Other symptoms",
    ];

    expectedSymptoms.forEach((symptom) => {
      cy.get(`input[name="tbSymptomsList"][value="${symptom}"]`).should("exist");
    });
    return this;
  }

  // Method to verify TB symptoms conditional display
  verifyTbSymptomsListVisibility(shouldBeVisible: boolean): MedicalScreeningPage {
    if (shouldBeVisible) {
      cy.get("#tb-symptoms-list").should("be.visible");
    } else {
      cy.get("#tb-symptoms-list").should("not.be.visible");
    }
    return this;
  }

  // Method to verify conditional fields based on age
  verifyConditionalFieldsForAge(age: number): MedicalScreeningPage {
    if (age <= 11) {
      this.verifyUnderElevenConditionsVisible();
    } else {
      // For adults, "Not applicable" should be available for under eleven conditions
      cy.get(
        'input[name="underElevenConditions"][value="Not applicable - applicant is aged 11 or over"]',
      ).should("exist");
    }
    return this;
  }

  // Enhanced form validation for child-specific scenarios
  validateChildFormData(data: {
    screeningDate?: { day: string; month: string; year: string };
    age: string;
    tbSymptoms: "Yes" | "No";
    underElevenConditions?: string[];
    previousTb: "Yes" | "No";
    closeContactWithTb: "Yes" | "No";
    pregnant: "Not applicable - the visa applicant is not female";
    menstrualPeriods: "Not applicable - the visa applicant is not female";
    physicalExamNotes?: string;
  }): MedicalScreeningPage {
    // Verify screening date if provided
    if (data.screeningDate) {
      cy.get("#medical-screening-completion-date-day").should("have.value", data.screeningDate.day);
      cy.get("#medical-screening-completion-date-month").should(
        "have.value",
        data.screeningDate.month,
      );
      cy.get("#medical-screening-completion-date-year").should(
        "have.value",
        data.screeningDate.year,
      );
    }

    // Verify age field
    cy.get("#age-field").should("have.value", data.age);

    // Verify TB symptoms selection
    cy.get(`input[name="tbSymptoms"][value="${data.tbSymptoms}"]`).should("be.checked");

    // Verify under eleven conditions if specified
    if (data.underElevenConditions) {
      data.underElevenConditions.forEach((condition) => {
        cy.get(`input[name="underElevenConditions"][value="${condition}"]`).should("be.checked");
      });
    }

    // Verify TB history
    cy.get(`input[name="previousTb"][value="${data.previousTb}"]`).should("be.checked");

    // Verify close contact
    cy.get(`input[name="closeContactWithTb"][value="${data.closeContactWithTb}"]`).should(
      "be.checked",
    );

    // Verify pregnancy status (should be N/A for children)
    cy.get(`input[name="pregnant"][value="${data.pregnant}"]`).should("be.checked");

    // Verify menstrual periods (should be N/A for children)
    cy.get(`input[name="menstrualPeriods"][value="${data.menstrualPeriods}"]`).should("be.checked");

    // Verify physical exam notes if provided
    if (data.physicalExamNotes) {
      cy.get("#physical-exam-notes-field").should("contain.value", data.physicalExamNotes);
    }

    return this;
  }

  // Method to fill form specifically for child applicants
  fillChildForm(data: {
    screeningDate?: { day: string; month: string; year: string };
    age: string;
    tbSymptoms: "Yes" | "No";
    underElevenConditions: string[];
    previousTb: "Yes" | "No";
    closeContactWithTb: "Yes" | "No";
    physicalExamNotes?: string;
  }): MedicalScreeningPage {
    if (data.screeningDate) {
      this.fillScreeningDate(
        data.screeningDate.day,
        data.screeningDate.month,
        data.screeningDate.year,
      );
    }

    this.fillAge(data.age);
    this.selectTbSymptoms(data.tbSymptoms);
    this.selectMultipleUnderElevenConditions(data.underElevenConditions);
    this.selectPreviousTb(data.previousTb);
    this.selectCloseContact(data.closeContactWithTb);
    this.selectPregnancyStatus("Not applicable - the visa applicant is not female");
    this.selectMenstrualPeriods("Not applicable - the visa applicant is not female");

    if (data.physicalExamNotes) {
      this.fillPhysicalExamNotes(data.physicalExamNotes);
    }

    return this;
  }

  // Method to verify form state after conditional selections
  verifyFormStateAfterSelection(): MedicalScreeningPage {
    // Check if TB symptoms "Yes" is selected, then symptoms list should be visible
    cy.get('input[name="tbSymptoms"]:checked').then(($selected) => {
      if ($selected.val() === "Yes") {
        cy.get("#tb-symptoms-list").should("be.visible");
      }
    });

    // Check if previous TB "Yes" is selected, then detail field should be available
    cy.get('input[name="previousTb"]:checked').then(($selected) => {
      if ($selected.val() === "Yes") {
        cy.get("#previous-tb-detail").should("be.visible");
      }
    });

    // Check if close contact "Yes" is selected, then detail field should be available
    cy.get('input[name="closeContactWithTb"]:checked').then(($selected) => {
      if ($selected.val() === "Yes") {
        cy.get("#close-contact-with-tb-detail").should("be.visible");
      }
    });

    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): MedicalScreeningPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }
}
