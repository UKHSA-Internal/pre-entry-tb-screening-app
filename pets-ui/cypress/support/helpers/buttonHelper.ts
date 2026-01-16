/**
 * ButtonHelper - Handles all button interactions and verifications
 * Provides methods for clicking buttons and verifying button states
 */
export class ButtonHelper {
  // Primary button actions
  clickSaveAndContinue(): ButtonHelper {
    cy.get('button[type="submit"]').contains("Submit and continue").should("be.visible").click();
    return this;
  }

  clickContinue(): ButtonHelper {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  clickFinish(): ButtonHelper {
    cy.get('button[type="submit"]').contains("Finish").should("be.visible").click();
    return this;
  }

  clickContinueToTracker(): ButtonHelper {
    cy.contains("button", "Continue").should("be.visible").click();
    return this;
  }

  // Generic button click
  submitForm(buttonText: string = "Submit and continue"): ButtonHelper {
    cy.contains("button", buttonText).should("be.visible").click();
    return this;
  }

  // Button state verification
  verifyButtonState(buttonText: string, enabled: boolean = true): ButtonHelper {
    const assertion = enabled ? "be.enabled" : "be.disabled";
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and(assertion)
      .and("contain.text", buttonText);
    return this;
  }

  verifyContinueButtonDisplayed(): ButtonHelper {
    cy.get('button[type="submit"]').should("be.visible").and("be.enabled");
    cy.get('button[type="submit"]').should("contain.text", "Continue");
    return this;
  }

  verifySaveAndContinueButtonDisplayed(): ButtonHelper {
    cy.get('button[type="submit"]').should("be.visible").and("be.enabled");
    cy.get('button[type="submit"]').should("contain.text", "Submit and continue");
    return this;
  }

  verifyContinueButtonStyling(): ButtonHelper {
    cy.get('button[type="submit"]')
      .contains("Continue")
      .should("have.attr", "type", "submit")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Button with custom selector
  clickButtonBySelector(selector: string): ButtonHelper {
    cy.get(selector).should("be.visible").click();
    return this;
  }

  verifyButtonBySelector(selector: string, expectedText: string): ButtonHelper {
    cy.get(selector).should("be.visible").and("contain.text", expectedText);
    return this;
  }

  // Form submission with redirect verification
  submitFormAndVerifyRedirect(
    expectedPath: string,
    buttonText: string = "Submit and continue",
  ): ButtonHelper {
    this.submitForm(buttonText);
    cy.url().should("include", expectedPath);
    return this;
  }
}
