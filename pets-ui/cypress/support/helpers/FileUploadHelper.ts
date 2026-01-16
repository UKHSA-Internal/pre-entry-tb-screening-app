/**
 * FileUploadHelper - Handles all file upload interactions and verifications
 * Provides methods for uploading files, verifying uploads, and checking file errors
 */
export class FileUploadHelper {
  // File upload methods
  uploadFile(fieldName: string, filePath: string): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).selectFile(filePath, { force: true });
    return this;
  }

  uploadFileBySelector(selector: string, filePath: string): FileUploadHelper {
    cy.get(selector).selectFile(filePath, { force: true });
    return this;
  }

  uploadMultipleFiles(fieldName: string, filePaths: string[]): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).selectFile(filePaths, { force: true });
    return this;
  }

  // Verify file uploaded
  verifyFileUploaded(fieldName: string): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).should("exist");
    return this;
  }

  verifyFileUploadedBySelector(selector: string): FileUploadHelper {
    cy.get(selector).should("exist");
    return this;
  }

  // Clear uploaded file
  clearUploadedFile(fieldName: string): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).clear();
    return this;
  }

  clearUploadedFileBySelector(selector: string): FileUploadHelper {
    cy.get(selector).clear();
    return this;
  }

  // Verify file upload error
  verifyFileUploadError(fieldName: string, errorMessage?: string): FileUploadHelper {
    cy.get(`#${fieldName}-error`).should("be.visible");
    if (errorMessage) {
      cy.get(".govuk-error-message").should("be.visible").and("contain", errorMessage);
    }
    return this;
  }

  // Verify file drop zone
  verifyFileDropZone(dropZoneId: string): FileUploadHelper {
    cy.get(`#${dropZoneId}`).should("be.visible");
    cy.get(`#${dropZoneId}`).within(() => {
      cy.get(".file-upload-blue-bar").should("be.visible");
      cy.contains("button.govuk-button--secondary", "Choose file").should("be.visible");
    });
    return this;
  }

  // Verify "No file chosen" text
  verifyNoFileChosen(containerId: string): FileUploadHelper {
    cy.get(`#${containerId}`).within(() => {
      cy.contains(".file-upload-no-file", "No file chosen").should("be.visible");
    });
    return this;
  }

  // Verify file upload instructions
  verifyFileUploadInstructions(instructionText?: string): FileUploadHelper {
    if (instructionText) {
      cy.contains("p.govuk-body", instructionText).should("be.visible");
    }
    cy.get(".govuk-hint").should("be.visible");
    return this;
  }

  // Wait for upload to complete
  waitForUpload(duration: number = 1000): FileUploadHelper {
    cy.wait(duration);
    return this;
  }

  // Verify file input is visible
  verifyFileInputVisible(fieldName: string): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).should("exist");
    return this;
  }

  // Verify file has been selected (has a value)
  verifyFileSelected(fieldName: string): FileUploadHelper {
    cy.get(`input[name="${fieldName}"]`).should(($input) => {
      const files = ($input[0] as HTMLInputElement).files;
      expect(files).to.have.length.greaterThan(0);
    });
    return this;
  }
}
