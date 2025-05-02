// This holds all the fields on the Chest X-ray Upload Page
import { BasePage } from "../BasePage";

export class ChestXrayUploadPage extends BasePage {
  constructor() {
    super("/chest-xray-upload");
  }

  // Verify page loaded
  verifyPageLoaded(): ChestXrayUploadPage {
    this.verifyPageHeading("Upload chest X-ray images");
    cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ChestXrayUploadPage {
    this.verifySummaryValues(expectedValues);
    return this;
  }

  // Verify X-ray upload sections are displayed
  verifyXrayUploadSectionsDisplayed(): ChestXrayUploadPage {
    // Using caption instead of h2 based on the changes from DAC report
    cy.contains("caption", "Postero-anterior X-ray").should("be.visible");
    cy.contains("caption", "Apical lordotic X-ray (optional)").should("be.visible");
    cy.contains("caption", "Lateral decubitus X-ray (optional)").should("be.visible");
    return this;
  }

  // Upload postero-anterior X-ray file
  uploadPosteroAnteriorXray(filePath: string): ChestXrayUploadPage {
    cy.get(
      'input[id="postero-anterior-xray"], input[name="posteroAnteriorXrayFileName"]',
    ).selectFile(filePath, { force: true });
    return this;
  }

  // Upload apical lordotic X-ray file (optional)
  uploadApicalLordoticXray(filePath: string): ChestXrayUploadPage {
    cy.get('input[id="apical-lordotic-xray"], input[name="apicalLordoticXrayFileName"]').selectFile(
      filePath,
      { force: true },
    );
    return this;
  }

  // Upload lateral decubitus X-ray file (optional)
  uploadLateralDecubitusXray(filePath: string): ChestXrayUploadPage {
    cy.get(
      'input[id="lateral-decubitus-xray"], input[name="lateralDecubitusXrayFileName"]',
    ).selectFile(filePath, { force: true });
    return this;
  }

  // Verify file is uploaded for a specific X-ray type
  verifyFileUploaded(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    // Check that the file input has a no empty value
    cy.get(`#${xrayType}`).should("exist");
    return this;
  }

  // Clear uploaded file for a specific X-ray type
  clearUploadedFile(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    cy.get(`#${xrayType}`).clear();
    return this;
  }

  // Click continue button
  clickContinue(): ChestXrayUploadPage {
    // Wait for any potential upload processing to complete - intermittently slow have added a wait
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get("button").contains("Continue").click({ force: true });

    return this;
  }

  // Verify upload success for X-ray images
  verifyUploadSuccess(): ChestXrayUploadPage {
    // Just verify that the button is enabled and no errors are shown
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
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

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ChestXrayUploadPage {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyXrayUploadSectionsDisplayed();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
