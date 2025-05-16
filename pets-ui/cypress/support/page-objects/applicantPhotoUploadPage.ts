// This holds all the fields on the Applicant Photo Upload Page

import { BasePage } from "../BasePage";

export class ApplicantPhotoUploadPage extends BasePage {
  constructor() {
    super("/applicant-photo");
  }

  visit(): void {
    cy.visit("/applicant-photo");
  }
  // Verify page loaded
  verifyPageLoaded(): ApplicantPhotoUploadPage {
    this.verifyPageHeading("Upload visa applicant photo (optional)");
    // cy.get(".govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ApplicantPhotoUploadPage {
    this.verifySummaryValues(expectedValues);
    return this;
  }

  // Verify Applicant upload section is displayed
  verifyApplicantPhotoUploadSectionDisplayed(): ApplicantPhotoUploadPage {
    // Check if the the upload file message is displayed
    cy.get(".govuk-body")
      .should("be.visible")
      .and(
        "contain",
        "Select a file to upload. File type must be JPG, JPEG or PNG. Images must be less than 10MB.",
      );
    return this;
  }

  // Upload Applicant Photo file
  uploadApplicantPhotoFile(filePath: string): ApplicantPhotoUploadPage {
    cy.get('input[id="applicant-photo"], input[name="applicantPhotoFileName"]').selectFile(
      filePath,
      { force: true },
    );
    return this;
  }

  // // Verify file is uploaded
  // verifyFileUploaded(
  //   imageType: "Photo",
  // ): ApplicantPhotoUploadPage {
  //   // Check that the file input has a no empty value
  //   cy.get(`#${imageType}`).should("exist");
  //   return this;
  // }

  // // Clear uploaded file for a specific X-ray type
  // clearUploadedFile(
  //   imageType: "Photo",
  // ): ApplicantPhotoUploadPage {
  //   cy.get(`#${imageType}`).clear();
  //   return this;
  // }

  // Click continue button
  clickContinue(): ApplicantPhotoUploadPage {
    // Wait for any potential upload processing to complete - intermittently slow have added a wait
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get("button").contains("Continue").click({ force: true });

    return this;
  }

  // Verify upload success for X-ray images
  verifyUploadSuccess(): ApplicantPhotoUploadPage {
    // Just verify that the button is enabled and no errors are shown
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.get(".govuk-error-message").should("not.exist");
    return this;
  }

  // // Verify upload error state
  // verifyUploadError(
  //   imageType: "Photo",
  // ): ApplicantPhotoUploadPage {
  //   cy.get(`#${photoType}-error`).should("be.visible");
  //   cy.get(".govuk-error-message").should("be.visible");
  //   return this;
  // }

  // Upload file and submit form
  uploadPhotoAndSubmit(filePath: string): ApplicantPhotoUploadPage {
    this.uploadApplicantPhotoFile(filePath);
    this.clickContinue();
    return this;
  }

  // Verify form validation - ensure mandatory file is uploaded
  // verifyFormValidation(): ApplicantPhotoUploadPage {
  //   // Submit form without uploading photo
  //   this.clickContinue();

  //   // Verify validation error is displayed
  //   cy.get(".govuk-error-message").should("be.visible");
  //   return this;
  // }

  // Verify file types are accepted
  verifyAcceptedFileTypes(): ApplicantPhotoUploadPage {
    return this;
  }

  // Check all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): ApplicantPhotoUploadPage {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyApplicantPhotoUploadSectionDisplayed();
    this.verifyBreadcrumbNavigation();
    this.verifyServiceName();
    return this;
  }
}
