//This holds all fields of the TB Clearance Certificate Declaration Page

import { BasePage } from "../BasePage";

// Types for TB certificate form
interface TbCertificateDetails {
  clearanceIssued: "Yes" | "No";
  physicianComments?: string;
  certificateDay?: string;
  certificateMonth?: string;
  certificateYear?: string;
  certificateNumber?: string;
}

// Types for error validation
interface TbCertificateErrors {
  isIssued?: string;
  comments?: string;
  issueDate?: string;
  certificateNumber?: string;
}

export class TbClearanceCertificatePage extends BasePage {
  constructor() {
    super("/tb-certificate-declaration");
  }

  verifyPageLoaded(): TbClearanceCertificatePage {
    super.verifyPageHeading("Enter TB clearance certificate declaration");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify form sections are displayed
  verifyFormSections(): TbClearanceCertificatePage {
    cy.contains("h2", "Has a TB clearance certificate been issued?").should("be.visible");
    cy.contains("h2", "Give further details (optional)").should("be.visible");
    cy.contains("h2", "If a clearance certificate has been issued, give:").should("be.visible");
    cy.contains("h2", "Date of TB clearance certificate").should("be.visible");
    cy.contains("h2", "TB clearance certificate number").should("be.visible");
    return this;
  }

  // TB Clearance Certificate Actions
  selectTbClearanceIssued(option: "Yes" | "No"): TbClearanceCertificatePage {
    cy.get(`input[name="isIssued"][value="${option}"]`).check();
    return this;
  }

  // Verify radio buttons are displayed
  verifyRadioButtonsDisplayed(): TbClearanceCertificatePage {
    cy.get('input[name="isIssued"][value="Yes"]').should("be.visible");
    cy.get('input[name="isIssued"][value="No"]').should("be.visible");
    cy.contains("label", "Yes").should("be.visible");
    cy.contains("label", "No").should("be.visible");
    return this;
  }

  fillPhysicianComments(comments: string): TbClearanceCertificatePage {
    cy.get('textarea[name="comments"]').clear().type(comments);
    return this;
  }

  // TB Certificate Date Actions using data-testid
  fillTbCertificateDate(day: string, month: string, year: string): TbClearanceCertificatePage {
    cy.get('[data-testid="tb-certificate-date-day"]').clear().type(day);
    cy.get('[data-testid="tb-certificate-date-month"]').clear().type(month);
    cy.get('[data-testid="tb-certificate-date-year"]').clear().type(year);
    return this;
  }

  fillTbCertificateNumber(number: string): TbClearanceCertificatePage {
    cy.get('input[name="certificateNumber"]').should("be.visible").clear().type(number);
    return this;
  }

  // Verify date input hint
  verifyDateInputHint(): TbClearanceCertificatePage {
    cy.get("#tb-certificate-date-hint").should("contain.text", "For example, 30 3 2024");
    return this;
  }

  // Verify current radio selection
  verifyRadioSelection(expectedOption: "Yes" | "No"): TbClearanceCertificatePage {
    cy.get(`input[name="isIssued"][value="${expectedOption}"]`).should("be.checked");
    return this;
  }

  // Get current form values
  getCurrentFormValues(): Cypress.Chainable<TbCertificateDetails> {
    return cy.get("body").then(() => {
      // Check if any radio button is selected
      return cy.get('input[name="isIssued"]:checked').then(($checkedRadio) => {
        const isIssued = $checkedRadio.length > 0 ? ($checkedRadio.val() as string) : "";

        return cy
          .get('textarea[name="comments"]')
          .invoke("val")
          .then((comments) => {
            return cy
              .get('[data-testid="tb-certificate-date-day"]')
              .invoke("val")
              .then((day) => {
                return cy
                  .get('[data-testid="tb-certificate-date-month"]')
                  .invoke("val")
                  .then((month) => {
                    return cy
                      .get('[data-testid="tb-certificate-date-year"]')
                      .invoke("val")
                      .then((year) => {
                        return cy
                          .get('input[name="certificateNumber"]')
                          .invoke("val")
                          .then((certNumber) => {
                            const result: TbCertificateDetails = {
                              clearanceIssued: isIssued as "Yes" | "No",
                              physicianComments: comments ? String(comments) : undefined,
                              certificateDay: day ? String(day) : undefined,
                              certificateMonth: month ? String(month) : undefined,
                              certificateYear: year ? String(year) : undefined,
                              certificateNumber: certNumber ? String(certNumber) : undefined,
                            };
                            return result;
                          });
                      });
                  });
              });
          });
      });
    });
  }

  // Complete form with valid data
  fillFormWithValidData(options: TbCertificateDetails): TbClearanceCertificatePage {
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

    return this;
  }

  // Submit form
  clickContinue(): TbClearanceCertificatePage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Enhanced error validation
  validateFormErrors(expectedErrorMessages: TbCertificateErrors): TbClearanceCertificatePage {
    if (expectedErrorMessages.isIssued) {
      this.validateFieldError("tb-clearance-issued", expectedErrorMessages.isIssued);
    }

    if (expectedErrorMessages.comments) {
      this.validateFieldError("physician-comments", expectedErrorMessages.comments);
    }

    if (expectedErrorMessages.issueDate) {
      this.validateFieldError("tb-certificate-date", expectedErrorMessages.issueDate);
    }

    if (expectedErrorMessages.certificateNumber) {
      this.validateFieldError("tb-certificate-number", expectedErrorMessages.certificateNumber);
    }

    return this;
  }

  // Verify form validation when submitting empty form
  verifyFormValidationForEmptyForm(): TbClearanceCertificatePage {
    this.clickContinue();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): TbClearanceCertificatePage {
    this.clickContinue();
    this.verifyUrlContains("/tb-certificate-summary");
    return this;
  }

  // Submit form with data and continue
  submitFormWithData(options: TbCertificateDetails): TbClearanceCertificatePage {
    this.fillFormWithValidData(options);
    this.clickContinue();
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): TbClearanceCertificatePage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbClearanceCertificatePage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify continue button is displayed
  verifyContinueButton(): TbClearanceCertificatePage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify all form fields are empty (initial state)
  verifyAllFieldsEmpty(): TbClearanceCertificatePage {
    cy.get('input[name="isIssued"]:checked').should("not.exist");
    cy.get('textarea[name="comments"]').should("have.value", "");
    cy.get('[data-testid="tb-certificate-date-day"]').should("have.value", "");
    cy.get('[data-testid="tb-certificate-date-month"]').should("have.value", "");
    cy.get('[data-testid="tb-certificate-date-year"]').should("have.value", "");
    cy.get('input[name="certificateNumber"]').should("have.value", "");
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(expectedData: TbCertificateDetails): TbClearanceCertificatePage {
    if (expectedData.clearanceIssued) {
      this.verifyRadioSelection(expectedData.clearanceIssued);
    }

    if (expectedData.physicianComments) {
      cy.get('textarea[name="comments"]').should("have.value", expectedData.physicianComments);
    }

    if (expectedData.certificateDay) {
      cy.get('[data-testid="tb-certificate-date-day"]').should(
        "have.value",
        expectedData.certificateDay,
      );
    }

    if (expectedData.certificateMonth) {
      cy.get('[data-testid="tb-certificate-date-month"]').should(
        "have.value",
        expectedData.certificateMonth,
      );
    }

    if (expectedData.certificateYear) {
      cy.get('[data-testid="tb-certificate-date-year"]').should(
        "have.value",
        expectedData.certificateYear,
      );
    }

    if (expectedData.certificateNumber) {
      cy.get('input[name="certificateNumber"]').should(
        "have.value",
        expectedData.certificateNumber,
      );
    }

    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): TbClearanceCertificatePage {
    this.verifyPageLoaded();
    this.verifyFormSections();
    this.verifyRadioButtonsDisplayed();
    this.verifyDateInputHint();
    this.verifyContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
