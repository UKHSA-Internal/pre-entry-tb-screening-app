// This holds all fields of the TB Certificate Not Issued Form Page
import { BasePage } from "../BasePageNew";
import { FormHelper, GdsComponentHelper, ButtonHelper, ErrorHelper } from "../helpers";

// Types for TB certificate not issued form
interface TbCertificateNotIssuedDetails {
  reasonNotIssued:
    | "Confirmed or suspected TB"
    | "Testing postponed"
    | "Visa applicant has withdrawn their TB screening";
  declaringPhysicianName: string;
  physicianComments?: string;
}

// Types for error validation
interface TbCertificateNotIssuedErrors {
  reasonNotIssued?: string;
  declaringPhysicianName?: string;
  physicianComments?: string;
}

export class TbCertificateNotIssuedFormPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

  constructor() {
    super("/tb-certificate-not-issued");
  }

  verifyPageLoaded(): TbCertificateNotIssuedFormPage {
    cy.url().should("include", "/why-are-you-not-issuing-certificate");
    cy.get("h1").should("contain", "Why are you not issuing a certificate?");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify radio buttons for reason not issued
  verifyReasonNotIssuedRadioButtons(): TbCertificateNotIssuedFormPage {
    cy.get("#reason-not-issued").should("be.visible");

    // Verify radio button inputs exist (even if hidden)
    cy.get('input[name="reasonNotIssued"][value="Confirmed or suspected TB"]').should("exist");
    cy.get('input[name="reasonNotIssued"][value="Testing postponed"]').should("exist");
    cy.get(
      'input[name="reasonNotIssued"][value="Visa applicant has withdrawn their TB screening"]',
    ).should("exist");

    // Verify labels are visible and clickable using for attributes
    cy.get('label[for="reason-not-issued-0"]')
      .should("be.visible")
      .and("contain", "Confirmed or suspected TB");
    cy.get('label[for="reason-not-issued-1"]')
      .should("be.visible")
      .and("contain", "Testing postponed");
    cy.get('label[for="reason-not-issued-2"]')
      .should("be.visible")
      .and("contain", "Visa applicant has withdrawn their TB screening");

    return this;
  }

  // Select reason for not issuing certificate
  selectReasonNotIssued(
    reason:
      | "Confirmed or suspected TB"
      | "Testing postponed"
      | "Visa applicant has withdrawn their TB screening",
  ): TbCertificateNotIssuedFormPage {
    // Map reasons to their corresponding label for attributes
    const reasonToLabelMap = {
      "Confirmed or suspected TB": "reason-not-issued-0",
      "Testing postponed": "reason-not-issued-1",
      "Visa applicant has withdrawn their TB screening": "reason-not-issued-2",
    };

    const labelFor = reasonToLabelMap[reason];
    cy.get(`label[for="${labelFor}"]`).click();
    return this;
  }

  // Force click on hidden radio button if needed
  selectReasonNotIssuedForce(
    reason:
      | "Confirmed or suspected TB"
      | "Testing postponed"
      | "Visa applicant has withdrawn their TB screening",
  ): TbCertificateNotIssuedFormPage {
    cy.get(`input[name="reasonNotIssued"][value="${reason}"]`).check({ force: true });
    return this;
  }

  // Label-based selection method using for attributes
  selectReasonNotIssuedByLabel(
    reason:
      | "Confirmed or suspected TB"
      | "Testing postponed"
      | "Visa applicant has withdrawn their TB screening",
  ): TbCertificateNotIssuedFormPage {
    // Use the same mapping as selectReasonNotIssued
    const reasonToLabelMap = {
      "Confirmed or suspected TB": "reason-not-issued-0",
      "Testing postponed": "reason-not-issued-1",
      "Visa applicant has withdrawn their TB screening": "reason-not-issued-2",
    };

    const labelFor = reasonToLabelMap[reason];
    cy.get(`label[for="${labelFor}"]`).click();
    return this;
  }

  // ID-based selection method
  selectReasonNotIssuedById(
    reason:
      | "Confirmed or suspected TB"
      | "Testing postponed"
      | "Visa applicant has withdrawn their TB screening",
  ): TbCertificateNotIssuedFormPage {
    // Map reasons to their corresponding rdio button IDs
    const reasonToIdMap = {
      "Confirmed or suspected TB": "reason-not-issued-0",
      "Testing postponed": "reason-not-issued-1",
      "Visa applicant has withdrawn their TB screening": "reason-not-issued-2",
    };

    const radioId = reasonToIdMap[reason];
    cy.get(`#${radioId}`).check({ force: true });
    return this;
  }

  // Verify selected reason
  verifyReasonSelection(expectedReason: string): TbCertificateNotIssuedFormPage {
    cy.get(`input[name="reasonNotIssued"][value="${expectedReason}"]`).should("be.checked");
    return this;
  }

  // Fill declaring physician's name
  fillDeclaringPhysicianName(name: string): TbCertificateNotIssuedFormPage {
    cy.get('input[name="declaringPhysicianName"]').should("be.visible").clear().type(name);
    return this;
  }

  // Fill physician's notes (optional)
  fillPhysicianComments(comments: string): TbCertificateNotIssuedFormPage {
    cy.get('textarea[name="comments"]').should("be.visible").clear().type(comments);
    return this;
  }

  // Verify form fields using data-testid attributes
  verifyFormFieldsWithTestIds(): TbCertificateNotIssuedFormPage {
    cy.get('[data-testid="reason-not-issued"]').should("exist");
    cy.get('[data-testid="declaring-physician-name"]').should("be.visible");
    cy.get('[data-testid="physician-comments"]').should("be.visible");
    return this;
  }

  // Verify form field labels and structure
  verifyFormFieldLabels(): TbCertificateNotIssuedFormPage {
    cy.contains("label", "Declaring Physician's name").should("be.visible");
    cy.contains("label", "Physician's notes (Optional)").should("be.visible");
    return this;
  }

  // Verify form field IDs and structure
  verifyFormFieldStructure(): TbCertificateNotIssuedFormPage {
    // Verify declaring physician name field
    cy.get("#declaring-physician-name-field")
      .should("be.visible")
      .and("have.attr", "type", "text")
      .and("have.attr", "name", "declaringPhysicianName");

    // Verify physician comments textarea
    cy.get("#physician-comments-field").should("be.visible").and("have.attr", "name", "comments");

    return this;
  }

  // Complete form with valid data
  fillFormWithValidData(options: TbCertificateNotIssuedDetails): TbCertificateNotIssuedFormPage {
    this.selectReasonNotIssuedById(options.reasonNotIssued);
    this.fillDeclaringPhysicianName(options.declaringPhysicianName);

    if (options.physicianComments) {
      this.fillPhysicianComments(options.physicianComments);
    }

    return this;
  }

  // Submit form
  clickContinue(): TbCertificateNotIssuedFormPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Verify form is filled with expected data
  verifyFormFilledWith(
    expectedData: TbCertificateNotIssuedDetails,
  ): TbCertificateNotIssuedFormPage {
    this.verifyReasonSelection(expectedData.reasonNotIssued);
    cy.get('input[name="declaringPhysicianName"]').should(
      "have.value",
      expectedData.declaringPhysicianName,
    );

    if (expectedData.physicianComments) {
      cy.get('textarea[name="comments"]').should("have.value", expectedData.physicianComments);
    }

    return this;
  }

  // Verify all fields are empty initially
  verifyAllFieldsEmpty(): TbCertificateNotIssuedFormPage {
    cy.get('input[name="reasonNotIssued"]:checked').should("not.exist");
    cy.get('input[name="declaringPhysicianName"]').should("have.value", "");
    cy.get('textarea[name="comments"]').should("have.value", "");
    return this;
  }

  // Enhanced error validation
  validateFormErrors(
    expectedErrorMessages: TbCertificateNotIssuedErrors,
  ): TbCertificateNotIssuedFormPage {
    if (expectedErrorMessages.reasonNotIssued) {
      this.validateFieldError("reason-not-issued", expectedErrorMessages.reasonNotIssued);
    }

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
  verifyFormValidationForEmptyForm(): TbCertificateNotIssuedFormPage {
    this.clickContinue();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Submit form and verify redirection to summary
  submitAndVerifyRedirection(): TbCertificateNotIssuedFormPage {
    this.clickContinue();
    cy.url().should("include", "/tb-certificate-summary");
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): TbCertificateNotIssuedFormPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/will-you-issue-tb-clearance-certificate");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): TbCertificateNotIssuedFormPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify continue button
  verifyContinueButton(): TbCertificateNotIssuedFormPage {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("be.enabled")
      .and("contain.text", "Continue");
    return this;
  }

  // Verify form group structure
  verifyFormGroupStructure(): TbCertificateNotIssuedFormPage {
    cy.get("#reason-not-issued.govuk-form-group").should("be.visible");
    cy.get("#declaring-physician-name.govuk-form-group").should("be.visible");
    cy.get("#physician-comments.govuk-form-group").should("be.visible");
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): TbCertificateNotIssuedFormPage {
    this.verifyPageLoaded();
    this.verifyReasonNotIssuedRadioButtons();
    this.verifyFormFieldLabels();
    this.verifyFormFieldStructure();
    this.verifyFormFieldsWithTestIds();
    this.verifyFormGroupStructure();
    this.verifyContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }

  // Quick completion method for "Confirmed or suspected TB"
  completeFormWithConfirmedTB(
    physicianName: string,
    comments?: string,
  ): TbCertificateNotIssuedFormPage {
    this.selectReasonNotIssuedById("Confirmed or suspected TB");
    this.fillDeclaringPhysicianName(physicianName);

    if (comments) {
      this.fillPhysicianComments(comments);
    }

    this.clickContinue();
    return this;
  }

  // Quick completion method for "Testing postponed"
  completeFormWithTestingPostponed(
    physicianName: string,
    comments?: string,
  ): TbCertificateNotIssuedFormPage {
    this.selectReasonNotIssuedById("Testing postponed");
    this.fillDeclaringPhysicianName(physicianName);

    if (comments) {
      this.fillPhysicianComments(comments);
    }

    this.clickContinue();
    return this;
  }

  // Quick completion method for "Withdrawn screening"
  completeFormWithWithdrawnScreening(
    physicianName: string,
    comments?: string,
  ): TbCertificateNotIssuedFormPage {
    this.selectReasonNotIssuedById("Visa applicant has withdrawn their TB screening");
    this.fillDeclaringPhysicianName(physicianName);

    if (comments) {
      this.fillPhysicianComments(comments);
    }

    this.clickContinue();
    return this;
  }

  // Submit form with data and continue
  submitFormWithData(options: TbCertificateNotIssuedDetails): TbCertificateNotIssuedFormPage {
    this.fillFormWithValidData(options);
    this.clickContinue();
    return this;
  }

  // Complete form validation test
  performCompleteValidationTest(): TbCertificateNotIssuedFormPage {
    // First verify empty form validation
    this.verifyFormValidationForEmptyForm();

    // Then fill form and verify
    this.selectReasonNotIssuedById("Confirmed or suspected TB");
    this.fillDeclaringPhysicianName("Dr. Sarah Jones");
    this.verifyFormFilledWith({
      reasonNotIssued: "Confirmed or suspected TB",
      declaringPhysicianName: "Dr. Sarah Jones",
    });

    this.clickContinue();
    return this;
  }

  // Test all radio button options
  testAllReasonOptions(): TbCertificateNotIssuedFormPage {
    // Test "Confirmed or suspected TB" option
    this.selectReasonNotIssuedById("Confirmed or suspected TB");
    this.verifyReasonSelection("Confirmed or suspected TB");

    // Test "Testing postponed" option
    this.selectReasonNotIssuedById("Testing postponed");
    this.verifyReasonSelection("Testing postponed");

    // Test "Withdrawn screening" option
    this.selectReasonNotIssuedById("Visa applicant has withdrawn their TB screening");
    this.verifyReasonSelection("Visa applicant has withdrawn their TB screening");

    return this;
  }

  // Get current form values
  getCurrentFormValues(): Cypress.Chainable<TbCertificateNotIssuedDetails> {
    return cy.get("body").then(() => {
      // Check if any radio button is selected
      return cy.get('input[name="reasonNotIssued"]:checked').then(($checkedRadio) => {
        const reasonNotIssued = $checkedRadio.length > 0 ? String($checkedRadio.val()) : "";

        return cy
          .get('input[name="declaringPhysicianName"]')
          .invoke("val")
          .then((physicianName) => {
            return cy
              .get('textarea[name="comments"]')
              .invoke("val")
              .then((comments) => {
                // Type-safe validation of reasonNotIssued
                const validReasonValues = [
                  "Confirmed or suspected TB",
                  "Testing postponed",
                  "Visa applicant has withdrawn their TB screening",
                ];

                const isValidReason = validReasonValues.includes(reasonNotIssued);

                const result: TbCertificateNotIssuedDetails = {
                  reasonNotIssued: isValidReason
                    ? (reasonNotIssued as TbCertificateNotIssuedDetails["reasonNotIssued"])
                    : "Confirmed or suspected TB",
                  declaringPhysicianName: String(physicianName || ""),
                  physicianComments: comments ? String(comments) : undefined,
                };
                return result;
              });
          });
      });
    });
  }

  // Fallback method for handling different radio button scenarios
  selectReasonNotIssuedRobust(
    reason:
      | "Confirmed or suspected TB"
      | "Testing postponed"
      | "Visa applicant has withdrawn their TB screening",
  ): TbCertificateNotIssuedFormPage {
    // Try ID-based selection first
    try {
      this.selectReasonNotIssuedById(reason);
    } catch {
      // Fallback to label-based selection
      try {
        this.selectReasonNotIssuedByLabel(reason);
      } catch {
        // Final fallback to force clicking the radio button
        this.selectReasonNotIssuedForce(reason);
      }
    }
    return this;
  }

  // Helper method to debug radio button visibility
  debugRadioButtons(): TbCertificateNotIssuedFormPage {
    cy.get('input[name="reasonNotIssued"]').each(($el, index) => {
      cy.wrap($el).then((element) => {
        const value = element.val() as string;
        const isVisible = element.is(":visible");
        const opacity = element.css("opacity");
        const id = element.attr("id") as string;
        cy.log(
          `Radio ${index}: id="${id}", value="${value}", visible=${isVisible}, opacity=${opacity}`,
        );
      });
    });

    // This is what i'm using to debug the labels
    cy.get('label[for^="reason-not-issued"]').each(($el, index) => {
      cy.wrap($el).then((element) => {
        const forAttr = element.attr("for") as string;
        const text = element.text();
        const isVisible = element.is(":visible");
        cy.log(`Label ${index}: for="${forAttr}", text="${text}", visible=${isVisible}`);
      });
    });
    return this;
  }

  // Method to wait for radio buttons to be interactive
  waitForRadioButtonsReady(): TbCertificateNotIssuedFormPage {
    cy.get("#reason-not-issued").should("be.visible");
    cy.get('input[name="reasonNotIssued"]').should("have.length", 3);
    cy.get('label[for^="reason-not-issued"]').should("have.length", 3);
    return this;
  }
}
