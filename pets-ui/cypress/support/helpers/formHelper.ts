/**
 * FormHelper - Handles all form-related interactions
 * Provides methods for filling text inputs, dropdowns, radios, checkboxes, and date fields
 */
export class FormHelper {
  // Text input methods
  fillTextInput(labelText: string, value: string): FormHelper {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("input")
      .should("be.visible")
      .clear()
      .type(value);
    return this;
  }

  fillTextInputBySelector(selector: string, value: string): FormHelper {
    cy.get(selector).should("be.visible").clear().type(value);
    return this;
  }

  fillTextInputById(id: string, value: string): FormHelper {
    cy.get(`#${id}`).should("be.visible").clear().type(value);
    return this;
  }

  fillTextInputByName(name: string, value: string): FormHelper {
    cy.get(`[name="${name}"]`).should("be.visible").clear().type(value);
    return this;
  }

  fillTextInputByTestId(testId: string, value: string): FormHelper {
    cy.get(`[data-testid="${testId}"]`).should("be.visible").clear().type(value);
    return this;
  }

  // Textarea methods
  fillTextarea(labelText: string, value: string): FormHelper {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("textarea")
      .should("be.visible")
      .clear()
      .type(value);
    return this;
  }

  fillTextareaBySelector(selector: string, value: string): FormHelper {
    cy.get(selector).should("be.visible").clear().type(value);
    return this;
  }

  // Dropdown/Select methods
  selectDropdown(labelText: string, value: string): FormHelper {
    cy.contains("label", labelText, { timeout: 10000 })
      .should("be.visible")
      .parent()
      .find("select")
      .should("be.visible")
      .select(value);
    return this;
  }

  selectDropdownBySelector(selector: string, value: string): FormHelper {
    cy.get(selector).should("be.visible").select(value);
    return this;
  }

  selectDropdownByName(name: string, value: string): FormHelper {
    cy.get(`[name="${name}"]`).should("be.visible").select(value);
    return this;
  }

  // Radio button methods
  checkRadio(name: string, value: string): FormHelper {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    return this;
  }

  selectYesNoRadio(name: string, option: "Yes" | "No"): FormHelper {
    cy.get(`input[name="${name}"][value="${option}"]`).check();
    return this;
  }

  verifyRadioSelection(name: string, expectedOption: string): FormHelper {
    cy.get(`input[name="${name}"][value="${expectedOption}"]`).should("be.checked");
    return this;
  }

  verifyRadioOptions(name: string, expectedOptions: string[]): FormHelper {
    expectedOptions.forEach((option) => {
      cy.get(`input[name="${name}"][value="${option}"]`).should("exist");
      cy.contains("label", option).should("be.visible");
    });
    return this;
  }

  verifyRadioButtonsDisplayed(name: string, expectedLabels: string[]): FormHelper {
    expectedLabels.forEach((label, index) => {
      cy.get(`input[name="${name}"]`).eq(index).should("be.visible");
      cy.contains("label", label).should("be.visible");
    });
    return this;
  }

  getCurrentRadioSelection(name: string): Cypress.Chainable<string> {
    return cy.get(`input[name="${name}"]:checked`).invoke("val");
  }

  // Checkbox methods
  checkCheckbox(name: string, value: string): FormHelper {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .check({ force: true })
      .should("be.checked");
    return this;
  }

  uncheckCheckbox(name: string, value: string): FormHelper {
    cy.get(`input[name="${name}"][value="${value}"]`)
      .should("exist")
      .uncheck({ force: true })
      .should("not.be.checked");
    return this;
  }

  checkMultipleCheckboxes(name: string, values: string[]): FormHelper {
    values.forEach((value) => {
      this.checkCheckbox(name, value);
    });
    return this;
  }

  // Date field methods
  fillDateFields(
    legendText: string,
    day: string,
    month: string,
    year: string,
    strategy: "legend" | "aria" | "id" | "label" = "legend",
  ): FormHelper {
    let fieldsetLocator;

    switch (strategy) {
      case "legend":
        fieldsetLocator = () => cy.contains("fieldset legend", legendText).parents("fieldset");
        break;
      case "aria":
        fieldsetLocator = () => cy.get(`fieldset[aria-describedby="${legendText}-hint"]`);
        break;
      case "id":
        fieldsetLocator = () =>
          cy.get(`div#${legendText}`).parents("fieldset, .govuk-form-group").first();
        break;
      case "label":
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

  fillDateFieldsByTestId(baseName: string, day: string, month: string, year: string): FormHelper {
    cy.get(`[data-testid="${baseName}-day"]`).clear().type(day);
    cy.get(`[data-testid="${baseName}-month"]`).clear().type(month);
    cy.get(`[data-testid="${baseName}-year"]`).clear().type(year);
    return this;
  }

  fillDateFieldsBySelector(
    daySelector: string,
    monthSelector: string,
    yearSelector: string,
    day: string,
    month: string,
    year: string,
  ): FormHelper {
    cy.get(daySelector).clear().type(day);
    cy.get(monthSelector).clear().type(month);
    cy.get(yearSelector).clear().type(year);
    return this;
  }

  // Form state verification
  verifyFormFieldValue(fieldSelector: string, expectedValue: string): FormHelper {
    cy.get(fieldSelector).should("have.value", expectedValue);
    return this;
  }

  verifyFormFieldEmpty(fieldSelector: string): FormHelper {
    cy.get(fieldSelector).should("have.value", "");
    return this;
  }

  verifyFieldVisible(fieldSelector: string): FormHelper {
    cy.get(fieldSelector).should("be.visible");
    return this;
  }

  verifyFieldHidden(fieldSelector: string): FormHelper {
    cy.get(fieldSelector).should("not.be.visible");
    return this;
  }

  verifyFieldExists(fieldSelector: string): FormHelper {
    cy.get(fieldSelector).should("exist");
    return this;
  }

  verifyFieldNotExists(fieldSelector: string): FormHelper {
    cy.get(fieldSelector).should("not.exist");
    return this;
  }

  // Fieldset and legend verification
  verifyFieldsetWithLegend(legendText: string): FormHelper {
    cy.contains("fieldset legend", legendText).should("be.visible");
    return this;
  }

  verifyInlineRadioButtons(fieldsetSelector: string): FormHelper {
    cy.get(`${fieldsetSelector} .govuk-radios--inline`).should("be.visible");
    return this;
  }

  // Dropdown verification
  verifySelectOptions(name: string, expectedOptions: string[]): FormHelper {
    expectedOptions.forEach((option) => {
      cy.get(`select[name="${name}"] option[value="${option}"]`).should("exist");
    });
    return this;
  }

  // Complete form from object
  fillCompleteFormFromObject(
    formData: Record<string, string | number | boolean>,
    fieldMapping: Record<string, string>,
  ): FormHelper {
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
}
