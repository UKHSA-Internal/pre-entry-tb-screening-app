import { BasePage } from "../BasePage";

// Interface for medical screening form data
interface MedicalScreeningFormData {
  age: string;
  tbSymptoms: "Yes" | "No";
  tbSymptomsList?: string[];
  otherSymptoms?: string;
  previousTb: "Yes" | "No";
  previousTbDetails?: string;
  closeContactWithTb: "Yes" | "No";
  closeContactDetails?: string;
  pregnant: "Yes" | "No" | "Don't know" | "N/A";
  menstrualPeriods: "Yes" | "No" | "N/A";
  physicalExamNotes: string;
}

export class MedicalScreeningPage extends BasePage {
  constructor() {
    super("/medical-screening");
  }

  verifyPageLoaded(): MedicalScreeningPage {
    this.verifyPageHeading("Medical screening");
    return this;
  }

  fillAge(age: string): MedicalScreeningPage {
    this.fillTextInput("Applicant age", age);
    return this;
  }

  selectTbSymptoms(option: "Yes" | "No"): MedicalScreeningPage {
    this.checkRadio("tbSymptoms", option);
    return this;
  }

  selectTbSymptomsList(symptoms: string[]): MedicalScreeningPage {
    symptoms.forEach((symptom) => {
      cy.contains("label", symptom)
        .find('input[type="checkbox"]')
        .should("exist")
        .check({ force: true })
        .should("be.checked");
    });
    return this;
  }

  fillOtherSymptoms(text: string): MedicalScreeningPage {
    this.fillTextarea('If you have selected "Other symptoms", list these', text);
    return this;
  }

  selectUnderElevenOption(option: string): MedicalScreeningPage {
    this.checkRadio("underElevenConditions", option);
    return this;
  }

  fillUnderElevenDetails(text: string): MedicalScreeningPage {
    this.fillTextarea("You can give details of the procedure or condition", text);
    return this;
  }

  selectPreviousTb(option: "Yes" | "No"): MedicalScreeningPage {
    this.checkRadio("previousTb", option);
    return this;
  }

  fillPreviousTbDetails(text: string): MedicalScreeningPage {
    cy.contains("fieldset", "Has the applicant ever had tuberculosis?")
      .contains("label", "If yes, give details")
      .parent()
      .find("textarea")
      .should("be.visible")
      .clear()
      .type(text);
    return this;
  }

  selectCloseContact(option: "Yes" | "No"): MedicalScreeningPage {
    this.checkRadio("closeContactWithTb", option);
    return this;
  }

  fillCloseContactDetails(text: string): MedicalScreeningPage {
    cy.contains("fieldset", "active pulmonary tuberculosis")
      .contains("label", "If yes, give details")
      .parent()
      .find("textarea")
      .should("be.visible")
      .clear()
      .type(text);
    return this;
  }

  selectPregnancyStatus(option: "Yes" | "No" | "Don't know" | "N/A"): MedicalScreeningPage {
    this.checkRadio("pregnant", option);
    return this;
  }

  selectMenstrualPeriods(option: "Yes" | "No" | "N/A"): MedicalScreeningPage {
    this.checkRadio("menstrualPeriods", option);
    return this;
  }

  fillPhysicalExamNotes(text: string): MedicalScreeningPage {
    this.fillTextarea("Physical examination notes", text);
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: MedicalScreeningFormData): MedicalScreeningPage {
    this.fillAge(data.age);
    this.selectTbSymptoms(data.tbSymptoms);

    if (data.tbSymptoms === "Yes" && data.tbSymptomsList && data.tbSymptomsList.length > 0) {
      this.selectTbSymptomsList(data.tbSymptomsList);

      if (data.otherSymptoms) {
        this.fillOtherSymptoms(data.otherSymptoms);
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
    super.submitForm("Save and continue");
    return this;
  }

  // Check redirection
  verifyRedirectedToSummary(): MedicalScreeningPage {
    this.verifyUrlContains("/medical-summary");
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
  validateAgeFieldError(): MedicalScreeningPage {
    this.validateFieldError("age");
    return this;
  }

  validateTbSymptomsFieldError(): MedicalScreeningPage {
    this.validateFieldError("tb-symptoms");
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
    age?: string;
    tbSymptoms?: string;
    previousTb?: string;
    closeContact?: string;
    pregnant?: string;
    menstrualPeriods?: string;
  }): MedicalScreeningPage {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "age":
          this.validateFieldError("age", message);
          break;
        case "tbSymptoms":
          this.validateFieldError("tb-symptoms", message);
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
}
