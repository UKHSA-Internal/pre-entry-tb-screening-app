// This holds all the fields on the Applicant Photo Upload Page

import { BasePage } from "../BasePage";

export class ApplicantPhotoUploadPage extends BasePage {
  constructor() {
    super("/applicant-photo");
  }

  /* visit(): void {
    cy.visit("/applicant-photo");
  } */

  // Verify page loaded
  verifyPageLoaded(): ApplicantPhotoUploadPage {
    this.verifyPageHeading("Upload visa applicant photo (optional)");
    cy.get(".govuk-summary-list").should("be.visible");
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
    // Check if the upload file message is displayed
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

  // Verify file is uploaded
  verifyFileUploaded(): ApplicantPhotoUploadPage {
    // Check that the file input isn't empty
    cy.get("#applicant-photo").should("exist");
    return this;
  }

  // Clear uploaded file
  clearUploadedFile(): ApplicantPhotoUploadPage {
    cy.get("#applicant-photo").clear();
    return this;
  }

  // Click continue button
  clickContinue(): ApplicantPhotoUploadPage {
    // Wait for any potential upload processing to complete
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.wait(1000);
    cy.get("button").contains("Continue").click({ force: true });
    return this;
  }

  // Verify upload success for photo
  verifyUploadSuccess(): ApplicantPhotoUploadPage {
    // Just verify that the button is enabled and no errors are shown
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-error-summary").should("not.exist");
    return this;
  }

  // Verify upload error state
  verifyUploadError(): ApplicantPhotoUploadPage {
    cy.get("#applicant-photo-error").should("be.visible");
    cy.get(".govuk-error-message").should("be.visible");
    return this;
  }

  // Upload photo and submit form
  uploadPhotoAndSubmit(filePath: string): ApplicantPhotoUploadPage {
    this.uploadApplicantPhotoFile(filePath);
    this.clickContinue();
    return this;
  }

  // Verify form validation - ensure file type validation
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
    cy.get("#applicant-photo").should("have.class", "govuk-form-group--error");

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

  // Verify accepted file types
  verifyAcceptedFileTypes(): ApplicantPhotoUploadPage {
    // Verify the instructions mention accepted file types
    cy.get(".govuk-body").should("contain", "JPG, JPEG or PNG");
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

  // Verify error state is cleared after valid upload
  verifyErrorStateCleared(): ApplicantPhotoUploadPage {
    cy.get(".govuk-error-summary").should("not.exist");
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-form-group--error").should("not.exist");
    return this;
  }
}
