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

  // Get summary value for a specific field - common across many pages
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

  // Common methods for handling form fields
  fillTextInput(labelText: string, value: string): BasePage {
    cy.contains("label", labelText).parent().find("input").should("be.visible").clear().type(value);
    return this;
  }

  fillTextarea(labelText: string, value: string): BasePage {
    cy.contains("label", labelText)
      .parent()
      .find("textarea")
      .should("be.visible")
      .clear()
      .type(value);
    return this;
  }

  selectDropdown(labelText: string, value: string): BasePage {
    cy.contains("label", labelText).parent().find("select").should("be.visible").select(value);
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

  // Common submit method
  submitForm(buttonText: string = "Save and continue"): BasePage {
    cy.contains("button", buttonText).should("be.visible").click();
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

  // Common methods for error validation
  validateErrorSummaryVisible(): BasePage {
    cy.get(".govuk-error-summary").should("be.visible");
    return this;
  }

  validateErrorContainsText(text: string): BasePage {
    cy.get(".govuk-error-summary__list").should("contain.text", text);
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

    // Check error message if provided
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
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
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
}
