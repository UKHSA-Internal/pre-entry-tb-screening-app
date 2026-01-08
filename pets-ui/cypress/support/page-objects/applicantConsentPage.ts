// This holds all fields of the Applicant Consent Page
import { BasePage } from "../BasePage";
import { ApplicantDetailsPage } from "./applicantDetailsPage";
import { GetWrittenConsentPage } from "./getWrittenConsentPage";

export class ApplicantConsentPage extends BasePage {
  constructor() {
    super("/do-you-have-visa-applicant-written-consent-for-tb-screening");
  }

  // Verify page loaded
  verifyPageLoaded(): ApplicantConsentPage {
    cy.url().should("include", "/do-you-have-visa-applicant-written-consent-for-tb-screening");
    cy.contains("h1", "Do you have the visa applicant's written consent for TB screening?").should(
      "be.visible",
    );
    cy.get("#do-you-have-consent").should("exist");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): ApplicantConsentPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Do you have the visa applicant's written consent for TB screening?");
    return this;
  }

  // Verify hint text
  verifyHintText(): ApplicantConsentPage {
    cy.get("#do-you-have-consent-hint")
      .should("be.visible")
      .and(
        "contain",
        "The visa applicant (or their parent or guardian) must have signed a paper consent form before you start TB screening",
      );
    return this;
  }

  // Select consent option
  selectConsent(consent: "Yes" | "No"): ApplicantConsentPage {
    cy.get(`input[type='radio'][value='${consent}']`).check();
    return this;
  }

  // Verify consent option is selected
  verifyConsentSelected(consent: "Yes" | "No"): ApplicantConsentPage {
    cy.get(`input[type='radio'][value='${consent}']`).should("be.checked");
    return this;
  }

  // Verify no consent is selected
  verifyNoConsentSelected(): ApplicantConsentPage {
    cy.get("input[type='radio'][name='consent']:checked").should("not.exist");
    return this;
  }

  // Helper method to get the selected consent value
  getSelectedConsent(): Cypress.Chainable<string> {
    return cy.get("input[type='radio'][name='consent']:checked").invoke("val");
  }

  // Verify radio buttons are inline
  verifyRadioButtonsInline(): ApplicantConsentPage {
    cy.get(".govuk-radios--inline").should("exist");
    return this;
  }

  // Verify both radio options exist
  verifyRadioOptions(): ApplicantConsentPage {
    cy.get("input[type='radio'][value='Yes']").should("exist");
    cy.get("input[type='radio'][value='No']").should("exist");
    cy.contains("label", "Yes").should("be.visible");
    cy.contains("label", "No").should("be.visible");
    return this;
  }

  // Verify radio input attributes
  verifyRadioInputAttributes(consent: "Yes" | "No"): ApplicantConsentPage {
    const index = consent === "Yes" ? "0" : "1";
    cy.get(`#do-you-have-consent-${index}`)
      .should("have.attr", "type", "radio")
      .and("have.attr", "value", consent)
      .and("have.attr", "name", "consent")
      .and("have.attr", "data-testid", "do-you-have-consent");
    return this;
  }

  // Verify all radio input attributes
  verifyAllRadioInputAttributes(): ApplicantConsentPage {
    this.verifyRadioInputAttributes("Yes");
    this.verifyRadioInputAttributes("No");
    return this;
  }

  // Click continue button
  clickContinue(): ApplicantConsentPage {
    cy.get("button[type='submit']")
      .contains("Continue")
      .filter(":visible")
      .first()
      .should("be.visible")
      .click();
    return this;
  }

  // Complete form with consent selection
  completeForm(consent: "Yes" | "No"): ApplicantConsentPage {
    this.selectConsent(consent);
    this.clickContinue();
    return this;
  }

  // Navigate to Applicant Details page after selecting "Yes"
  continueToApplicantDetails(): ApplicantDetailsPage {
    this.selectConsent("Yes");
    this.clickContinue();
    return new ApplicantDetailsPage();
  }

  // Navigate to Get Written Consent page after selecting "No"
  continueToGetWrittenConsent(): GetWrittenConsentPage {
    this.selectConsent("No");
    this.clickContinue();
    return new GetWrittenConsentPage();
  }

  // Generic navigation based on consent choice
  continueWithConsent(consent: "Yes" | "No"): ApplicantDetailsPage | GetWrittenConsentPage {
    this.selectConsent(consent);
    this.clickContinue();

    if (consent === "Yes") {
      return new ApplicantDetailsPage();
    } else {
      return new GetWrittenConsentPage();
    }
  }

  // Verify continue button styling
  verifyContinueButton(): ApplicantConsentPage {
    cy.get("button[type='submit']")
      .should("contain", "Continue")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify back link
  verifyBackLink(): ApplicantConsentPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", "/no-visa-applicant-found")
      .and("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): ApplicantConsentPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in header
  verifyServiceName(): ApplicantConsentPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): ApplicantConsentPage {
    cy.get(".govuk-phase-banner").should("exist");
    cy.get(".govuk-tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .and("contain", "give your feedback");
    return this;
  }

  // Verify sign out link
  verifySignOutLink(): ApplicantConsentPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out")
      .and("contain", "Sign out");
    return this;
  }

  // Verify fieldset legend
  verifyFieldsetLegend(): ApplicantConsentPage {
    cy.get("fieldset.govuk-fieldset")
      .should("exist")
      .and("have.attr", "aria-describedby", "do-you-have-consent-hint");
    return this;
  }

  // Verify form group
  verifyFormGroup(): ApplicantConsentPage {
    cy.get("#do-you-have-consent.govuk-form-group").should("exist");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): ApplicantConsentPage {
    cy.get(".govuk-footer").should("exist");
    cy.get(".govuk-footer__link")
      .contains("Privacy")
      .should("have.attr", "href", "/privacy-notice");
    cy.get(".govuk-footer__link")
      .contains("Accessibility statement")
      .should("have.attr", "href", "/accessibility-statement");
    return this;
  }

  // Verify crown copyright
  verifyCrownCopyright(): ApplicantConsentPage {
    cy.get(".govuk-footer").should("contain", "© Crown copyright");
    return this;
  }

  // Verify Open Government Licence
  verifyOpenGovernmentLicence(): ApplicantConsentPage {
    cy.get(".govuk-footer__licence-description")
      .should("contain", "Open Government Licence v3.0")
      .find("a")
      .should(
        "have.attr",
        "href",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      );
    return this;
  }

  // Verify page structure comprehensively
  verifyPageStructure(): ApplicantConsentPage {
    this.verifyPageLoaded();
    this.verifyPageHeading();
    this.verifyHintText();
    this.verifyRadioOptions();
    this.verifyRadioButtonsInline();
    this.verifyAllRadioInputAttributes();
    this.verifyContinueButton();
    this.verifyBackLink();
    this.verifyServiceName();
    return this;
  }

  // Verify all page elements comprehensively
  verifyAllPageElements(): ApplicantConsentPage {
    this.verifyPageStructure();
    this.verifyBetaBanner();
    this.verifySignOutLink();
    this.verifyFooterLinks();
    this.verifyCrownCopyright();
    this.verifyOpenGovernmentLicence();
    return this;
  }

  // Verify form is submitted (check redirection or next page)
  verifyFormSubmitted(): ApplicantConsentPage {
    cy.url().should("not.include", "/do-you-have-visa-applicant-written-consent-for-tb-screening");
    return this;
  }
}
