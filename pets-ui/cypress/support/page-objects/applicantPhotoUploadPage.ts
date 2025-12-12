// This holds all the fields on the Applicant Photo Upload Page

import { BasePage } from "../BasePage";

export class ApplicantPhotoUploadPage extends BasePage {
  constructor() {
    super("/upload-visa-applicant-photo");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantPhotoUploadPage {
    this.verifyPageHeading("Upload visa applicant photo (optional)");
    return this;
  }

  // Verify Applicant upload section is displayed
  verifyApplicantPhotoUploadSectionDisplayed(): ApplicantPhotoUploadPage {
    cy.get(".govuk-heading-m").should("be.visible").and("contain", "The photo must:");
    return this;
  }

  // Verify file upload instructions text
  verifyFileUploadInstructions(): ApplicantPhotoUploadPage {
    cy.contains(
      "p.govuk-body",
      "Select a file to upload. File type must be JPG, JPEG or PNG. Images must be less than 10MB.",
    ).should("be.visible");
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

  // Verify "No file chosen" text is displayed
  verifyNoFileChosenText(): ApplicantPhotoUploadPage {
    cy.contains(".file-upload-no-file", "No file chosen").should("be.visible");
    return this;
  }

  // Verify "Choose file" button exists
  verifyChooseFileButtonExists(): ApplicantPhotoUploadPage {
    cy.contains("button.govuk-button--secondary", "Choose file")
      .should("be.visible")
      .and("have.attr", "type", "submit");
    return this;
  }

  // Click "Choose file" button
  clickChooseFileButton(): ApplicantPhotoUploadPage {
    cy.contains("button.govuk-button--secondary", "Choose file").click();
    return this;
  }

  // Verify "or drop file" text is displayed
  verifyDropFileText(): ApplicantPhotoUploadPage {
    cy.contains(".file-upload-or-drop", "or drop file").should("be.visible");
    return this;
  }

  // Verify file upload drop zone exists
  verifyFileUploadDropZone(): ApplicantPhotoUploadPage {
    cy.get('[role="application"][aria-label="File drop zone"]')
      .should("be.visible")
      .and("have.attr", "data-module", "govuk-file-upload");
    return this;
  }

  // Verify file upload blue bar exists
  verifyFileUploadBlueBar(): ApplicantPhotoUploadPage {
    cy.get(".file-upload-blue-bar").should("be.visible");
    return this;
  }

  // Verify file input has correct attributes
  verifyFileInputAttributes(): ApplicantPhotoUploadPage {
    cy.get("#applicant-photo")
      .should("have.attr", "type", "file")
      .and("have.attr", "name", "applicantPhotoFileName")
      .and("have.attr", "data-testid", "applicant-photo");
    return this;
  }

  // Verify visually hidden label for accessibility
  verifyVisuallyHiddenLabel(): ApplicantPhotoUploadPage {
    cy.get("label.govuk-visually-hidden[for='applicant-photo']")
      .should("exist")
      .and("contain.text", "applicant-photo file upload");
    return this;
  }

  // Verify back link exists and points to correct page
  verifyBackLink(): ApplicantPhotoUploadPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/enter-applicant-information");
    return this;
  }

  // Click back link
  clickBackLink(): ApplicantPhotoUploadPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Click continue button
  clickContinue(): ApplicantPhotoUploadPage {
    // Filter for visible buttons only and ensure there's exactly one
    cy.get("button[type='submit']")
      .contains("Continue")
      .filter(":visible")
      .should("have.length", 1)
      .should("be.enabled")
      .click();
    return this;
  }

  // Verify continue button exists
  verifyContinueButtonExists(): ApplicantPhotoUploadPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify continue button exists
  verifyContinueButtonExists(): ApplicantPhotoUploadPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .should("be.visible")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify upload success for photo
  verifyUploadSuccess(): ApplicantPhotoUploadPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .and("be.enabled");
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
    cy.get(".govuk-body ul").should("contain", "JPG, JPEG or PNG");
    return this;
  }

  // Verify file size limit is mentioned
  verifyFileSizeLimit(): ApplicantPhotoUploadPage {
    cy.get(".govuk-body").should("contain", "less than 10MB");
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

  // Verify beta banner exists
  verifyBetaBanner(): ApplicantPhotoUploadPage {
    cy.get(".govuk-phase-banner")
      .should("be.visible")
      .within(() => {
        cy.contains(".govuk-tag", "BETA").should("be.visible");
        cy.contains("This is a new service. Help us improve it and").should("be.visible");
      });
    return this;
  }

  // Verify Sign Out link exists
  verifySignOutLinkExists(): ApplicantPhotoUploadPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain.text", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Click Sign Out link
  clickSignOut(): ApplicantPhotoUploadPage {
    cy.get("#sign-out").click();
    return this;
  }

  // Verify footer links exist
  verifyFooterLinks(): ApplicantPhotoUploadPage {
    cy.get(".govuk-footer").within(() => {
      cy.contains("a", "Privacy").should("be.visible").and("have.attr", "href", "/privacy-notice");
      cy.contains("a", "Cookies").should("be.visible").and("have.attr", "href", "/cookies");
      cy.contains("a", "Accessibility statement")
        .should("be.visible")
        .and("have.attr", "href", "/accessibility-statement");
    });
    return this;
  }

  // Verify GOV.UK logo exists
  verifyGovUKLogo(): ApplicantPhotoUploadPage {
    cy.get(".govuk-header__logo")
      .should("be.visible")
      .find("svg")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Verify service name in header
  verifyServiceNameInHeader(): ApplicantPhotoUploadPage {
    cy.get(".govuk-service-navigation__service-name a")
      .should("be.visible")
      .and("contain.text", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify skip to main content link
  verifySkipLink(): ApplicantPhotoUploadPage {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain.text", "Skip to main content");
    return this;
  }

  // Verify the file upload component structure
  verifyFileUploadComponentStructure(): ApplicantPhotoUploadPage {
    cy.get("#applicant-photo.govuk-form-group").within(() => {
      cy.get("fieldset.govuk-fieldset").should("exist");
      cy.get(".file-upload-existing-file").should("exist");
      cy.get(".file-upload-blue-bar").should("exist");
      cy.get(".file-upload-row").should("exist");
    });
    return this;
  }

  // Verify complete page structure
  verifyCompletePageStructure(): ApplicantPhotoUploadPage {
    this.verifyPageLoaded();
    this.verifyBackLink();
    this.verifyFileUploadInstructions();
    this.verifyFileUploadComponentStructure();
    this.verifyNoFileChosenText();
    this.verifyChooseFileButtonExists();
    this.verifyDropFileText();
    this.verifyContinueButtonExists();
    return this;
  }

  // Verify page URL
  verifyPageUrl(): ApplicantPhotoUploadPage {
    cy.url().should("include", "/upload-visa-applicant-photo");
    return this;
  }

  // Verify passport photo rules link exists
  verifyPassportPhotoRulesLink(): ApplicantPhotoUploadPage {
    cy.get(".govuk-body ul li a")
      .should("be.visible")
      .and("contain", "rules for a passport digital photo")
      .and("have.attr", "href", "https://www.gov.uk/photos-for-passports#rules-for-digital-photos")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
    return this;
  }

  // Verify "More information" section exists
  verifyMoreInformationSection(): ApplicantPhotoUploadPage {
    cy.get(".govuk-footer").within(() => {
      cy.contains("h2", "More information").should("be.visible");
      cy.contains("a", "UK tuberculosis technical instructions")
        .should("be.visible")
        .and(
          "have.attr",
          "href",
          "https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions",
        )
        .and("have.attr", "target", "_blank");
    });
    return this;
  }

  // Verify UK Health Security Agency footer text
  verifyUKHSAFooter(): ApplicantPhotoUploadPage {
    cy.get(".govuk-footer").within(() => {
      cy.contains("Built by").should("be.visible");
      cy.contains("a", "UK Health Security Agency")
        .should("be.visible")
        .and(
          "have.attr",
          "href",
          "https://www.gov.uk/government/organisations/uk-health-security-agency",
        );
    });
    return this;
  }
}
