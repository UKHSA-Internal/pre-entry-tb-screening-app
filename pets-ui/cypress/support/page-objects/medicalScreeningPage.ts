// This holds all fields for the Medical Screening Page
export class MedicalScreeningPage {
  visit(): void {
    cy.visit("/medical-screening");
  }

  verifyPageLoaded(): void {
    cy.contains("h1", "Medical screening").should("be.visible");
  }

  fillAge(age: string): void {
    cy.contains("label", "Applicant age")
      .should("be.visible")
      .siblings(".govuk-input__wrapper")
      .find("input")
      .should("be.visible")
      .clear()
      .type(age);
  }

  selectTbSymptoms(option: string): void {
    cy.get(`input[name="tbSymptoms"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  selectTbSymptomsList(symptoms: string[]): void {
    symptoms.forEach((symptom) => {
      cy.get(`input[name="tbSymptomsList"][value="${symptom}"]`)
        .should("exist")
        .check({ force: true })
        .should("be.checked");
    });
  }

  fillOtherSymptoms(text: string): void {
    cy.contains("label", 'If you have selected "Other symptoms", list these')
      .should("be.visible")
      .siblings("textarea")
      .should("be.visible")
      .clear()
      .type(text);
  }

  selectUnderElevenOption(option: string): void {
    cy.get(`input[name="underElevenConditions"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  fillUnderElevenDetails(text: string): void {
    cy.contains("label", "You can give details of the procedure or condition")
      .should("be.visible")
      .siblings("textarea")
      .should("be.visible")
      .clear()
      .type(text);
  }

  selectPreviousTb(option: string): void {
    cy.get(`input[name="previousTb"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  fillPreviousTbDetails(text: string): void {
    cy.contains("label", "If yes, give details")
      .first()
      .siblings("textarea")
      .should("be.visible")
      .clear()
      .type(text);
  }

  selectCloseContact(option: string): void {
    cy.get(`input[name="closeContactWithTb"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  fillCloseContactDetails(text: string): void {
    cy.contains("label", "If yes, give details")
      .last()
      .siblings("textarea")
      .should("be.visible")
      .clear()
      .type(text);
  }

  selectPregnancyStatus(option: string): void {
    cy.get(`input[name="pregnant"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  selectMenstrualPeriods(option: string): void {
    cy.get(`input[name="menstrualPeriods"][value="${option}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
  }

  fillPhysicalExamNotes(text: string): void {
    cy.contains("label", "Physical examination notes")
      .should("be.visible")
      .siblings("textarea")
      .should("be.visible")
      .clear()
      .type(text);
  }

  submitForm(): void {
    cy.contains("button", "Save and continue").should("be.visible").click();
  }

  verifyRedirectedToSummary(): void {
    cy.url().should("include", "/medical-summary");
  }
  validateErrorSummary(expectedErrors: string[]): void {
    // Verify error summary is visible
    cy.get(".govuk-error-summary").should("be.visible");

    // Verify "There is a problem" header is visible
    cy.get(".govuk-error-summary__title").should("contain.text", "There is a problem");

    // Check each expected error is present in the error summary
    expectedErrors.forEach((errorText) => {
      cy.get(".govuk-error-summary__list").should("contain.text", errorText);
    });
  }

  // Detailed Error validation method
  validateFormErrors(expectedErrorMessages: {
    tbSymptoms?: string;
    previousTb?: string;
    closeContact?: string;
    pregnant?: string;
    menstrualPeriods?: string;
  }): void {
    // Validate TB Symptoms field error
    if (expectedErrorMessages.tbSymptoms) {
      cy.get("#tb-symptoms").should("have.class", "govuk-form-group--error");
      cy.get("#tb-symptoms")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.tbSymptoms);
    }

    // Validate Previous TB field error
    if (expectedErrorMessages.previousTb) {
      cy.get("#previous-tb").should("have.class", "govuk-form-group--error");
      cy.get("#previous-tb")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.previousTb);
    }

    // Validate Close Contact field error
    if (expectedErrorMessages.closeContact) {
      cy.get("#close-contact-with-tb").should("have.class", "govuk-form-group--error");
      cy.get("#close-contact-with-tb")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.closeContact);
    }

    // Validate Pregnancy Status field error
    if (expectedErrorMessages.pregnant) {
      cy.get("#pregnant").should("have.class", "govuk-form-group--error");
      cy.get("#pregnant")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.pregnant);
    }

    // Validate Menstrual Periods field error
    if (expectedErrorMessages.menstrualPeriods) {
      cy.get("#menstrual-periods").should("have.class", "govuk-form-group--error");
      cy.get("#menstrual-periods")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.menstrualPeriods);
    }
  }
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
  //Summary Error
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
  }

  validateErrorContainsText(text: string): void {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
  }

  validateErrorMessage(...expectedTexts: string[]): void {
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
  }

  // Age Field Error
  validateAgeFieldError(): void {
    cy.get("#age").should("have.class", "govuk-form-group--error");
    cy.get("#age").find(".govuk-error-message").should("be.visible");
    cy.get("#age")
      .find(".govuk-error-message")
      .should("contain.text", "Enter applicant's age in years.");
  }

  // Error validation
  validateTbSymptomsFieldError(): void {
    cy.get("#tb-symptoms").should("have.class", "govuk-form-group--error");
    cy.get("#tb-symptoms").find(".govuk-error-message").should("be.visible");
  }

  validatePregnancyFieldError(): void {
    cy.get("#pregnant").should("have.class", "govuk-form-group--error");
    cy.get("#pregnant").find(".govuk-error-message").should("be.visible");
  }

  validateMenstrualPeriodsFieldError(): void {
    cy.get("#menstrual-periods").should("have.class", "govuk-form-group--error");
    cy.get("#menstrual-periods").find(".govuk-error-message").should("be.visible");
  }
}
