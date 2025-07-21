//This holds all fields of the TB Certificate Declaration Page

import { BasePage } from "../BasePage";

// Types for TB certificate declaration form
interface TbCertificateDeclarationDetails {
  declaringPhysicianName: string;
  physicianComments?: string;
}

// Types for clinic information (read-only)
interface ClinicInformation {
  clinicName: string;
  certificateReferenceNumber: string;
  certificateIssueDate: string;
  certificateIssueExpiry: string;
}

// Types for error validation
interface TbCertificateDeclarationErrors {
  declaringPhysicianName?: string;
  physicianComments?: string;
}

export class TbCertificateDeclarationPage extends BasePage {
  constructor() {
    super("/tb-certificate-declaration");
  }

  verifyPageLoaded(): TbCertificateDeclarationPage {
    cy.url().should("include", "/tb-certificate-declaration");
    cy.get("h1").should("contain", "Enter clinic and certificate information");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify summary list with clinic information is displayed
  verifyClinicInformationSummary(): TbCertificateDeclarationPage {
    cy.get(".govuk-summary-list").should("be.visible");
    cy.get(".govuk-summary-list__row").should("have.length", 4);
    return this;
  }

  // Verify specific clinic information fields are present
  verifyClinicInformationFields(): TbCertificateDeclarationPage {
    cy.contains("dt.govuk-summary-list__key", "Clinic name").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate reference number").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate issue date").should("be.visible");
    cy.contains("dt.govuk-summary-list__key", "Certificate issue expiry").should("be.visible");
    return this;
  }

  // Get clinic information from summary list
  getClinicInformation(): Cypress.Chainable<ClinicInformation> {
    return cy.get(".govuk-summary-list").then(() => {
      return cy.get(".govuk-summary-list__row").then(($rows) => {
        const clinicInfo: ClinicInformation = {
          clinicName: "",
          certificateReferenceNumber: "",
          certificateIssueDate: "",
          certificateIssueExpiry: "",
        };

        $rows.each((_, row) => {
          const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
          const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();

          switch (key) {
            case "Clinic name":
              clinicInfo.clinicName = value;
              break;
            case "Certificate reference number":
              clinicInfo.certificateReferenceNumber = value;
              break;
            case "Certificate issue date":
              clinicInfo.certificateIssueDate = value;
              break;
            case "Certificate issue expiry":
              clinicInfo.certificateIssueExpiry = value;
              break;
          }
        });

        return clinicInfo;
      });
    });
  }

  // Helper method to verify summary values
  verifySummaryValue(key: string, expectedValue: string): TbCertificateDeclarationPage {
    cy.contains("dt.govuk-summary-list__key", key)
      .siblings(".govuk-summary-list__value")
      .should("contain", expectedValue);
    return this;
  }

  // Verify specific clinic information values
  verifyClinicInformation(expectedInfo: Partial<ClinicInformation>): TbCertificateDeclarationPage {
    if (expectedInfo.clinicName) {
      this.verifySummaryValue("Clinic name", expectedInfo.clinicName);
    }
    if (expectedInfo.certificateReferenceNumber) {
      this.verifySummaryValue(
        "Certificate reference number",
        expectedInfo.certificateReferenceNumber,
      );
    }
    if (expectedInfo.certificateIssueDate) {
      this.verifySummaryValue("Certificate issue date", expectedInfo.certificateIssueDate);
    }
    if (expectedInfo.certificateIssueExpiry) {
      this.verifySummaryValue("Certificate issue expiry", expectedInfo.certificateIssueExpiry);
    }
    return this;
  }

  // Verify form sections
  verifyFormSections(): TbCertificateDeclarationPage {
    cy.contains("label", "Declaring Physician's name").should("be.visible");
    cy.contains("label", "Physician's notes (optional)").should("be.visible");

    // Check for the form fields
    cy.get('input[name="declaringPhysicianName"]').should("be.visible");
    cy.get('textarea[name="comments"]').should("be.visible");
    return this;
  }

  // Fill declaring physician's name
  fillDeclaringPhysicianName(name: string): TbCertificateDeclarationPage {
    cy.get('input[name="declaringPhysicianName"]').should("be.visible").clear().type(name);
    return this;
  }

  // Fill physician's comments (optional)
  fillPhysicianComments(comments: string): TbCertificateDeclarationPage {
    cy.get('textarea[name="comments"]').should("be.visible").clear().type(comments);
    return this;
  }

  // Verify form fields using data-testid attributes
  verifyFormFieldsWithTestIds(): TbCertificateDeclarationPage {
    cy.get('[data-testid="declaring-physician-name"]').should("be.visible");
    cy.get('[data-testid="physician-comments"]').should("be.visible");
    return this;
  }

  // Verify field labels and structure
  verifyFieldLabelsAndStructure(): TbCertificateDeclarationPage {
    // Verify declaring physician name field structure
    cy.contains("label", "Declaring Physician's name").should("be.visible");
    cy.get('input[name="declaringPhysicianName"]')
      .should("be.visible")
      .and("have.attr", "type", "text");

    // Verify physician comments field structure
    cy.contains("label", "Physician's notes (optional)").should("be.visible");
    cy.get('textarea[name="comments"]').should("be.visible");

    return this;
  }

  // Get current form values
  getCurrentFormValues(): Cypress.Chainable<TbCertificateDeclarationDetails> {
    return cy
      .get('input[name="declaringPhysicianName"]')
      .invoke("val")
      .then((physicianName) => {
        return cy
          .get('textarea[name="comments"]')
          .invoke("val")
          .then((comments) => {
            const result: TbCertificateDeclarationDetails = {
              declaringPhysicianName: String(physicianName || ""),
              physicianComments: comments ? String(comments) : undefined,
            };
            return result;
          });
      });
  }

  // Complete form with valid data
  fillFormWithValidData(options: TbCertificateDeclarationDetails): TbCertificateDeclarationPage {
    this.fillDeclaringPhysicianName(options.declaringPhysicianName);

    if (options.physicianComments) {
      this.fillPhysicianComments(options.physicianComments);
    }

    return this;
  }

  // Submit form
  clickContinue(): TbCertificateDeclarationPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Enhanced error validation
  validateFormErrors(
    expectedErrorMessages: TbCertificateDeclarationErrors,
  ): TbCertificateDeclarationPage {
    if (expectedErrorMessages.declaringPhysicianName) {
      this.validateFieldError(
        "declaring-physician-name",
        expectedErrorMessages.declaringPhysicianName,
      );
    }

    if (expectedErrorMessages.physicianComments) {
      this.validateFieldError("physician-comments", expectedErrorMessages.physicianComments);
    }

    return this;
  }

  // Verify form validation when submitting empty form
  verifyFormValidationForEmptyForm(): TbCertificateDeclarationPage {
    this.clickContinue();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Submit form and verify redirection
  submitAndVerifyRedirection(): TbCertificateDeclarationPage {
    this.clickContinue();
    this.verifyUrlContains("/tb-certificate-summary");
    return this;
  }

  // Submit form with data and continue
  submitFormWithData(options: TbCertificateDeclarationDetails): TbCertificateDeclarationPage {
    this.fillFormWithValidData(options);
    this.clickContinue();
    return this;
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): TbCertificateDeclarationPage {
    cy.get(".govuk-breadcrumbs").should("exist");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateDeclarationPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
    return this;
  }

  // Verify continue button is displayed
  verifyContinueButton(): TbCertificateDeclarationPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify all form fields are empty (initial state)
  verifyAllFieldsEmpty(): TbCertificateDeclarationPage {
    cy.get('input[name="declaringPhysicianName"]').should("have.value", "");
    cy.get('textarea[name="comments"]').should("have.value", "");
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(
    expectedData: TbCertificateDeclarationDetails,
  ): TbCertificateDeclarationPage {
    cy.get('input[name="declaringPhysicianName"]').should(
      "have.value",
      expectedData.declaringPhysicianName,
    );

    if (expectedData.physicianComments) {
      cy.get('textarea[name="comments"]').should("have.value", expectedData.physicianComments);
    }

    return this;
  }

  // Verify form group styling and structure
  verifyFormGroupStructure(): TbCertificateDeclarationPage {
    cy.get(".govuk-form-group").should("exist");
    cy.get(".govuk-input").should("be.visible");
    cy.get(".govuk-textarea").should("be.visible");
    return this;
  }

  // Verify input field attributes
  verifyInputFieldAttributes(): TbCertificateDeclarationPage {
    // Verify declaring physician name input
    cy.get('input[name="declaringPhysicianName"]')
      .should("have.attr", "type", "text")
      .and("have.attr", "data-testid", "declaring-physician-name");

    // Verify physician comments textarea
    cy.get('textarea[name="comments"]').should("have.attr", "data-testid", "physician-comments");

    return this;
  }

  // Verify expected clinic information is displayed
  verifyExpectedClinicInformation(): TbCertificateDeclarationPage {
    this.verifyClinicInformation({
      clinicName: "Lakeside Medical & TB Screening Centre",
    });
    // Verify TB certificate reference number and dates exist
    cy.contains("dt.govuk-summary-list__key", "Certificate reference number")
      .siblings(".govuk-summary-list__value")
      .should("not.be.empty");
    cy.contains("dt.govuk-summary-list__key", "Certificate issue date")
      .siblings(".govuk-summary-list__value")
      .should("not.be.empty");
    cy.contains("dt.govuk-summary-list__key", "Certificate issue expiry")
      .siblings(".govuk-summary-list__value")
      .should("not.be.empty");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): TbCertificateDeclarationPage {
    this.verifyPageLoaded();
    this.verifyClinicInformationSummary();
    this.verifyClinicInformationFields();
    this.verifyFormSections();
    this.verifyFormFieldsWithTestIds();
    this.verifyFieldLabelsAndStructure();
    this.verifyFormGroupStructure();
    this.verifyInputFieldAttributes();
    this.verifyContinueButton();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }

  // Method for quick form completion
  completeFormWithMinimalData(physicianName: string): TbCertificateDeclarationPage {
    this.fillDeclaringPhysicianName(physicianName);
    this.clickContinue();
    return this;
  }

  // Method for complete form completion
  completeFormWithAllData(physicianName: string, comments: string): TbCertificateDeclarationPage {
    this.fillDeclaringPhysicianName(physicianName);
    this.fillPhysicianComments(comments);
    this.clickContinue();
    return this;
  }

  // Verify clinic information summary matches expected values
  verifyClinicInformationComplete(): TbCertificateDeclarationPage {
    this.verifyClinicInformationSummary();
    this.verifyClinicInformationFields();

    // Verify all summary values exist
    cy.get(".govuk-summary-list__value").should("have.length", 4);
    cy.get(".govuk-summary-list__value").each(($value) => {
      cy.wrap($value).should("not.be.empty");
    });

    return this;
  }
}
