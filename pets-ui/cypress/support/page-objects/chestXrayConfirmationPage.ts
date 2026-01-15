//This holds all fields of the Chest X-ray Confirmation Page
import { BasePage } from "../BasePageNew";
import { ButtonHelper, ConfirmationHelper, GdsComponentHelper } from "../helpers";

export class ChestXrayConfirmationPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private confirmation = new ConfirmationHelper();

  constructor() {
    super("/chest-x-ray-images-confirmed");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayConfirmationPage {
    cy.contains("h1.govuk-panel__title", "Chest X-ray images confirmed").should("be.visible");
    cy.get(".govuk-panel--confirmation").should("be.visible");
    return this;
  }

  // Verify confirmation panel
  verifyConfirmationPanel(): ChestXrayConfirmationPage {
    cy.get(".govuk-panel--confirmation").should("be.visible");
    cy.contains("h1.govuk-panel__title", "Chest X-ray images confirmed").should("be.visible");
    return this;
  }

  // Verify next steps section
  verifyNextStepsSection(): ChestXrayConfirmationPage {
    cy.contains("h2.govuk-heading-m", "What happens next").should("be.visible");
    cy.contains("p.govuk-body", "We have sent the chest X-ray images to UKHSA.").should(
      "be.visible",
    );
    cy.contains("p.govuk-body", "You can now view a summary for this visa applicant.").should(
      "be.visible",
    );
    return this;
  }

  // Click continue button
  clickContinueButton(): ChestXrayConfirmationPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Click continue button and verify redirection to TB progress tracker
  clickContinueAndVerifyRedirection(): ChestXrayConfirmationPage {
    this.clickContinueButton();
    cy.url().should("include", "/tracker");
    return this;
  }

  // Verify search for another visa applicant link
  verifySearchForAnotherApplicantLink(): ChestXrayConfirmationPage {
    cy.get("a.govuk-link.govuk-link--no-visited-state")
      .contains("Search for another visa applicant")
      .should("be.visible")
      .should("have.attr", "href", "/search-for-visa-applicant");
    return this;
  }

  // Click search for another visa applicant link
  clickSearchForAnotherApplicantLink(): ChestXrayConfirmationPage {
    cy.get("a.govuk-link.govuk-link--no-visited-state")
      .contains("Search for another visa applicant")
      .click();
    return this;
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): ChestXrayConfirmationPage {
    this.clickContinueButton();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayConfirmationPage {
    this.verifyPageLoaded();
    this.verifyConfirmationPanel();
    this.verifyNextStepsSection();
    this.verifySearchForAnotherApplicantLink();
    return this;
  }
}
