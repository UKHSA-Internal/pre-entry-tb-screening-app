// This holds all the fields on the Check Visa Applicant Photo Page

import { BasePage } from "../BasePage";

export class CheckVisaApplicantPhotoPage extends BasePage {
  pageUrl = "/check-visa-applicant-photo";

  constructor() {
    super("/check-visa-applicant-photo");
  }

  // Verify page loaded
  verifyPageLoaded(): CheckVisaApplicantPhotoPage {
    cy.url().should("include", this.pageUrl);
    cy.get("h1.govuk-heading-l").should("exist");
    return this;
  }
  // Verify page heading text
  verifyPageHeadingText(): CheckVisaApplicantPhotoPage {
    this.verifyPageHeading("Check visa applicant photo");
    return this;
  }

  // Verify uploaded photo is displayed
  verifyUploadedPhotoDisplayed(): CheckVisaApplicantPhotoPage {
    cy.get('img[alt="Applicant preview"]').should("be.visible");
    return this;
  }

  // Verify filename and filesize are displayed
  verifyFilenameAndSize(filename: string, filesize: string): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-body").should("contain", filename).and("contain", filesize);
    return this;
  }

  // Verify any filename is displayed (when we don't know exact name)
  verifyFilenameDisplayed(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-grid-column-one-half .govuk-body").should("be.visible").and("not.be.empty");
    return this;
  }

  // Select "Yes, add this photo" option (radio input has opacity: 0 in GOV.UK design)
  selectYesAddPhoto(): CheckVisaApplicantPhotoPage {
    cy.get('[data-testid="confirm-photo"][name="confirmPhoto"][value="Yes, add this photo"]')
      .should("exist")
      .check({ force: true });
    return this;
  }

  // Select "No, choose a different photo" option (radio input has opacity: 0 in GOV.UK design)
  selectNoChooseDifferent(): CheckVisaApplicantPhotoPage {
    cy.get(
      '[data-testid="confirm-photo"][name="confirmPhoto"][value="No, choose a different photo"]',
    )
      .should("exist")
      .check({ force: true });
    return this;
  }

  // Alternative: Click the label for "Yes, add this photo" (simulates actual user interaction)
  clickYesAddPhotoLabel(): CheckVisaApplicantPhotoPage {
    cy.get('label[for="confirm-photo-0"]').should("be.visible").click();
    return this;
  }

  // Alternative: Click the label for "No, choose a different photo" (simulates actual user interaction)
  clickNoChooseDifferentLabel(): CheckVisaApplicantPhotoPage {
    cy.get('label[for="confirm-photo-1"]').should("be.visible").click();
    return this;
  }

  // Verify radio buttons exist (they have opacity: 0 in GOV.UK design system)
  verifyRadioButtonsExist(): CheckVisaApplicantPhotoPage {
    cy.get('[data-testid="confirm-photo"][name="confirmPhoto"][value="Yes, add this photo"]')
      .should("exist")
      .and("have.attr", "type", "radio");
    cy.get(
      '[data-testid="confirm-photo"][name="confirmPhoto"][value="No, choose a different photo"]',
    )
      .should("exist")
      .and("have.attr", "type", "radio");
    return this;
  }

  // Verify radio button labels
  verifyRadioButtonLabels(): CheckVisaApplicantPhotoPage {
    cy.get('label[for="confirm-photo-0"]')
      .should("be.visible")
      .and("contain", "Yes, add this photo");
    cy.get('label[for="confirm-photo-1"]')
      .should("be.visible")
      .and("contain", "No, choose a different photo");
    return this;
  }

  // Click continue button
  clickContinue(): CheckVisaApplicantPhotoPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .should("be.visible")
      .should("be.enabled")
      .click();
    return this;
  }

  // Verify continue button exists
  verifyContinueButtonExists(): CheckVisaApplicantPhotoPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .should("be.visible")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify passport photo rules link
  verifyPassportPhotoRulesLink(): CheckVisaApplicantPhotoPage {
    cy.get('.govuk-link[href="https://www.gov.uk/photos-for-passports#rules-for-digital-photos"]')
      .should("be.visible")
      .and("contain", "rules for digital photos")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
    return this;
  }

  // Click passport photo rules link (for testing new tab behavior)
  clickPassportPhotoRulesLink(): CheckVisaApplicantPhotoPage {
    cy.get(
      '.govuk-link[href="https://www.gov.uk/photos-for-passports#rules-for-digital-photos"]',
    ).should("have.attr", "target", "_blank");
    return this;
  }

  // Verify back link exists and points to correct page
  verifyBackLink(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("contain", "Back")
      .and("have.attr", "href", "/upload-visa-applicant-photo");
    return this;
  }

  // Click back link
  clickBackLink(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify page URL
  verifyPageUrl(): CheckVisaApplicantPhotoPage {
    cy.url().should("include", "/check-visa-applicant-photo");
    return this;
  }

  // Verify image is displayed in correct layout (two-column grid)
  verifyImageLayout(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-one-half").should("exist");
    cy.get(".govuk-grid-column-one-half img").should("be.visible");
    return this;
  }

  // Verify radio button validation error (if no selection made)
  verifyRadioButtonValidationError(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-error-message").should("be.visible");
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title").should("contain", "There is a problem");
    return this;
  }

  // Verify no validation errors are shown
  verifyNoValidationErrors(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-error-message").should("not.exist");
    cy.get(".govuk-error-summary").should("not.exist");
    return this;
  }

  // Verify complete page structure
  verifyCompletePageStructure(): CheckVisaApplicantPhotoPage {
    this.verifyPageLoaded();
    this.verifyBackLink();
    this.verifyUploadedPhotoDisplayed();
    this.verifyImageLayout();
    this.verifyRadioButtonsExist();
    this.verifyRadioButtonLabels();
    this.verifyPassportPhotoRulesLink();
    this.verifyContinueButtonExists();
    return this;
  }

  // Verify photo confirmation fieldset
  verifyPhotoConfirmationFieldset(): CheckVisaApplicantPhotoPage {
    cy.get("#confirm-photo.govuk-form-group").should("exist");
    cy.get("fieldset.govuk-fieldset").should("exist");
    cy.get(".govuk-radios[data-module='govuk-radios']").should("exist");
    return this;
  }

  // Verify rules for digital photos link text
  verifyRulesLinkText(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-body")
      .contains("Check the")
      .parent()
      .should("contain", "rules for digital photos (opens in new tab)");
    return this;
  }

  // Verify beta banner exists
  verifyBetaBanner(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-phase-banner")
      .should("be.visible")
      .within(() => {
        cy.contains(".govuk-tag", "BETA").should("be.visible");
        cy.contains("This is a new service. Help us improve it and").should("be.visible");
      });
    return this;
  }

  // Verify Sign Out link exists
  verifySignOutLinkExists(): CheckVisaApplicantPhotoPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("contain.text", "Sign out")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Click Sign Out link
  clickSignOut(): CheckVisaApplicantPhotoPage {
    cy.get("#sign-out").click();
    return this;
  }

  // Verify footer links exist
  verifyFooterLinks(): CheckVisaApplicantPhotoPage {
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
  verifyGovUKLogo(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-header__logo")
      .should("be.visible")
      .find("svg")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Verify service name in header
  verifyServiceNameInHeader(): CheckVisaApplicantPhotoPage {
    cy.get(".govuk-service-navigation__service-name a")
      .should("be.visible")
      .and("contain.text", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }
}
