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

  // Verify Medical Screening Page
  verifyPageLoaded(): MedicalScreeningPage {
    cy.url().should("include", "/medical-screening");
    cy.get("h1.govuk-heading-l").should("contain", "Medical screening");
    cy.contains(
      "p",
      "Enter the applicant's profile information. You should answer every question.",
    ).should("be.visible");
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
      cy.contains("label", symptom)
        .find('input[type="checkbox"]')
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
    cy.get(`input[name="underElevenConditions"][value="${option}"]`).check({ force: true });
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

  selectPregnancyStatus(option: "Yes" | "No" | "Don't know" | "N/A"): MedicalScreeningPage {
    cy.get(`input[name="pregnant"][value="${option}"]`).check({ force: true });
    return this;
  }

  selectMenstrualPeriods(option: "Yes" | "No" | "N/A"): MedicalScreeningPage {
    cy.get(`input[name="menstrualPeriods"][value="${option}"]`).check({ force: true });
    return this;
  }

  fillPhysicalExamNotes(text: string): MedicalScreeningPage {
    cy.get("#physical-exam-notes-field").clear().type(text);
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
    cy.get('button[type="submit"]').contains("Save and continue").click();
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

  // Verify all form fields are present
  verifyAllFieldsPresent(): MedicalScreeningPage {
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

  // Comprehensive page verification
  verifyAllPageElements(): MedicalScreeningPage {
    this.verifyPageLoaded();
    this.verifyAllFieldsPresent();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }
}
