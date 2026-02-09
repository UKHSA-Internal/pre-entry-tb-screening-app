// This holds all fields and interactions for the Sign Out Confirmation Page

import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper } from "../helpers";

export class SignOutConfirmationPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/you-have-signed-out");
  }

  // Verify Sign Out Confirmation Page
  verifyPageLoaded(): SignOutConfirmationPage {
    cy.url().should("include", "/you-have-signed-out");
    cy.get("h1.govuk-heading-l").should("contain", "You have signed out");
    cy.contains("p", "You will need to sign in to continue or start a new screening.").should(
      "be.visible",
    );
    return this;
  }

  // Verify main heading
  verifyMainHeading(): SignOutConfirmationPage {
    cy.get("h1.govuk-heading-l").should("be.visible").should("contain", "You have signed out");
    return this;
  }

  // Verify instruction text
  verifyInstructionText(): SignOutConfirmationPage {
    cy.get("p.govuk-body")
      .should("be.visible")
      .should("contain", "You will need to sign in to continue or start a new screening.");
    return this;
  }

  // Verify Sign In link
  verifySignInLink(): SignOutConfirmationPage {
    cy.get('a.govuk-link[href="/"]')
      .should("be.visible")
      .should("contain", "Sign in")
      .should("have.attr", "data-discover", "true");
    return this;
  }

  // Click Sign In link
  clickSignInLink(): SignOutConfirmationPage {
    cy.get('a.govuk-link[href="/"]').should("contain", "Sign in").click();
    return this;
  }

  // Verify feedback link
  verifyFeedbackSurveyLink(): SignOutConfirmationPage {
    cy.get('a.govuk-link[href*="forms.office.com"]')
      .should("be.visible")
      .should("contain", "What did you think of this service?")
      .should("contain", "(opens in new tab)")
      .should("have.attr", "target", "_blank")
      .should("have.attr", "rel", "noopener noreferrer");
    return this;
  }

  // Verify feedback link text mentions duration
  verifyFeedbackDuration(): SignOutConfirmationPage {
    cy.contains("p", "(takes 10 minutes)").should("be.visible");
    return this;
  }

  // Service name verification
  verifyServiceName(): SignOutConfirmationPage {
    cy.get(".govuk-service-navigation__service-name a.govuk-service-navigation__link")
      .should("be.visible")
      .should("contain", "Complete UK pre-entry health screening")
      .should("have.attr", "href", "/");
    return this;
  }

  // Click service name link to return to home
  clickServiceNameLink(): SignOutConfirmationPage {
    cy.get(".govuk-service-navigation__service-name a.govuk-service-navigation__link").click();
    return this;
  }

  // GOV.UK Header verification
  verifyGovUkHeader(): SignOutConfirmationPage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logotype").should("be.visible");
    cy.get('.govuk-header__link--homepage[href="https://www.gov.uk/"]').should("exist");
    return this;
  }

  // Verify GOV.UK logo
  verifyGovUkLogo(): SignOutConfirmationPage {
    cy.get(".govuk-header__logotype")
      .should("be.visible")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Beta banner verification
  verifyBetaBanner(): SignOutConfirmationPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .should("contain", "Help us improve it");
    return this;
  }

  // Verify beta feedback link
  verifyBetaFeedbackLink(): SignOutConfirmationPage {
    cy.get('.govuk-phase-banner__text a.govuk-link[href*="forms.office.com"]')
      .should("be.visible")
      .should("contain", "give your feedback")
      .should("have.attr", "target", "_blank");
    return this;
  }

  // Skip link verification (accessibility)
  verifySkipLink(): SignOutConfirmationPage {
    cy.get('.govuk-skip-link[href="#main-content"]')
      .should("exist")
      .should("contain", "Skip to main content")
      .should("have.attr", "data-module", "govuk-skip-link");
    return this;
  }

  // Footer verification
  verifyFooter(): SignOutConfirmationPage {
    cy.get(".govuk-footer").should("be.visible");
    cy.get(".govuk-footer__crown").should("be.visible");
    return this;
  }

  // Footer heading
  verifyFooterHeading(): SignOutConfirmationPage {
    cy.get(".govuk-footer .govuk-heading-m")
      .should("be.visible")
      .should("contain", "More information");
    return this;
  }

  // TB Technical Instructions link in footer
  verifyTbTechnicalInstructionsLink(): SignOutConfirmationPage {
    cy.get(
      '.govuk-footer__link[href="https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions"]',
    )
      .should("be.visible")
      .should("contain", "UK tuberculosis technical instructions")
      .should("contain", "(opens in new tab)")
      .should("have.attr", "target", "_blank");
    return this;
  }

  // Footer navigation links
  verifyFooterLinks(): SignOutConfirmationPage {
    cy.get('.govuk-footer__link[href="/privacy-notice"]')
      .should("be.visible")
      .should("contain", "Privacy")
      .should("have.attr", "data-discover", "true");

    cy.get('.govuk-footer__link[href="/cookies"]')
      .should("be.visible")
      .should("contain", "Cookies")
      .should("have.attr", "data-discover", "true");

    cy.get('.govuk-footer__link[href="/accessibility-statement"]')
      .should("be.visible")
      .should("contain", "Accessibility statement")
      .should("have.attr", "data-discover", "true");
    return this;
  }

  // Verify UKHSA attribution
  verifyUkhsaAttribution(): SignOutConfirmationPage {
    cy.get(".govuk-footer")
      .should("contain", "Built by")
      .should("contain", "UK Health Security Agency");
    cy.get(
      '.govuk-footer__link[href="https://www.gov.uk/government/organisations/uk-health-security-agency"]',
    ).should("exist");
    return this;
  }

  // Open Government Licence
  verifyOpenGovernmentLicence(): SignOutConfirmationPage {
    cy.get(".govuk-footer__licence-logo").should("be.visible");
    cy.get(".govuk-footer__licence-description").should(
      "contain",
      "All content is available under the",
    );
    cy.get(
      '.govuk-footer__link[href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"]',
    )
      .should("be.visible")
      .should("contain", "Open Government Licence v3.0");
    return this;
  }

  // Crown copyright
  verifyCrownCopyright(): SignOutConfirmationPage {
    cy.get(
      '.govuk-footer__link[href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"]',
    )
      .should("be.visible")
      .should("contain", "© Crown copyright");
    cy.get("img.govuk-footer__licence-logo").should("exist");
    return this;
  }

  // Verify GOV.UK crest in footer
  verifyGovUkCrest(): SignOutConfirmationPage {
    cy.get('img.govuk-footer__licence-logo[src="assets/images/govuk-crest.svg"]').should("exist");
    return this;
  }

  // Page title verification
  verifyPageTitle(): SignOutConfirmationPage {
    cy.title().should(
      "contain",
      "You have signed out - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Main content area verification
  verifyMainContent(): SignOutConfirmationPage {
    cy.get('main.govuk-main-wrapper#main-content[role="main"]')
      .should("be.visible")
      .should("have.attr", "tabindex", "-1");
    return this;
  }

  // Grid row and column verification
  verifyPageLayout(): SignOutConfirmationPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): SignOutConfirmationPage {
    this.verifyPageLoaded();
    this.verifyMainHeading();
    this.verifyInstructionText();
    this.verifySignInLink();
    this.verifyFeedbackSurveyLink();
    this.verifyServiceName();
    this.verifyGovUkHeader();
    this.verifyBetaBanner();
    this.verifyFooter();
    this.verifyFooterLinks();
    return this;
  }

  // Verify all accessibility elements
  verifyAccessibilityElements(): SignOutConfirmationPage {
    this.verifySkipLink();

    // Verify semantic HTML structure
    cy.get("h1.govuk-heading-l").should("exist");
    cy.get('main[role="main"]').should("exist");

    // Verify ARIA labels
    cy.get('.govuk-header__logotype[aria-label="GOV.UK"]').should("exist");

    // Verify focusable elements
    cy.get('a.govuk-link[href="/"]').should("be.visible");

    return this;
  }

  // Action: Sign back in
  signBackIn(): SignOutConfirmationPage {
    this.clickSignInLink();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    return this;
  }

  // Action: Return to home via service name
  returnToHome(): SignOutConfirmationPage {
    this.clickServiceNameLink();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    return this;
  }

  // Verify all links are functional (smoke test)
  verifyAllLinksPresent(): SignOutConfirmationPage {
    cy.get('a.govuk-link[href="/"]').should("have.length.at.least", 1);
    cy.get('a.govuk-link[href*="forms.office.com"]').should("have.length.at.least", 1);
    cy.get('.govuk-footer__link[href="/privacy-notice"]').should("exist");
    cy.get('.govuk-footer__link[href="/cookies"]').should("exist");
    cy.get('.govuk-footer__link[href="/accessibility-statement"]').should("exist");
    return this;
  }

  // Verify responsive design classes
  verifyResponsiveClasses(): SignOutConfirmationPage {
    cy.get(".govuk-width-container").should("exist");
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    return this;
  }

  // Verify GOV.UK Frontend modules
  verifyGovUkModules(): SignOutConfirmationPage {
    cy.get('[data-module="govuk-skip-link"]').should("exist");
    cy.get('[data-module="govuk-header"]').should("exist");
    cy.get('[data-module="govuk-service-navigation"]').should("exist");
    return this;
  }
}
