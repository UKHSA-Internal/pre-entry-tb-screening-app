/**
 * ErrorHelper - Handles all error validation and verification
 * Provides methods for error summaries, field-level errors, and comprehensive validation
 */
export class ErrorHelper {
  // Error summary methods
  verifyErrorSummaryDisplayed(): ErrorHelper {
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary").should("have.attr", "data-module", "govuk-error-summary");
    return this;
  }

  verifyErrorSummaryByTestId(): ErrorHelper {
    cy.get('[data-testid="error-summary"]').should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain.text", "There is a problem");
    return this;
  }

  verifyProblemHeading(): ErrorHelper {
    cy.contains("There is a problem").should("be.visible");
    return this;
  }

  verifyErrorSummaryMessage(expectedText: string): ErrorHelper {
    this.verifyErrorSummaryDisplayed();
    cy.get(".govuk-error-summary").should("contain.text", expectedText);
    return this;
  }

  validateErrorContainsText(text: string): ErrorHelper {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  verifyErrorSummaryContains(expectedErrors: string[]): ErrorHelper {
    this.verifyErrorSummaryDisplayed();
    expectedErrors.forEach((error) => {
      cy.get(".govuk-error-summary__list").should("contain.text", error);
    });
    return this;
  }

  // Form group error state
  verifyFormGroupErrorState(fieldId: string): ErrorHelper {
    cy.get(`#${fieldId}`).should("have.class", "govuk-form-group--error");
    return this;
  }

  // Field-level error messages
  verifyFieldErrorMessage(fieldId: string, expectedText: string): ErrorHelper {
    cy.get(`#${fieldId} .govuk-error-message`).should("be.visible");
    cy.get(`#${fieldId} .govuk-error-message`).should("contain.text", expectedText);
    return this;
  }

  validateFieldError(fieldId: string, errorMessage?: string): ErrorHelper {
    // In the GDS system, error classes are now being applied to container elements
    const containerId = fieldId.includes("-container") ? fieldId : `${fieldId}-container`;

    // First find the container with the ID, if it exists
    cy.get(`body`).then(($body) => {
      if ($body.find(`#${containerId}`).length > 0) {
        cy.get(`#${containerId}`).should("have.class", "govuk-form-group--error");
      } else {
        cy.get(`#${fieldId}`)
          .closest(".govuk-form-group")
          .should("have.class", "govuk-form-group--error");
      }
    });

    // Check error message
    if (errorMessage) {
      cy.get(`body`).then(($body) => {
        if ($body.find(`#${containerId}`).length > 0) {
          cy.get(`#${containerId}`)
            .find(".govuk-error-message")
            .should("be.visible")
            .and("contain.text", errorMessage);
        } else {
          cy.get(`#${fieldId}`)
            .closest(".govuk-form-group")
            .find(".govuk-error-message")
            .should("be.visible")
            .and("contain.text", errorMessage);
        }
      });
    }

    return this;
  }

  validateFieldErrorByTestId(testId: string, errorMessage?: string): ErrorHelper {
    cy.get(`[data-testid="${testId}"]`)
      .closest(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");

    if (errorMessage) {
      cy.get(`[data-testid="${testId}"]`)
        .closest(".govuk-form-group")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", errorMessage);
    }
    return this;
  }

  validateFormFieldError(fieldSelector: string, errorMessage?: string): ErrorHelper {
    cy.get(fieldSelector)
      .closest(".govuk-form-group")
      .should("have.class", "govuk-form-group--error");

    if (errorMessage) {
      cy.get(fieldSelector)
        .closest(".govuk-form-group")
        .find(".govuk-error-message")
        .should("be.visible")
        .and("contain.text", errorMessage);
    }
    return this;
  }

  // Comprehensive error validation
  verifyAllErrorElements(fieldId: string, expectedMessage: string): ErrorHelper {
    this.verifyProblemHeading();
    this.verifyErrorSummaryDisplayed();
    this.verifyErrorSummaryMessage(expectedMessage);
    this.verifyFormGroupErrorState(fieldId);
    this.verifyFieldErrorMessage(fieldId, expectedMessage);
    return this;
  }

  validateMultipleFieldErrors(errors: Record<string, string>): ErrorHelper {
    Object.entries(errors).forEach(([fieldId, errorMessage]) => {
      this.validateFieldError(fieldId, errorMessage);
    });
    return this;
  }

  validateSpecificFieldErrors(
    fieldErrors: Array<{ fieldId: string; message: string }>,
  ): ErrorHelper {
    this.verifyErrorSummaryDisplayed();
    fieldErrors.forEach(({ fieldId, message }) => {
      this.validateFieldError(fieldId, message);
    });
    return this;
  }

  // Error summary link functionality
  verifyErrorSummaryLinkFunctionality(fieldId: string): ErrorHelper {
    cy.get(".govuk-error-summary a").click();
    cy.get(`#${fieldId}`).should("be.focused");
    return this;
  }

  // Validate no errors present
  validateNoErrors(): ErrorHelper {
    cy.get(".govuk-error-summary").should("not.exist");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-form-group--error").should("not.exist");
    return this;
  }

  // Legacy compatibility methods
  validateErrorSummaryVisible(): ErrorHelper {
    return this.verifyErrorSummaryDisplayed();
  }

  // Form validation helper
  verifyFormValidationForEmptyForm(): ErrorHelper {
    this.verifyErrorSummaryDisplayed();
    return this;
  }
}
