// BasePage Common functionality for all page objects
export class BasePage {
  // Page path to visit
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  // Navigation
  visit(): void {
    cy.visit(this.path);
  }

  // Common verification methods
  verifyPageHeading(text: string): BasePage {
    cy.get("h1").should("be.visible").and("contain", text);
    return this;
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): BasePage {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
    return this;
  }

  // Verify multiple summary values at once
  verifySummaryValues(expectedValues: Record<string, string>): BasePage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      this.verifySummaryValue(key, value);
    });
    return this;
  }

  // Get all summary values from the page
  getAllSummaryValues(): Cypress.Chainable<Record<string, string>> {
    return cy.get(".govuk-summary-list__row").then(($rows) => {
      const summaryValues: Record<string, string> = {};
      $rows.each((_, row) => {
        const key = Cypress.$(row).find(".govuk-summary-list__key").text().trim();
        const value = Cypress.$(row).find(".govuk-summary-list__value").text().trim();
        summaryValues[key] = value;
      });
      return summaryValues;
    });
  }

  // Verify summary row exists
  verifySummaryRowExists(fieldKey: string): BasePage {
    cy.contains("dt.govuk-summary-list__key", fieldKey).should("exist");
    return this;
  }

  // Verify optional field shows "Enter" link
  verifyOptionalFieldLink(fieldKey: string, linkText: string): BasePage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .find("a")
      .should("contain", linkText);
    return this;
  }

  // Verify change links with URLs
  verifyChangeLinksWithUrls(expectedLinks: Record<string, string>): BasePage {
    Object.entries(expectedLinks).forEach(([fieldKey, expectedHref]) => {
      cy.contains("dt.govuk-summary-list__key", fieldKey)
        .siblings(".govuk-summary-list__actions")
        .find("a")
        .should("contain", "Change")
        .and("have.attr", "href", expectedHref);
    });
    return this;
  }

  // Common methods for handling form fields
  fillTextInput(labelText: string, value: string): BasePage {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("input")
      .should("be.visible")
      .clear()
      .type(value);
    return this;
  }

  fillTextarea(labelText: string, value: string): BasePage {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("textarea")
      .should("be.visible")
      .clear()
      .type(value);
    return this;
  }

  selectDropdown(labelText: string, value: string): BasePage {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("select")
      .should("be.visible")
      .select(value);
    return this;
  }

  checkRadio(name: string, value: string): BasePage {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    return this;
  }

  fillDateFields(
    legendText: string,
    day: string,
    month: string,
    year: string,
    strategy = "legend",
  ): BasePage {
    let fieldsetLocator;

    switch (strategy) {
      case "legend":
        // Find by legend text
        fieldsetLocator = () => cy.contains("fieldset legend", legendText).parents("fieldset");
        break;
      case "aria":
        // Find by aria-describedby attribute
        fieldsetLocator = () => cy.get(`fieldset[aria-describedby="${legendText}-hint"]`);
        break;
      case "id":
        // Find by div ID
        fieldsetLocator = () =>
          cy.get(`div#${legendText}`).parents("fieldset, .govuk-form-group").first();
        break;
      case "label":
        // Find by label text
        fieldsetLocator = () => cy.contains("label", legendText).parents(".govuk-form-group");
        break;
      default:
        fieldsetLocator = () => cy.contains("fieldset legend", legendText).parents("fieldset");
    }

    fieldsetLocator().within(() => {
      cy.get('input[id$="-day"]').should("be.visible").clear().type(day);
      cy.get('input[id$="-month"]').should("be.visible").clear().type(month);
      cy.get('input[id$="-year"]').should("be.visible").clear().type(year);
    });

    return this;
  }

  // Data-testid methods
  getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }

  // Fill date fields using data-testid pattern
  fillDateFieldsByTestId(baseName: string, day: string, month: string, year: string): BasePage {
    cy.get(`[data-testid="${baseName}-day"]`).clear().type(day);
    cy.get(`[data-testid="${baseName}-month"]`).clear().type(month);
    cy.get(`[data-testid="${baseName}-year"]`).clear().type(year);
    return this;
  }

  // File upload methods (for file Upload pages)
  uploadFile(fieldName: string, filePath: string): BasePage {
    cy.get(`input[name="${fieldName}"]`).selectFile(filePath, { force: true });
    return this;
  }

  verifyFileUploaded(fieldName: string): BasePage {
    cy.get(`input[name="${fieldName}"]`).should("exist");
    return this;
  }

  clearUploadedFile(fieldName: string): BasePage {
    cy.get(`input[name="${fieldName}"]`).clear();
    return this;
  }

  verifyFileUploadError(fieldName: string, errorMessage?: string): BasePage {
    cy.get(`#${fieldName}-error`).should("be.visible");
    if (errorMessage) {
      cy.get(".govuk-error-message").should("be.visible").and("contain", errorMessage);
    }
    return this;
  }

  // Enhanced button methods
  clickSaveAndContinue(): BasePage {
    cy.get('button[type="submit"]').contains("Submit and continue").should("be.visible").click();
    return this;
  }

  clickContinue(): BasePage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  clickFinish(): BasePage {
    cy.get('button[type="submit"]').contains("Finish").should("be.visible").click();
    return this;
  }

  verifyButtonState(buttonText: string, enabled: boolean = true): BasePage {
    const assertion = enabled ? "be.enabled" : "be.disabled";
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and(assertion)
      .and("contain.text", buttonText);
    return this;
  }

  // Error validation methods
  verifyErrorSummaryDisplayed(): BasePage {
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary").should("have.attr", "data-module", "govuk-error-summary");
    return this;
  }

  // Verify specific error message in summary
  verifyErrorSummaryMessage(expectedText: string): BasePage {
    this.verifyErrorSummaryDisplayed();
    cy.get(".govuk-error-summary").should("contain.text", expectedText);
    return this;
  }

  // Verify form group has error state
  verifyFormGroupErrorState(fieldId: string): BasePage {
    cy.get(`#${fieldId}`).should("have.class", "govuk-form-group--error");
    return this;
  }

  // Verify field-level error message
  verifyFieldErrorMessage(fieldId: string, expectedText: string): BasePage {
    cy.get(`#${fieldId} .govuk-error-message`).should("be.visible");
    cy.get(`#${fieldId} .govuk-error-message`).should("contain.text", expectedText);
    return this;
  }

  // Verify "There is a problem" heading
  verifyProblemHeading(): BasePage {
    cy.contains("There is a problem").should("be.visible");
    return this;
  }

  // Comprehensive error validation
  verifyAllErrorElements(fieldId: string, expectedMessage: string): BasePage {
    this.verifyProblemHeading();
    this.verifyErrorSummaryDisplayed();
    this.verifyErrorSummaryMessage(expectedMessage);
    this.verifyFormGroupErrorState(fieldId);
    this.verifyFieldErrorMessage(fieldId, expectedMessage);
    return this;
  }

  // Verify error summary link functionality
  verifyErrorSummaryLinkFunctionality(fieldId: string): BasePage {
    cy.get(".govuk-error-summary a").click();
    cy.get(`#${fieldId}`).should("be.focused");
    return this;
  }

  // Common submit method (kept for backward compatibility)
  submitForm(buttonText: string = "Submit and continue"): BasePage {
    cy.contains("button", buttonText).should("be.visible").click();
    return this;
  }

  // Confirmation page methods
  verifyConfirmationPanel(title: string): BasePage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.get(".govuk-panel__title").should("be.visible").and("contain", title);
    return this;
  }

  verifyNextStepsSection(): BasePage {
    cy.contains("h2", "What happens next").should("be.visible");
    cy.contains("p", "You can now return to the progress tracker.").should("be.visible");
    return this;
  }

  clickContinueToTracker(): BasePage {
    cy.contains("button", "Continue").should("be.visible").click();
    return this;
  }

  verifyRedirectionToTracker(): BasePage {
    cy.url().should("include", "/tracker");
    return this;
  }

  // Enhanced back link methods
  verifyBackLink(expectedHref: string): BasePage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", expectedHref);
    return this;
  }

  clickBackLink(): BasePage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Check current URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Verify URL contains specific path
  verifyUrlContains(path: string): BasePage {
    cy.url().should("include", path);
    return this;
  }

  // Waiting methods
  waitForApiCalls(duration: number = 1000): BasePage {
    cy.wait(duration);
    return this;
  }

  waitForUpload(duration: number = 1000): BasePage {
    cy.wait(duration);
    return this;
  }

  // Common methods for error validation (kept for backward compatibility)
  validateErrorSummaryVisible(): BasePage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  // Error summary validation
  validateErrorSummaryByTestId(): BasePage {
    cy.get('[data-testid="error-summary"]').should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain.text", "There is a problem");
    return this;
  }

  validateErrorContainsText(text: string): BasePage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
    return this;
  }

  // Validate multiple errors at once
  validateErrorSummaryContains(expectedErrors: string[]): BasePage {
    this.validateErrorSummaryVisible();
    expectedErrors.forEach((error) => {
      cy.get(".govuk-error-summary__list").should("contain.text", error);
    });
    return this;
  }

  // Validate multiple field errors at once
  validateMultipleFieldErrors(errors: Record<string, string>): BasePage {
    Object.entries(errors).forEach(([fieldId, errorMessage]) => {
      this.validateFieldError(fieldId, errorMessage);
    });
    return this;
  }

  // Validate no errors are present
  validateNoErrors(): BasePage {
    cy.get(".govuk-error-summary").should("not.exist");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-form-group--error").should("not.exist");
    return this;
  }

  // Validate field error using data-testid
  validateFieldErrorByTestId(testId: string, errorMessage?: string): BasePage {
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

  // ValidateFieldError method
  validateFieldError(fieldId: string, errorMessage?: string): BasePage {
    // In the GDS system, error classes are now being applied to container elements
    // So I am having to use the ID to find either the container directly or the field's container
    const containerId = fieldId.includes("-container") ? fieldId : `${fieldId}-container`;

    // First find the container with the ID, if it exists
    cy.get(`body`).then(($body) => {
      if ($body.find(`#${containerId}`).length > 0) {
        // Container exists with that ID
        cy.get(`#${containerId}`).should("have.class", "govuk-form-group--error");
      } else {
        // Look for the element directly and then its closest form group
        cy.get(`#${fieldId}`)
          .closest(".govuk-form-group")
          .should("have.class", "govuk-form-group--error");
      }
    });

    // Check error message
    if (errorMessage) {
      cy.get(`body`).then(($body) => {
        if ($body.find(`#${containerId}`).length > 0) {
          // Find error message within the container
          cy.get(`#${containerId}`)
            .find(".govuk-error-message")
            .should("be.visible")
            .and("contain.text", errorMessage);
        } else {
          // Find error message within the closest form group
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

  // Verification methods for common patterns
  verifyBreadcrumbNavigation(): BasePage {
    cy.get(".govuk-breadcrumbs__list-item")
      .contains("Application progress tracker")
      .should("be.visible")
      .and("have.attr", "href", "/tracker");
    return this;
  }

  verifyServiceName(): BasePage {
    // Service name verification - checking if service name exists in header
    cy.get("body").then(($body) => {
      if ($body.find(".govuk-service-navigation__service-name").length > 0) {
        cy.get(".govuk-service-navigation__link")
          .should("be.visible")
          .and("contain", "Complete UK pre-entry health screening");
      } else {
        cy.log("Service name not found in header (expected for landing page)");
      }
    });
    return this;
  }

  // Method to click change link for a summary item
  clickChangeLink(fieldKey: string): BasePage {
    cy.contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Helper method to verify task status on progress tracker
  verifyTaskStatus(taskName: string, expectedStatus: string): BasePage {
    cy.contains(".govuk-task-list__name-and-hint", taskName)
      .siblings(".govuk-task-list__status")
      .should("contain.text", expectedStatus);
    return this;
  }

  // Helper method to click task link on progress tracker
  clickTaskLink(taskName: string): BasePage {
    cy.contains(".govuk-task-list__name-and-hint", taskName).find("a").click();
    return this;
  }

  // Form validation helpers
  verifyFormValidationForEmptyForm(): BasePage {
    this.submitForm();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Grid layout verification
  verifyGridLayout(): BasePage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Table verification methods (for X-ray upload, sputum results, etc.)
  verifyTableExists(): BasePage {
    cy.get(".govuk-table").should("be.visible");
    return this;
  }

  verifyTableHeaders(expectedHeaders: string[]): BasePage {
    expectedHeaders.forEach((header) => {
      cy.get(".govuk-table__header").should("contain", header);
    });
    return this;
  }

  // Section break verification
  verifySectionBreaks(): BasePage {
    cy.get("hr.govuk-section-break").should("exist");
    return this;
  }

  // Page title verification
  verifyPageTitle(expectedTitle: string): BasePage {
    cy.title().should("include", expectedTitle);
    return this;
  }

  // Notification banner methods
  verifyNotificationBanner(title: string = "Important"): BasePage {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", title);
    return this;
  }

  // Fieldset and legend verification
  verifyFieldsetWithLegend(legendText: string): BasePage {
    cy.contains("fieldset legend", legendText).should("be.visible");
    return this;
  }

  // Enhanced radio button methods
  verifyRadioOptions(name: string, expectedOptions: string[]): BasePage {
    expectedOptions.forEach((option) => {
      cy.get(`input[name="${name}"][value="${option}"]`).should("exist");
      cy.contains("label", option).should("be.visible");
    });
    return this;
  }

  // Radio button selection with Yes/No options
  selectYesNoRadio(name: string, option: "Yes" | "No"): BasePage {
    cy.get(`input[name="${name}"][value="${option}"]`).check();
    return this;
  }

  // Verify radio button selection
  verifyRadioSelection(name: string, expectedOption: string): BasePage {
    cy.get(`input[name="${name}"][value="${expectedOption}"]`).should("be.checked");
    return this;
  }

  // Get current radio selection
  getCurrentRadioSelection(name: string): Cypress.Chainable<string> {
    return cy.get(`input[name="${name}"]:checked`).invoke("val");
  }

  // Check if any radio option is selected
  isRadioOptionSelected(name: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`input[name="${name}"]:checked`).should("exist");
  }

  // Verify specific radio buttons are displayed
  verifyRadioButtonsDisplayed(name: string, expectedLabels: string[]): BasePage {
    expectedLabels.forEach((label, index) => {
      cy.get(`input[name="${name}"]`).eq(index).should("be.visible");
      cy.contains("label", label).should("be.visible");
    });
    return this;
  }

  // Dropdown/select verification
  verifySelectOptions(name: string, expectedOptions: string[]): BasePage {
    expectedOptions.forEach((option) => {
      cy.get(`select[name="${name}"] option[value="${option}"]`).should("exist");
    });
    return this;
  }

  // Checkbox verification
  checkCheckbox(name: string, value: string): BasePage {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    return this;
  }

  uncheckCheckbox(name: string, value: string): BasePage {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .uncheck({ force: true })
      .should("not.be.checked");
    return this;
  }

  // Multiple checkbox selection
  checkMultipleCheckboxes(name: string, values: string[]): BasePage {
    values.forEach((value) => {
      this.checkCheckbox(name, value);
    });
    return this;
  }

  // Form state verification
  verifyFormFieldValue(fieldSelector: string, expectedValue: string): BasePage {
    cy.get(fieldSelector).should("have.value", expectedValue);
    return this;
  }

  verifyFormFieldEmpty(fieldSelector: string): BasePage {
    cy.get(fieldSelector).should("have.value", "");
    return this;
  }

  // Conditional display methods (for fields that show/hide based on selections)
  verifyFieldVisible(fieldSelector: string): BasePage {
    cy.get(fieldSelector).should("be.visible");
    return this;
  }

  verifyFieldHidden(fieldSelector: string): BasePage {
    cy.get(fieldSelector).should("not.be.visible");
    return this;
  }

  verifyFieldExists(fieldSelector: string): BasePage {
    cy.get(fieldSelector).should("exist");
    return this;
  }

  // Enhanced button verification methods
  verifyContinueButtonDisplayed(): BasePage {
    cy.get('button[type="submit"]').should("be.visible").and("be.enabled");
    cy.get('button[type="submit"]').should("contain.text", "Continue");
    return this;
  }

  verifySaveAndContinueButtonDisplayed(): BasePage {
    cy.get('button[type="submit"]').should("be.visible").and("be.enabled");
    cy.get('button[type="submit"]').should("contain.text", "Submit and continue");
    return this;
  }

  // Enhanced confirmation page methods
  verifyContinueButtonStyling(): BasePage {
    cy.get('button[type="submit"]')
      .contains("Continue")
      .should("have.attr", "type", "submit")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Complete confirmation page flow
  confirmAndProceed(title?: string): BasePage {
    if (title) {
      this.verifyConfirmationPanel(title);
    }
    this.verifyNextStepsSection();
    this.clickContinueToTracker();
    this.verifyRedirectionToTracker();
    return this;
  }

  // Complete confirmation page structure verification
  verifyCompleteConfirmationPageStructure(title: string): BasePage {
    this.verifyGridLayout();
    this.verifyConfirmationPanel(title);
    this.verifyNextStepsSection();
    this.verifyContinueButtonStyling();
    return this;
  }

  // Travel information form helpers
  fillVisaType(visaType: string): BasePage {
    cy.get('[name="visaType"]').select(visaType);
    return this;
  }

  fillAddressField(fieldId: string, address: string): BasePage {
    cy.get(`#${fieldId}`).clear().type(address);
    return this;
  }

  fillContactField(fieldName: string, value: string): BasePage {
    cy.get(`[name="${fieldName}"]`).clear().type(value);
    return this;
  }

  // Form completion method
  fillCompleteFormFromObject(
    formData: Record<string, string | number | boolean>,
    fieldMapping: Record<string, string>,
  ): BasePage {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "" && fieldMapping[key]) {
        const selector = fieldMapping[key];
        const stringValue = String(value);

        if (selector.includes("select")) {
          cy.get(selector).select(stringValue);
        } else {
          cy.get(selector).clear().type(stringValue);
        }
      }
    });
    return this;
  }

  // Comprehensive form validation helper
  verifyCompleteFormValidation(): BasePage {
    // Submit form without filling required fields
    this.submitForm();
    this.validateErrorSummaryVisible();
    return this;
  }

  // Summary page verification
  verifyRequiredSummaryFields(expectedFields: string[]): BasePage {
    expectedFields.forEach((field) => {
      cy.contains("dt.govuk-summary-list__key", field).should("exist");
    });
    return this;
  }

  // Verify summary with optional fields handling
  verifySummaryWithOptionalFields(
    expectedValues: Record<string, string>,
    optionalFields: string[] = [],
  ): BasePage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value && value !== "") {
        this.verifySummaryValue(key, value);
      } else if (optionalFields.includes(key)) {
        // Optional field should show "Enter" link or be empty
        cy.contains("dt.govuk-summary-list__key", key).should("exist");
      }
    });
    return this;
  }

  verifyFieldNotExists(fieldSelector: string): BasePage {
    cy.get(fieldSelector).should("not.exist");
    return this;
  }

  // Enhanced fieldset and inline radio support
  verifyInlineRadioButtons(fieldsetSelector: string): BasePage {
    cy.get(`${fieldsetSelector} .govuk-radios--inline`).should("be.visible");
    return this;
  }

  // Form field validation with custom selectors
  validateFormFieldError(fieldSelector: string, errorMessage?: string): BasePage {
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

  // Form submission with redirect verification
  submitFormAndVerifyRedirect(
    expectedPath: string,
    buttonText: string = "Submit and continue",
  ): BasePage {
    this.submitForm(buttonText);
    this.verifyUrlContains(expectedPath);
    return this;
  }

  // Wait for element with custom timeout
  waitForElement(selector: string, timeout: number = 10000): BasePage {
    cy.get(selector, { timeout }).should("be.visible");
    return this;
  }

  // Verify element contains text with timeout
  verifyElementContainsText(
    selector: string,
    expectedText: string,
    timeout: number = 10000,
  ): BasePage {
    cy.get(selector, { timeout }).should("contain.text", expectedText);
    return this;
  }

  // Back link verification
  verifyBackLinkToPath(expectedPath: string): BasePage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", expectedPath);
    return this;
  }

  // Complete page element verification helper
  verifyStandardPageElements(): BasePage {
    this.verifyServiceName();
    this.verifyGridLayout();
    return this;
  }

  // Form validation with specific field targeting
  validateSpecificFieldErrors(fieldErrors: Array<{ fieldId: string; message: string }>): BasePage {
    this.validateErrorSummaryVisible();

    fieldErrors.forEach(({ fieldId, message }) => {
      this.validateFieldError(fieldId, message);
    });

    return this;
  }
}
