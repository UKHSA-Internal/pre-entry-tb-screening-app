//This holds all fields of the Check Chest X-ray Images Page
import { BasePage } from "../BasePage";
import { DateUtils } from "../DateUtils";

export class CheckChestXrayImagesPage extends BasePage {
  constructor() {
    super("/check-chest-x-ray-images");
  }

  // Verify page loaded
  verifyPageLoaded(): CheckChestXrayImagesPage {
    cy.get("h1.govuk-heading-l").should("be.visible").and("contain", "Check chest X-ray images");

    // Check summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): CheckChestXrayImagesPage {
    cy.get("h1.govuk-heading-l").should("be.visible").and("have.text", "Check chest X-ray images");
    return this;
  }

  // Verify "Date of X-ray" field
  verifyDateOfXray(expectedDate: string): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Date of X-ray")
      .siblings(".govuk-summary-list__value")
      .should("contain", expectedDate);
    return this;
  }

  // Get the date of X-ray value
  getDateOfXray(): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", "Date of X-ray")
      .siblings(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify "Chest X-ray images" field displays uploaded files
  verifyChestXrayImages(expectedFiles: string[]): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-value-column")
      .find("dd.govuk-summary-list__value")
      .find("p.govuk-body")
      .then(($paragraphs) => {
        expectedFiles.forEach((fileName, index) => {
          if (fileName) {
            // Only check non-empty filenames
            cy.wrap($paragraphs.eq(index)).should("contain", fileName);
          }
        });
      });
    return this;
  }

  // Verify at least one chest X-ray image is uploaded
  verifyAtLeastOneImageUploaded(): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-value-column")
      .find("dd.govuk-summary-list__value")
      .find("p.govuk-body")
      .should("have.length.at.least", 1);
    return this;
  }

  // Get the list of uploaded chest X-ray images
  getUploadedImages(): Cypress.Chainable<string[]> {
    return cy
      .contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-value-column")
      .find("dd.govuk-summary-list__value")
      .find("p.govuk-body")
      .then(($paragraphs) => {
        const fileNames: string[] = [];
        $paragraphs.each((_index, element) => {
          const text = Cypress.$(element).text().trim();
          if (text) {
            fileNames.push(text);
          }
        });
        return fileNames;
      });
  }

  // Verify "Date of X-ray" change link exists and points to correct URL
  verifyDateOfXrayChangeLink(): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Date of X-ray")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change")
      .and("have.attr", "href", "/upload-chest-x-ray-images#date-xray-taken");
    return this;
  }
  verifyDateOfXrayComponents(day: string, month: string, year: string): CheckChestXrayImagesPage {
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const formattedDate = DateUtils.formatDateGOVUK(date);

    cy.contains("dt.govuk-summary-list__key", "Date of X-ray")
      .siblings(".govuk-summary-list__value")
      .should("contain", formattedDate);

    return this;
  }
  // Verify "Chest X-ray images" change link exists and points to correct URL
  verifyChestXrayImagesChangeLink(): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .should("contain", "Change")
      .and("have.attr", "href", "/upload-chest-x-ray-images#postero-anterior-xray");
    return this;
  }

  // Verify all change links exist
  verifyChangeLinksExist(): CheckChestXrayImagesPage {
    this.verifyDateOfXrayChangeLink();
    this.verifyChestXrayImagesChangeLink();
    return this;
  }

  // Click the "Date of X-ray" change link
  clickDateOfXrayChangeLink(): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Date of X-ray")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Click the "Chest X-ray images" change link
  clickChestXrayImagesChangeLink(): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-list__actions")
      .find("a")
      .click();
    return this;
  }

  // Verify "Now send the X-ray information" heading
  verifySubmissionHeading(): CheckChestXrayImagesPage {
    cy.get("h2.govuk-heading-m")
      .should("be.visible")
      .and("contain", "Now send the X-ray information");
    return this;
  }

  // Verify warning message about not being able to change images after submission
  verifyWarningMessage(): CheckChestXrayImagesPage {
    cy.get("p.govuk-body")
      .should("be.visible")
      .and(
        "contain",
        "Upload all relevant chest X-ray images before you continue. You will not be able to change or add images after you submit this information.",
      );
    return this;
  }

  // Verify "Save and continue" button exists
  verifySaveAndContinueButton(): CheckChestXrayImagesPage {
    cy.get("button[type='submit']")
      .contains("Submit and continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .and("be.enabled");
    return this;
  }

  // Click "Save and continue" button
  clickSaveAndContinue(): CheckChestXrayImagesPage {
    cy.get("button[type='submit']")
      .contains("Submit and continue")
      .filter(":visible")
      .first()
      .should("be.enabled")
      .click();
    return this;
  }

  // Verify back link points to the upload page
  verifyBackLinkNavigation(): CheckChestXrayImagesPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/upload-chest-x-ray-images")
      .and("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): CheckChestXrayImagesPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify summary information with expected values
  verifySummaryInfo(expectedValues: {
    "Date of X-ray"?: string;
    "Chest X-ray images"?: string[];
  }): CheckChestXrayImagesPage {
    if (expectedValues["Date of X-ray"]) {
      this.verifyDateOfXray(expectedValues["Date of X-ray"]);
    }
    if (expectedValues["Chest X-ray images"]) {
      this.verifyChestXrayImages(expectedValues["Chest X-ray images"]);
    }
    return this;
  }

  // Comprehensive verification of all page elements
  verifyAllPageElements(xrayInfo?: {
    "Date of X-ray"?: string;
    "Chest X-ray images"?: string[];
  }): CheckChestXrayImagesPage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyChangeLinksExist();
    this.verifySubmissionHeading();
    this.verifyWarningMessage();
    this.verifySaveAndContinueButton();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();

    // If expected values provided, verify them
    if (xrayInfo) {
      this.verifySummaryInfo(xrayInfo);
    }

    return this;
  }

  // Method to verify specific field value from summary list
  verifyField(fieldKey: string, expectedValue: string): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", fieldKey).then(($dt) => {
      const $value = $dt.siblings(".govuk-summary-list__value");
      const $valueColumn = $dt.siblings(".govuk-summary-value-column");

      // Check both possible value containers
      const $actualValue = $value.length > 0 ? $value : $valueColumn;

      cy.wrap($actualValue)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).to.contain(expectedValue);
        });
    });
    return this;
  }

  // Verify that the page shows the summary list structure
  verifySummaryListStructure(): CheckChestXrayImagesPage {
    cy.get("dl.govuk-summary-list").should("exist").and("be.visible");
    cy.get(".govuk-summary-list__row").should("have.length.at.least", 2);
    return this;
  }

  // Check redirection after form submission
  checkRedirectionAfterSubmit(expectedUrlPath: string): CheckChestXrayImagesPage {
    this.clickSaveAndContinue();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Verify the beta banner is displayed
  verifyBetaBanner(): CheckChestXrayImagesPage {
    cy.get(".govuk-phase-banner")
      .should("be.visible")
      .and("contain", "BETA")
      .and("contain", "This is a new service");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): CheckChestXrayImagesPage {
    cy.get(".govuk-footer__link").should("contain", "Privacy");
    cy.get(".govuk-footer__link").should("contain", "Accessibility statement");
    return this;
  }

  // Complete workflow: verify all elements and submit
  completeCheckAndSubmit(xrayInfo?: {
    "Date of X-ray"?: string;
    "Chest X-ray images"?: string[];
  }): CheckChestXrayImagesPage {
    this.verifyAllPageElements(xrayInfo);
    this.clickSaveAndContinue();
    return this;
  }

  // Verify number of uploaded images
  verifyNumberOfUploadedImages(expectedCount: number): CheckChestXrayImagesPage {
    cy.contains("dt.govuk-summary-list__key", "Chest X-ray images")
      .siblings(".govuk-summary-value-column")
      .find("dd.govuk-summary-list__value")
      .find("p.govuk-body")
      .filter((_index, element) => {
        return Cypress.$(element).text().trim() !== "";
      })
      .should("have.length", expectedCount);
    return this;
  }

  // Helper method to log available fields for debugging
  logAvailableFields(): CheckChestXrayImagesPage {
    cy.get("dt.govuk-summary-list__key").each(($dt) => {
      const fieldText = $dt.text().trim();
      cy.log(`Available field: "${fieldText}"`);
    });
    return this;
  }
}
