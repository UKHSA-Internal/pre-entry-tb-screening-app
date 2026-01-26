// This holds all fields and interactions for the Sign Out Dialog/Confirmation Page

import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper } from "../helpers";

export class SignOutPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/are-you-sure-you-want-to-sign-out");
  }

  // Verify Sign Out Dialog Page - URL only
  verifyPageUrl(): SignOutPage {
    cy.url({ timeout: 10000 }).should("include", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Verify Sign Out Dialog Page - Complete verification
  verifyPageLoaded(): SignOutPage {
    // Wait for URL to stabilize on the dialog page
    cy.url({ timeout: 10000 }).should("include", "/are-you-sure-you-want-to-sign-out");

    // Verify we're still on the PETS domain (not redirected to B2C)
    cy.url().should("include", "clinics.test.pets.ukhsa.gov.uk");

    // Wait a moment for page to fully load
    cy.wait(500);

    // Now verify page content
    cy.get("h3.govuk-heading-m", { timeout: 5000 })
      .should("be.visible")
      .should("contain", "Are you sure you want to sign out?");
    cy.contains("p", "Signing out will lose any unsaved information.").should("be.visible");
    return this;
  }

  // Verify page elements only (assumes already on correct page)
  verifyPageContent(): SignOutPage {
    cy.get("h3.govuk-heading-m").should("contain", "Are you sure you want to sign out?");
    cy.contains("p", "Signing out will lose any unsaved information.").should("be.visible");
    return this;
  }

  // Verify notification banner is visible
  verifyNotificationBanner(): SignOutPage {
    cy.get(".govuk-notification-banner").should("be.visible");
    cy.get(".govuk-notification-banner__title").should("contain", "Important");
    return this;
  }

  // Verify notification banner heading
  verifyNotificationBannerHeading(): SignOutPage {
    cy.get(".govuk-notification-banner h3.govuk-heading-m").should(
      "contain",
      "Are you sure you want to sign out?",
    );
    return this;
  }

  // Verify warning message
  verifyWarningMessage(): SignOutPage {
    cy.get(".govuk-notification-banner__content p.govuk-body.govuk-\\!-font-size-19").should(
      "contain",
      "Signing out will lose any unsaved information.",
    );
    return this;
  }

  // Verify button interactions
  clickSignOutButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button.govuk-button--warning')
      .should("be.visible")
      .should("contain", "Sign out")
      .click();
    return this;
  }

  clickGoBackButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button.govuk-button--secondary')
      .should("be.visible")
      .should("contain", "Go back to screening")
      .click();
    return this;
  }

  // Verify buttons are present and styled correctly
  verifySignOutButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button.govuk-button--warning')
      .should("be.visible")
      .should("contain", "Sign out")
      .should("have.class", "govuk-button--warning");
    return this;
  }

  verifyGoBackButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button.govuk-button--secondary')
      .should("be.visible")
      .should("contain", "Go back to screening")
      .should("have.class", "govuk-button--secondary");
    return this;
  }

  // Verify both buttons are present
  verifyBothButtons(): SignOutPage {
    this.verifySignOutButton();
    this.verifyGoBackButton();
    cy.get(".govuk-button-group").should("be.visible");
    return this;
  }

  // Verify back link
  verifyBackLink(): SignOutPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/")
      .should("contain", "Back");
    return this;
  }

  // Verify back link with specific href
  verifyBackLinkHref(expectedHref: string): SignOutPage {
    cy.get(".govuk-back-link")
      .should("be.visible")
      .and("have.attr", "href", expectedHref)
      .and("contain", "Back");
    return this;
  }

  // Navigate using back link
  clickBackLink(): SignOutPage {
    cy.get(".govuk-back-link").click();
    return this;
  }

  // Verify service name in service navigation
  verifyServiceName(): SignOutPage {
    cy.get(".govuk-service-navigation__service-name a.govuk-service-navigation__link")
      .should("be.visible")
      .should("contain", "Complete UK pre-entry health screening")
      .should("have.attr", "href", "/");
    return this;
  }

  // Verify GOV.UK header elements
  verifyGovUkHeader(): SignOutPage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logotype").should("be.visible");
    cy.get('.govuk-header__link--homepage[href="https://www.gov.uk/"]').should("exist");
    return this;
  }

  // Verify GOV.UK logo
  verifyGovUkLogo(): SignOutPage {
    cy.get(".govuk-header__logotype")
      .should("be.visible")
      .should("have.attr", "aria-label", "GOV.UK");
    return this;
  }

  // Verify the sign out link in header (different from the page content)
  verifyHeaderSignOutLink(): SignOutPage {
    cy.get("#sign-out")
      .should("be.visible")
      .should("contain", "Sign out")
      .should("have.attr", "href", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): SignOutPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .should("contain", "Help us improve it");
    return this;
  }

  // Verify feedback link in beta banner
  verifyFeedbackLink(): SignOutPage {
    cy.get('.govuk-phase-banner__text a.govuk-link[href*="forms.office.com"]')
      .should("be.visible")
      .should("contain", "give your feedback")
      .should("have.attr", "target", "_blank")
      .should("have.attr", "rel", "noopener noreferrer");
    return this;
  }

  // Skip link verification (accessibility)
  verifySkipLink(): SignOutPage {
    cy.get('.govuk-skip-link[href="#main-content"]')
      .should("exist")
      .should("contain", "Skip to main content")
      .should("have.attr", "data-module", "govuk-skip-link");
    return this;
  }

  // Footer verification
  verifyFooter(): SignOutPage {
    cy.get(".govuk-footer").should("be.visible");
    cy.get(".govuk-footer__crown").should("be.visible");
    return this;
  }

  // Footer heading
  verifyFooterHeading(): SignOutPage {
    cy.get(".govuk-footer .govuk-heading-m")
      .should("be.visible")
      .should("contain", "More information");
    return this;
  }

  // TB Technical Instructions link in footer
  verifyTbTechnicalInstructionsLink(): SignOutPage {
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
  verifyFooterLinks(): SignOutPage {
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
  verifyUkhsaAttribution(): SignOutPage {
    cy.get(".govuk-footer")
      .should("contain", "Built by")
      .should("contain", "UK Health Security Agency");
    cy.get(
      '.govuk-footer__link[href="https://www.gov.uk/government/organisations/uk-health-security-agency"]',
    ).should("exist");
    return this;
  }

  // Open Government Licence
  verifyOpenGovernmentLicence(): SignOutPage {
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
  verifyCrownCopyright(): SignOutPage {
    cy.get(
      '.govuk-footer__link[href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"]',
    )
      .should("be.visible")
      .should("contain", "© Crown copyright");
    cy.get("img.govuk-footer__licence-logo").should("exist");
    return this;
  }

  // Verify GOV.UK crest in footer
  verifyGovUkCrest(): SignOutPage {
    cy.get('img.govuk-footer__licence-logo[src="assets/images/govuk-crest.svg"]').should("exist");
    return this;
  }

  // Page title verification
  verifyPageTitle(): SignOutPage {
    cy.title().should(
      "contain",
      "Are you sure you want to sign out? - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Main content area verification
  verifyMainContent(): SignOutPage {
    cy.get('main.govuk-main-wrapper#main-content[role="main"]')
      .should("be.visible")
      .should("have.attr", "tabindex", "-1");
    return this;
  }

  // Grid row and column verification
  verifyPageLayout(): SignOutPage {
    cy.get(".govuk-grid-row").should("be.visible");
    cy.get(".govuk-grid-column-two-thirds").should("be.visible");
    return this;
  }

  // Comprehensive page verification
  verifyAllPageElements(): SignOutPage {
    this.verifyPageLoaded();
    this.verifyNotificationBanner();
    this.verifyWarningMessage();
    this.verifyBothButtons();
    this.verifyServiceName();
    this.verifyGovUkHeader();
    this.verifyBetaBanner();
    this.verifyFooter();
    return this;
  }

  // Verify page accessibility elements
  verifyAccessibilityElements(): SignOutPage {
    this.verifySkipLink();

    // Verify heading structure
    cy.get("h2.govuk-notification-banner__title").should("exist");
    cy.get("h3.govuk-heading-m").should("exist");

    // Verify ARIA labels
    cy.get('.govuk-notification-banner[aria-labelledby="govuk-notification-banner-title"]').should(
      "exist",
    );
    cy.get('.govuk-header__logotype[aria-label="GOV.UK"]').should("exist");

    return this;
  }

  // Verify buttons are clickable
  verifyButtonsAreClickable(): SignOutPage {
    cy.get('button[type="submit"].govuk-button.govuk-button--warning').should("not.be.disabled");
    cy.get('button[type="submit"].govuk-button.govuk-button--secondary').should("not.be.disabled");
    return this;
  }

  // Action methods for different user journeys
  confirmSignOut(): SignOutPage {
    this.clickSignOutButton();
    // After clicking sign out, user is redirected to account selection or sign out confirmation
    return this;
  }

  // due to how Cypress command chains work. The cy.origin() call must be made directly in the
  // test file immediately after clicking the sign-out button. See test file for example.

  cancelSignOut(): SignOutPage {
    this.clickGoBackButton();
    // Verify navigation back to previous page
    cy.url().should("not.include", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  navigateBackToPreviousPage(): SignOutPage {
    this.clickBackLink();
    cy.url().should("not.include", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Verify GOV.UK modules
  verifyGovUkModules(): SignOutPage {
    cy.get('[data-module="govuk-skip-link"]').should("exist");
    cy.get('[data-module="govuk-header"]').should("exist");
    cy.get('[data-module="govuk-service-navigation"]').should("exist");
    cy.get('[data-module="govuk-notification-banner"]').should("exist");
    cy.get('[data-module="govuk-button"]').should("exist");
    return this;
  }

  // Verify responsive design classes
  verifyResponsiveClasses(): SignOutPage {
    cy.get(".govuk-width-container").should("exist");
    cy.get(".govuk-grid-row").should("exist");
    cy.get(".govuk-grid-column-two-thirds").should("exist");
    return this;
  }
}
