// This holds all the fields on the Applicant Photo Upload Page

import { BasePage } from "../BasePage";

export class ApplicantPhotoUploadPage extends BasePage {
  constructor() {
    super("/applicant-photo");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantPhotoUploadPage {
    this.verifyPageHeading("Upload visa applicant photo (optional)");
    return this;
  }

  // Verify Applicant upload section is displayed
  verifyApplicantPhotoUploadSectionDisplayed(): ApplicantPhotoUploadPage {
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
    cy.get('[data-testid="applicant-photo"]').selectFile(filePath, { force: true });
    return this;
  }

  // Verify file is uploaded
  verifyFileUploaded(): ApplicantPhotoUploadPage {
    cy.get('[data-testid="applicant-photo"]').should("exist");
    return this;
  }

  // Clear uploaded file
  clearUploadedFile(): ApplicantPhotoUploadPage {
    cy.get('[data-testid="applicant-photo"]').clear();
    return this;
  }

  // Click continue button
  clickContinue(): ApplicantPhotoUploadPage {
    cy.get("button[type='submit']").contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get("button[type='submit']").contains("Continue").click({ force: true });
    return this;
  }

  // Verify upload success for photo
  verifyUploadSuccess(): ApplicantPhotoUploadPage {
    cy.get("button[type='submit']").contains("Continue").should("be.visible").and("be.enabled");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-error-summary").should("not.exist");
    return this;
  }

  // Upload photo and submit form
  uploadPhotoAndSubmit(filePath: string): ApplicantPhotoUploadPage {
    this.uploadApplicantPhotoFile(filePath);
    this.clickContinue();
    return this;
  }

  // Verify form validation - ensure photo is optional
  verifyFormValidation(): ApplicantPhotoUploadPage {
    // Submit form without uploading photo
    this.clickContinue();

    // Since photo is optional, no validation error should be displayed
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-error-summary").should("not.exist");
    return this;
  }

  // Verify file type validation with specific error message
  verifyFileTypeValidation(
    filePath: string,
    expectedErrorMessage: string,
  ): ApplicantPhotoUploadPage {
    // Upload invalid file type
    this.uploadApplicantPhotoFile(filePath);

    // Try to continue
    this.clickContinue();

    // Verify error summary is displayed
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain", "There is a problem");

    // Verify specific error message in error summary
    cy.get(".govuk-error-summary__list").should("contain", expectedErrorMessage);

    // Verify error message next to the field
    cy.get(".govuk-error-message").should("be.visible").and("contain", expectedErrorMessage);

    // Verify the form group has error styling
    cy.get(".govuk-form-group--error").should("exist");

    return this;
  }

  // Verify file size validation
  verifyFileSizeValidation(filePath: string): ApplicantPhotoUploadPage {
    this.uploadApplicantPhotoFile(filePath);
    this.clickContinue();

    // Verify file size error message
    cy.get(".govuk-error-message").should("be.visible").and("contain", "must be less than 10MB");

    return this;
  }

  // Verify accepted file types are mentioned in instructions
  verifyAcceptedFileTypes(): ApplicantPhotoUploadPage {
    cy.get(".govuk-body").should("contain", "JPG, JPEG or PNG");
    return this;
  }

  // Verify error state is cleared after valid upload
  verifyErrorStateCleared(): ApplicantPhotoUploadPage {
    cy.get(".govuk-error-summary").should("not.exist");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-form-group--error").should("not.exist");
    return this;
  }

  // Verify invalid file type scenarios
  verifyInvalidFileType(filePath: string): ApplicantPhotoUploadPage {
    return this.verifyFileTypeValidation(filePath, "The selected file must be a JPG, JPEG or PNG");
  }

  // Verify large file scenarios
  verifyOversizedFile(filePath: string): ApplicantPhotoUploadPage {
    return this.verifyFileSizeValidation(filePath);
  }

  // Main validation method for file types
  validateFileTypes(): ApplicantPhotoUploadPage {
    this.verifyPageLoaded();
    this.verifyApplicantPhotoUploadSectionDisplayed();
    this.verifyAcceptedFileTypes();
    return this;
  }
}
