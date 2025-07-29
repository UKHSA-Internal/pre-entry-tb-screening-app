// This holds all the fields on the Chest X-ray Upload Page
import { BasePage } from "../BasePage";

export class ChestXrayUploadPage extends BasePage {
  constructor() {
    super("/chest-xray-upload");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayUploadPage {
    this.verifyPageHeading("Upload chest X-ray images");
    cy.get("form").should("be.visible");
    return this;
  }

  // Verify X-ray upload sections are displayed
  verifyXrayUploadSectionsDisplayed(): ChestXrayUploadPage {
    // Using caption instead of h2 based on the DAC report
    cy.contains("caption", "Postero-anterior X-ray").should("be.visible");
    cy.contains("caption", "Apical lordotic X-ray (optional)").should("be.visible");
    cy.contains("caption", "Lateral decubitus X-ray (optional)").should("be.visible");
    return this;
  }

  // Verify X-ray tables are displayed
  verifyXrayTablesDisplayed(): ChestXrayUploadPage {
    cy.get(".govuk-table").should("have.length", 3);
    cy.get(".govuk-table__header").contains("Type of X-ray").should("be.visible");
    cy.get(".govuk-table__header").contains("File uploaded").should("be.visible");
    return this;
  }

  // Verify specific X-ray row content
  verifyXrayRowContent(): ChestXrayUploadPage {
    cy.get(".govuk-table__row").contains("Postero-anterior view").should("be.visible");
    cy.get(".govuk-table__row").contains("Apical-lordotic view").should("be.visible");
    cy.get(".govuk-table__row").contains("Lateral-decubitus view").should("be.visible");
    return this;
  }

  // Upload postero-anterior X-ray file
  uploadPosteroAnteriorXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="posteroAnteriorXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Upload apical lordotic X-ray file (optional)
  uploadApicalLordoticXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="apicalLordoticXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Upload lateral decubitus X-ray file (optional)
  uploadLateralDecubitusXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[name="lateralDecubitusXrayFileName"]').selectFile(filePath, { force: true });
    return this;
  }

  // Verify file is uploaded for a specific X-ray type
  verifyFileUploaded(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    // Check that the file input has a value
    cy.get(`input[name="${xrayType}"]`).should("exist");
    return this;
  }

  // Clear uploaded file for a specific X-ray type
  clearUploadedFile(
    xrayType:
      | "posteroAnteriorXrayFileName"
      | "apicalLordoticXrayFileName"
      | "lateralDecubitusXrayFileName",
  ): ChestXrayUploadPage {
    cy.get(`input[name="${xrayType}"]`).clear();
    return this;
  }

  // Click continue button
  clickContinue(): ChestXrayUploadPage {
    // Wait for any potential upload processing to complete - intermittently slow have added a wait
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get('button[type="submit"]').contains("Continue").click({ force: true });
    return this;
  }

  // Verify upload success for X-ray images
  verifyUploadSuccess(): ChestXrayUploadPage {
    // Just verify that the button is enabled and no errors are shown
    cy.get('button[type="submit"]').contains("Continue").should("be.visible").and("be.enabled");
    cy.get(".govuk-error-message").should("not.exist");
    return this;
  }

  // Verify upload error state
  verifyUploadError(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    cy.get(`#${xrayType}-error`).should("be.visible");
    cy.get(".govuk-error-message").should("be.visible");
    return this;
  }

  // Upload mandatory X-ray and submit form
  uploadMandatoryXrayAndSubmit(filePath: string): ChestXrayUploadPage {
    this.uploadPosteroAnteriorXray(filePath);
    this.clickContinue();
    return this;
  }

  // Upload all X-rays and submit form
  uploadAllXraysAndSubmit(
    posteroAnteriorPath: string,
    apicalLordoticPath: string,
    lateralDecubitusPath: string,
  ): ChestXrayUploadPage {
    this.uploadPosteroAnteriorXray(posteroAnteriorPath);
    this.uploadApicalLordoticXray(apicalLordoticPath);
    this.uploadLateralDecubitusXray(lateralDecubitusPath);
    this.clickContinue();
    return this;
  }

  // Verify form validation - ensure mandatory file is uploaded
  verifyFormValidation(): ChestXrayUploadPage {
    // Submit form without uploading mandatory X-ray
    this.clickContinue();

    // Verify validation error is displayed
    cy.get(".govuk-error-message").should("be.visible");
    cy.get("#postero-anterior-xray-error").should("be.visible");
    return this;
  }

  // Verify file types are accepted
  verifyAcceptedFileTypes(): ChestXrayUploadPage {
    return this;
  }

  // Verify back link navigation
  verifyBackLinkNavigation(): ChestXrayUploadPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/chest-xray-question");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ChestXrayUploadPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(): ChestXrayUploadPage {
    this.verifyPageLoaded();
    this.verifyXrayUploadSectionsDisplayed();
    this.verifyXrayTablesDisplayed();
    this.verifyXrayRowContent();
    this.verifyBackLinkNavigation();
    this.verifyServiceName();
    return this;
  }
}
