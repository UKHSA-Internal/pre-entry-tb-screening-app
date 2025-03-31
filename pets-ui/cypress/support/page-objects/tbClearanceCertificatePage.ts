// This holds all fields for the TB Clearance Certificate Page
export class TbClearanceCertificatePage {
  visit(): void {
    cy.visit("/tb-certificate-declaration");
  }

  verifyPageLoaded(): void {
    cy.contains("h1", "Enter TB clearance certificate declaration").should("be.visible");
  }

  // Verify applicant details in summary
  verifySummaryDetails(details: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    Object.entries(details).forEach(([key, value]) => {
      if (value !== undefined) {
        cy.contains("dt.govuk-summary-list__key", key)
          .siblings(".govuk-summary-list__value")
          .should("contain.text", value);
      }
    });
  }

  // TB Clearance Certificate Actions
  selectTbClearanceIssued(option: string): void {
    cy.get(`input[name="isIssued"][value="${option}"]`).should("exist").check({ force: true });
    //verify radio is checked
    cy.get(`input[name="isIssued"]:checked`).should("have.value", option);
  }

  fillPhysicianComments(comments: string): void {
    cy.get('textarea[name="comments"]').should("be.visible").clear().type(comments);
  }

  // TB Certificate Date Actions
  fillTbCertificateDate(day: string, month: string, year: string): void {
    cy.get("#tb-certificate-date-day").should("be.visible").clear().type(day);

    cy.get("#tb-certificate-date-month").should("be.visible").clear().type(month);

    cy.get("#tb-certificate-date-year").should("be.visible").clear().type(year);
  }

  fillTbCertificateNumber(number: string): void {
    cy.get('input[name="certificateNumber"]').should("be.visible").clear().type(number);
  }

  // Form Submission
  submitForm(): void {
    cy.contains("button", "Continue").should("be.visible").click();
  }

  // Complete form with valid data
  fillFormWithValidData(options: {
    clearanceIssued: string;
    physicianComments?: string;
    certificateDay?: string;
    certificateMonth?: string;
    certificateYear?: string;
    certificateNumber?: string;
  }): void {
    this.selectTbClearanceIssued(options.clearanceIssued);

    if (options.physicianComments) {
      this.fillPhysicianComments(options.physicianComments);
    }

    // Only fill certificate details if clearance was issued
    if (options.clearanceIssued === "Yes") {
      if (options.certificateDay && options.certificateMonth && options.certificateYear) {
        this.fillTbCertificateDate(
          options.certificateDay,
          options.certificateMonth,
          options.certificateYear,
        );
      }

      if (options.certificateNumber) {
        this.fillTbCertificateNumber(options.certificateNumber);
      }
    }

    this.submitForm();
  }

  // Error validation methods
  validateErrorSummaryVisible(): void {
    cy.get(".govuk-error-summary").should("be.visible");
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

  // Form field error validations
  validateTbClearanceIssuedFieldError(): void {
    cy.get("#tb-clearance-issued").should("have.class", "govuk-form-group--error");
    cy.get("#tb-clearance-issued").find(".govuk-error-message").should("be.visible");
  }

  validateTbCertificateDateFieldError(): void {
    cy.get("#tb-certificate-date").should("have.class", "govuk-form-group--error");
    cy.get("#tb-certificate-date").find(".govuk-error-message").should("be.visible");
  }

  validateTbCertificateNumberFieldError(): void {
    cy.get("#tb-certificate-number").should("have.class", "govuk-form-group--error");
    cy.get("#tb-certificate-number").find(".govuk-error-message").should("be.visible");
  }

  validatePhysicianCommentsFieldError(): void {
    cy.get("#physician-comments").should("have.class", "govuk-form-group--error");
    cy.get("#physician-comments").find(".govuk-error-message").should("be.visible");
  }

  // Detailed form errors validation
  validateFormErrors(expectedErrorMessages: {
    isIssued?: string;
    comments?: string;
    issueDate?: string;
    certificateNumber?: string;
  }): void {
    // Validate TB Clearance Issued field error
    if (expectedErrorMessages.isIssued) {
      cy.get("#tb-clearance-issued").should("have.class", "govuk-form-group--error");
      cy.get("#tb-clearance-issued")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.isIssued);
    }

    // Validate Physician Comments field error
    if (expectedErrorMessages.comments) {
      cy.get("#physician-comments").should("have.class", "govuk-form-group--error");
      cy.get("#physician-comments")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.comments);
    }

    // Validate TB Certificate Date field error
    if (expectedErrorMessages.issueDate) {
      cy.get("#tb-certificate-date").should("have.class", "govuk-form-group--error");
      cy.get("#tb-certificate-date")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.issueDate);
    }

    // Validate TB Certificate Number field error
    if (expectedErrorMessages.certificateNumber) {
      cy.get("#tb-certificate-number").should("have.class", "govuk-form-group--error");
      cy.get("#tb-certificate-number")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", expectedErrorMessages.certificateNumber);
    }
  }

  // Verify redirection after form submission
  verifyRedirectionAfterSubmit(expectedPath: string): void {
    cy.url().should("include", expectedPath);
  }

  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
}
