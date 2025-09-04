//This holds all fields of the Chst X-ray Not Taken Page

import { BasePage } from "../BasePage";

// Interface for chest X-ray not taken form data
interface ChestXrayNotTakenFormData {
  reasonXrayWasNotTaken: "Child" | "Pregnant" | "Other";
  xrayWasNotTakenFurtherDetails?: string;
}

export class ChestXrayNotTakenPage extends BasePage {
  constructor() {
    super("/chest-xray-reason");
  }

  // Verify Chest X-ray Not Taken Page
  verifyPageLoaded(): ChestXrayNotTakenPage {
    cy.url().should("include", "/chest-xray-not-taken");
    cy.get("h1.govuk-heading-l").should("contain", "Enter reason X-ray not taken");
    cy.contains("h2", "Reason X-ray not taken").should("be.visible");
    cy.contains("Choose from the following options").should("be.visible");
    return this;
  }

  // Select reason for X-ray not taken
  selectReasonXrayNotTaken(reason: "Child" | "Pregnant" | "Other"): ChestXrayNotTakenPage {
    cy.get(`input[name="reasonXrayWasNotTaken"][value="${reason}"]`).check({ force: true });
    return this;
  }

  // Select reason by label text
  selectReasonByLabel(reason: string): ChestXrayNotTakenPage {
    cy.get("#reason-xray-not-taken fieldset").contains("label", reason).click();
    return this;
  }

  // Fill further details/notes
  fillFurtherDetails(details: string): ChestXrayNotTakenPage {
    cy.get('textarea[name="xrayWasNotTakenFurtherDetails"]').clear().type(details);
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: ChestXrayNotTakenFormData): ChestXrayNotTakenPage {
    this.selectReasonXrayNotTaken(data.reasonXrayWasNotTaken);

    if (data.xrayWasNotTakenFurtherDetails) {
      this.fillFurtherDetails(data.xrayWasNotTakenFurtherDetails);
    }

    return this;
  }

  // Form submission
  submitForm(): ChestXrayNotTakenPage {
    cy.get('button[type="submit"]').contains("Continue").click();
    return this;
  }

  // Methods for common scenarios
  selectChild(): ChestXrayNotTakenPage {
    return this.selectReasonXrayNotTaken("Child");
  }

  selectPregnant(): ChestXrayNotTakenPage {
    return this.selectReasonXrayNotTaken("Pregnant");
  }

  selectOther(details?: string): ChestXrayNotTakenPage {
    this.selectReasonXrayNotTaken("Other");
    if (details) {
      this.fillFurtherDetails(details);
    }
    return this;
  }

  // Verification methods
  verifyReasonSelected(reason: "Child" | "Pregnant" | "Other"): ChestXrayNotTakenPage {
    cy.get(`input[name="reasonXrayWasNotTaken"][value="${reason}"]`).should("be.checked");
    return this;
  }

  verifyFurtherDetailsValue(expectedValue: string): ChestXrayNotTakenPage {
    cy.get('textarea[name="xrayWasNotTakenFurtherDetails"]').should("have.value", expectedValue);
    return this;
  }

  verifyFurtherDetailsVisible(): ChestXrayNotTakenPage {
    cy.get("#xray-not-taken-further-details").should("be.visible");
    cy.get('textarea[name="xrayWasNotTakenFurtherDetails"]').should("be.visible");
    return this;
  }

  // Error validation methods
  validateErrorSummaryVisible(): ChestXrayNotTakenPage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorContainsText(text: string): ChestXrayNotTakenPage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  validateReasonFieldError(): ChestXrayNotTakenPage {
    this.validateFieldError("reason-xray-not-taken");
    return this;
  }

  validateFurtherDetailsFieldError(): ChestXrayNotTakenPage {
    this.validateFieldError("xray-not-taken-further-details");
    return this;
  }

  // Comprehensive form validation
  validateFormErrors(errors: { reason?: string; furtherDetails?: string }): ChestXrayNotTakenPage {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "reason":
          this.validateFieldError("reason-xray-not-taken", message);
          break;
        case "furtherDetails":
          this.validateFieldError("xray-not-taken-further-details", message);
          break;
      }
    });

    return this;
  }

  // Detailed error message validation
  validateErrorMessage(...expectedTexts: string[]): ChestXrayNotTakenPage {
    this.validateErrorSummaryVisible();

    cy.get(".govuk-error-summary__list").then(($list) => {
      const listText = $list.text();

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
  verifyAllFieldsPresent(): ChestXrayNotTakenPage {
    cy.get('input[name="reasonXrayWasNotTaken"]').should("exist");
    cy.get('textarea[name="xrayWasNotTakenFurtherDetails"]').should("be.visible");
    return this;
  }

  // Verify all reason options are present
  verifyAllReasonOptionsPresent(): ChestXrayNotTakenPage {
    const expectedReasons = ["Child", "Pregnant", "Other"];

    expectedReasons.forEach((reason) => {
      cy.get(`input[name="reasonXrayWasNotTaken"][value="${reason}"]`).should("exist");
      cy.contains("label", reason).should("be.visible");
    });

    return this;
  }

  // Verify back link
  verifyBackLink(): ChestXrayNotTakenPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/chest-xray-question")
      .and("contain", "Back");
    return this;
  }

  // Verify service name
  verifyServiceName(): ChestXrayNotTakenPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify page heading and labels
  verifyPageHeadingAndLabels(): ChestXrayNotTakenPage {
    cy.get("h1.govuk-heading-l").should("contain", "Enter reason X-ray not taken");
    cy.get("h2.govuk-heading-m").should("contain", "Reason X-ray not taken");
    cy.contains("Choose from the following options").should("be.visible");
    cy.get("#xray-not-taken-further-details h2").should("contain", "Notes");
    cy.contains("If other, give further details").should("be.visible");
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): ChestXrayNotTakenPage {
    this.verifyPageLoaded();
    this.verifyPageHeadingAndLabels();
    this.verifyAllFieldsPresent();
    this.verifyAllReasonOptionsPresent();
    this.verifyFurtherDetailsVisible();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Test form behaviour with conditional logic
  verifyConditionalBehavior(): ChestXrayNotTakenPage {
    this.verifyFurtherDetailsVisible();

    // Test each option selection
    this.selectChild();
    this.verifyReasonSelected("Child");

    this.selectPregnant();
    this.verifyReasonSelected("Pregnant");

    this.selectOther();
    this.verifyReasonSelected("Other");

    return this;
  }

  // Method to validate form state after submission attempt
  validateFormStateAfterSubmission(expectedData: ChestXrayNotTakenFormData): ChestXrayNotTakenPage {
    this.verifyReasonSelected(expectedData.reasonXrayWasNotTaken);

    if (expectedData.xrayWasNotTakenFurtherDetails) {
      this.verifyFurtherDetailsValue(expectedData.xrayWasNotTakenFurtherDetails);
    }

    return this;
  }

  // Method to clear form
  clearForm(): ChestXrayNotTakenPage {
    // Clear the textarea
    cy.get('textarea[name="xrayWasNotTakenFurtherDetails"]').clear();

    return this;
  }
}
