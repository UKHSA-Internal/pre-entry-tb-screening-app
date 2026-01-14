//This holds all fields of the Chest X-ray Results Page
import { BasePage } from "../BasePageNew";
import { FormHelper, GdsComponentHelper, ButtonHelper, ErrorHelper } from "../helpers";

export class ChestXrayResultsPage extends BasePage {
  // Compose helper instances
  private form = new FormHelper();
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private error = new ErrorHelper();

  constructor() {
    super("/chest-x-ray-results");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayResultsPage {
    cy.contains("h1.govuk-heading-l", "Chest X-ray results").should("be.visible");
    return this;
  }

  // Verify form is displayed
  verifyFormDisplayed(): ChestXrayResultsPage {
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify radio buttons group
  verifyRadioButtonsGroup(): ChestXrayResultsPage {
    cy.get("#xray-result").should("be.visible");
    cy.get(".govuk-radios").should("be.visible");
    return this;
  }

  // Verify all radio button options are present
  verifyAllRadioOptions(): ChestXrayResultsPage {
    cy.get('input[name="xrayResult"][value="Chest X-ray normal"]').should("exist");
    cy.get('label[for="xray-result-0"]')
      .should("be.visible")
      .should("contain", "Chest X-ray normal");

    cy.get('input[name="xrayResult"][value="Non-TB abnormality"]').should("exist");
    cy.get('label[for="xray-result-1"]')
      .should("be.visible")
      .should("contain", "Non-TB abnormality");

    cy.get('input[name="xrayResult"][value="Old or active TB"]').should("exist");
    cy.get('label[for="xray-result-2"]').should("be.visible").should("contain", "Old or active TB");
    return this;
  }

  // Select "Chest X-ray normal" option
  selectChestXrayNormal(): ChestXrayResultsPage {
    cy.get("#xray-result-0").check();
    cy.get("#xray-result-0").should("be.checked");
    return this;
  }

  // Select "Non-TB abnormality" option
  selectNonTBAbnormality(): ChestXrayResultsPage {
    cy.get("#xray-result-1").check();
    cy.get("#xray-result-1").should("be.checked");
    return this;
  }

  // Select "Old or active TB" option
  selectOldOrActiveTB(): ChestXrayResultsPage {
    cy.get("#xray-result-2").check();
    cy.get("#xray-result-2").should("be.checked");
    return this;
  }

  // Select radio option by value
  selectRadioOptionByValue(value: string): ChestXrayResultsPage {
    cy.get(`input[name="xrayResult"][value="${value}"]`).check();
    cy.get(`input[name="xrayResult"][value="${value}"]`).should("be.checked");
    return this;
  }

  // Select radio option by index (0, 1, or 2)
  selectRadioOptionByIndex(index: number): ChestXrayResultsPage {
    cy.get(`#xray-result-${index}`).check();
    cy.get(`#xray-result-${index}`).should("be.checked");
    return this;
  }

  // Verify a specific radio option is selected
  verifyRadioOptionSelected(index: number): ChestXrayResultsPage {
    cy.get(`#xray-result-${index}`).should("be.checked");
    return this;
  }

  // Verify no radio option is selected
  verifyNoRadioOptionSelected(): ChestXrayResultsPage {
    cy.get('input[name="xrayResult"]:checked').should("not.exist");
    return this;
  }

  // Click continue button
  clickContinueButton(): ChestXrayResultsPage {
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").click();
    return this;
  }

  // Click continue button and verify redirection to enter X-ray findings page
  clickContinueAndVerifyRedirection(): ChestXrayResultsPage {
    this.clickContinueButton();
    cy.url().should("include", "/enter-x-ray-findings");
    return this;
  }

  // Verify back link
  verifyBackLinkToTracker(): ChestXrayResultsPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/tracker")
      .should("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): ChestXrayResultsPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Check URL after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): ChestXrayResultsPage {
    this.clickContinueButton();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Complete form with a specific option and submit
  completeFormAndSubmit(optionIndex: number): ChestXrayResultsPage {
    this.selectRadioOptionByIndex(optionIndex);
    this.clickContinueButton();
    return this;
  }

  // Complete form with a specific option, submit, and verify redirection
  completeFormSubmitAndVerifyRedirection(optionIndex: number): ChestXrayResultsPage {
    this.selectRadioOptionByIndex(optionIndex);
    this.clickContinueAndVerifyRedirection();
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayResultsPage {
    this.verifyPageLoaded();
    this.verifyFormDisplayed();
    this.verifyRadioButtonsGroup();
    this.verifyAllRadioOptions();
    this.verifyBackLinkToTracker();
    this.verifyServiceName();
    return this;
  }
}
