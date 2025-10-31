// This holds all fields and interactions for the Sign Out Page

import { BasePage } from "../BasePage";

export class SignOutPage extends BasePage {
  constructor() {
    super("/are-you-sure-you-want-to-sign-out");
  }

  // Verify Sign Out Page
  verifyPageLoaded(): SignOutPage {
    cy.url().should("include", "/are-you-sure-you-want-to-sign-out");
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

  // Verify warning message
  verifyWarningMessage(): SignOutPage {
    cy.get(".govuk-body.govuk-\\!-font-size-19").should(
      "contain",
      "Signing out will lose any unsaved information.",
    );
    return this;
  }

  // Verify button interactions
  clickSignOutButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button--warning').should("contain", "Sign out").click();
    return this;
  }

  clickGoBackButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button--secondary')
      .should("contain", "Go back to screening")
      .click();
    return this;
  }

  // Verify buttons are present and styled correctly
  verifySignOutButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button--warning')
      .should("be.visible")
      .should("contain", "Sign out")
      .should("have.class", "govuk-button--warning");
    return this;
  }

  verifyGoBackButton(): SignOutPage {
    cy.get('button[type="submit"].govuk-button--secondary')
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
      .should("have.attr", "href")
      .and("contain", "Back");
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

  // Verify service name and header
  verifyServiceName(): SignOutPage {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify GOV.UK header elements
  verifyGovUkHeader(): SignOutPage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logotype").should("be.visible");
    cy.get('.govuk-header__link[href="https://www.gov.uk/"]').should("exist");
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
      .should("contain", "feedback");
    return this;
  }

  // Verify feedback link in beta banner
  verifyFeedbackLink(): SignOutPage {
    cy.get('.govuk-phase-banner__text a[href*="forms.office.com"]')
      .should("be.visible")
      .should("contain", "feedback");
    return this;
  }

  // Footer verification
  verifyFooter(): SignOutPage {
    cy.get(".govuk-footer").should("be.visible");
    return this;
  }

  verifyFooterLinks(): SignOutPage {
    cy.get('.govuk-footer__link[href="/privacy-notice"]')
      .should("be.visible")
      .should("contain", "Privacy");
    cy.get('.govuk-footer__link[href="/accessibility-statement"]')
      .should("be.visible")
      .should("contain", "Accessibility statement");
    return this;
  }

  verifyOpenGovernmentLicence(): SignOutPage {
    cy.get('.govuk-footer__link[href*="open-government-licence"]')
      .should("be.visible")
      .should("contain", "Open Government Licence v3.0");
    return this;
  }

  verifyCrownCopyright(): SignOutPage {
    cy.get('.govuk-footer__link[href*="crown-copyright"]')
      .should("be.visible")
      .should("contain", "© Crown copyright");
    cy.get(".govuk-footer__licence-logo").should("be.visible");
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
    // Skip link
    cy.get('.govuk-skip-link[href="#main-content"]')
      .should("exist")
      .should("contain", "Skip to main content");

    // Verify heading structure
    cy.get("h2.govuk-notification-banner__title").should("exist");
    cy.get("h3.govuk-heading-m").should("exist");

    return this;
  }

  // Navigation verification
  verifyBreadcrumbs(): SignOutPage {
    cy.get(".govuk-breadcrumbs").should("be.visible");
    cy.get(".govuk-breadcrumbs__list").should("exist");
    return this;
  }

  // Verify page title
  verifyPageTitle(): SignOutPage {
    cy.title().should(
      "contain",
      "Are you sure you want to sign out? - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  //================== SIGN OUT FLOW ================================

  // Handle the complete Azure B2C sign out flow using cy.origin
  handleAzureB2CSignOutWithOrigin(): void {
    cy.origin("https://petsb2cdev.ciamlogin.com", () => {
      cy.log("Inside B2C account picker page");

      cy.wait(2000);

      // Wait for the account picker page to load
      cy.contains("Pick an account", { timeout: 15000 }).should("be.visible");
      cy.contains("Which account do you want to sign out of?").should("be.visible");

      // Click the first account in the list using multiple selector strategies
      cy.get(
        'div[role="button"], button[data-test-id*="account"], .account-tile, div[class*="account"]',
      )
        .filter(":visible")
        .first()
        .should("be.visible")
        .click({ force: true });

      cy.log("Selected account to sign out");
    });

    // Wait for redirect after account selection
    cy.url({ timeout: 15000 }).should("not.include", "ciamlogin.com");
  }

  // Action methods for different user journeys
  confirmSignOut(): SignOutPage {
    this.clickSignOutButton();
    return this;
  }

  cancelSignOut(): SignOutPage {
    this.clickGoBackButton();
    // Verify navigation back to screening
    cy.url().should("not.include", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  navigateBackToTracker(): SignOutPage {
    this.clickBackLink();
    cy.url().should("include", "/tracker");
    return this;
  }

  // Method to verify buttons are clickable
  verifyButtonsAreClickable(): SignOutPage {
    cy.get('button[type="submit"].govuk-button--warning').should("not.be.disabled");
    cy.get('button[type="submit"].govuk-button--secondary').should("not.be.disabled");
    return this;
  }

  // Navigate to sign out page from header link (helper method for tests)
  static navigateToSignOutPageFromHeader(): void {
    cy.get("#sign-out").should("be.visible").click();
  }

  // Complete sign out flow including Azure B2C account picker and verify final redirect
  completeFullSignOutFlow(): void {
    // Step 1: Verify sign out confirmation page
    this.verifyPageLoaded();
    this.verifyAllPageElements();

    // Step 2: Click sign out button
    this.clickSignOutButton();

    // Step 3: Handle Azure B2C account picker using cy.origin
    this.handleAzureB2CSignOutWithOrigin();

    // Step 4: Verify final redirection to applicant search page
    cy.url().should("include", "/search-for-visa-applicant", { timeout: 15000 });
    cy.log("Sign out completed successfully - redirected to Applicant Search page");
  }

  // Simplified complete sign out (without intermediate verifications)
  completeSignOutFlow(): void {
    this.clickSignOutButton();
    this.handleAzureB2CSignOutWithOrigin();
    cy.url().should("include", "/search-for-visa-applicant", { timeout: 15000 });
  }

  // Use the Cypress custom command for logout (recommended approach)
  static completeSignOutUsingCommand(): void {
    cy.logoutViaB2C();
  }
}
