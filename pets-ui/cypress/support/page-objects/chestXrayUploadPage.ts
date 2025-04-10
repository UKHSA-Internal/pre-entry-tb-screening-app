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
    cy.contains("h2", "Postero-anterior X-ray").should("be.visible");
    cy.contains("h2", "Apical lordotic X-ray (optional)").should("be.visible");
    cy.contains("h2", "Lateral decubitus X-ray (optional)").should("be.visible");
    return this;
  }

  // Upload postero-anterior X-ray file using label-based selector
  uploadPosteroAnteriorXray(filePath: string): ChestXrayUploadPage {
    cy.contains("h2", "Postero-anterior X-ray")
      .parent()
      .find('input[type="file"]')
      .selectFile(filePath, { force: true });
    return this;
  }

  // Upload apical lordotic X-ray file (optional)
  uploadApicalLordoticXray(filePath: string): ChestXrayUploadPage {
    cy.contains("h2", "Apical lordotic X-ray (optional)")
      .parent()
      .find('input[type="file"]')
      .selectFile(filePath, { force: true });
    return this;
  }

  // Upload lateral decubitus X-ray file (optional)
  uploadLateralDecubitusXray(filePath: string): ChestXrayUploadPage {
    cy.contains("h2", "Lateral decubitus X-ray (optional)")
      .parent()
      .find('input[type="file"]')
      .selectFile(filePath, { force: true });
    return this;
  }

  // Verify file is uploaded for a specific X-ray type
  verifyFileUploaded(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    // Check that the file input has a non-empty value
    cy.get(`input[name="${xrayType}"]`).should("not.have.value", "");
    return this;
  }

  // Clear uploaded file for a specific X-ray type
  clearUploadedFile(
    xrayType: "postero-anterior-xray" | "apical-lordotic-xray" | "lateral-decubitus-xray",
  ): ChestXrayUploadPage {
    cy.get(`input[name="${xrayType}"]`).clear();
    return this;
  }

  /// Click continue button
  clickContinue(): ChestXrayUploadPage {
    // Wait for any potential upload processing to complete
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get("button").contains("Continue").click({ force: true });

    return this;
  }

  // Verify upload success for X-ray images
  verifyUploadSuccess(): ChestXrayUploadPage {
    // Check the file is properly selected/uploaded for postero-anterior X-ray
    this.verifyFileUploaded("postero-anterior-xray");

    // Verify no error messages are visible
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
    cy.get('input[name="postero-anterior-xray"]').should("have.attr", "accept", "jpg,jpeg,png,pdf");
    cy.get('input[name="apical-lordotic-xray"]').should("have.attr", "accept", "jpg,jpeg,png,pdf");
    cy.get('input[name="lateral-decubitus-xray"]').should(
      "have.attr",
      "accept",
      "jpg,jpeg,png,pdf",
    );
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
    this.verifyAcceptedFileTypes();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
