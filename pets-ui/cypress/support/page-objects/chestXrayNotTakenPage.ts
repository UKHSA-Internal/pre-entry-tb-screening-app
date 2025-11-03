//This holds all fields of the Chest X-ray Not Taken Page

import { BasePage } from "../BasePage";

// Interface for chest X-ray not taken form data
interface ChestXrayNotTakenFormData {
  reasonXrayWasNotTaken: "Child" | "Pregnant" | "Other";
}

export class ChestXrayNotTakenPage extends BasePage {
  constructor() {
    super("/reason-x-ray-not-required");
  }

  // Verify Chest X-ray Not Taken Page
  verifyPageLoaded(): ChestXrayNotTakenPage {
    cy.url().should("include", "/reason-x-ray-not-required");
    cy.get("h1.govuk-heading-l").should("contain", "Reason X-ray is not required?");
    return this;
  }

  // Select reason for X-ray not taken
  selectReasonXrayNotTaken(reason: "Child" | "Pregnant" | "Other"): ChestXrayNotTakenPage {
    const valueMap: Record<"Child" | "Pregnant" | "Other", string> = {
      Child: "Child (under 11 years)",
      Pregnant: "Pregnant",
      Other: "Other",
    };
    cy.get(`input[name="reasonXrayNotRequired"][value="${valueMap[reason]}"]`).check({
      force: true,
    });
    return this;
  }

  // Select reason by label text
  selectReasonByLabel(reason: string): ChestXrayNotTakenPage {
    cy.get("#reason-xray-not-taken fieldset").contains("label", reason).click();
    return this;
  }

  // Fill the entire form at once
  fillCompleteForm(data: ChestXrayNotTakenFormData): ChestXrayNotTakenPage {
    this.selectReasonXrayNotTaken(data.reasonXrayWasNotTaken);
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

  selectOther(): ChestXrayNotTakenPage {
    this.selectReasonXrayNotTaken("Other");
    return this;
  }

  // Verification methods
  verifyReasonSelected(reason: "Child" | "Pregnant" | "Other"): ChestXrayNotTakenPage {
    const valueMap: Record<"Child" | "Pregnant" | "Other", string> = {
      Child: "Child (under 11 years)",
      Pregnant: "Pregnant",
      Other: "Other",
    };
    cy.get(`input[name="reasonXrayNotRequired"][value="${valueMap[reason]}"]`).should("be.checked");
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

  // Comprehensive form validation
  validateFormErrors(errors: { reason?: string }): ChestXrayNotTakenPage {
    Object.entries(errors).forEach(([field, message]) => {
      switch (field) {
        case "reason":
          this.validateFieldError("reason-xray-not-taken", message);
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
    cy.get('input[name="reasonXrayNotRequired"]').should("exist");
    return this;
  }

  // Verify all reason options are present
  verifyAllReasonOptionsPresent(): ChestXrayNotTakenPage {
    const expectedReasons = [
      { value: "Child (under 11 years)", label: "Child (under 11 years)" },
      { value: "Pregnant", label: "Pregnant" },
      { value: "Other", label: "Other" },
    ];

    expectedReasons.forEach((reason) => {
      cy.get(`input[name="reasonXrayNotRequired"][value="${reason.value}"]`).should("exist");
      cy.contains("label", reason.label).should("be.visible");
    });

    return this;
  }

  // Verify back link
  verifyBackLink(): ChestXrayNotTakenPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/is-an-x-ray-required")
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
    cy.get("h1.govuk-heading-l").should("contain", "Reason X-ray is not required?");
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): ChestXrayNotTakenPage {
    this.verifyPageLoaded();
    this.verifyPageHeadingAndLabels();
    this.verifyAllFieldsPresent();
    this.verifyAllReasonOptionsPresent();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Test form behaviour with conditional logic
  verifyConditionalBehavior(): ChestXrayNotTakenPage {
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
    return this;
  }
}
