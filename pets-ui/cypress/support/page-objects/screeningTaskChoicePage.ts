// Screening Task Choice Page POM - Post sign-in landing page for authenticated users

import { BasePage } from "../BasePageNew";
import { GdsComponentHelper } from "../helpers";

export class ScreeningTaskChoicePage extends BasePage {
  private gds = new GdsComponentHelper();

  // Selectors
  private readonly searchForApplicantCard = 'a.task-choice-link[href="/search-for-visa-applicant"]';
  private readonly viewScreeningsInProgressCard =
    'a.task-choice-link[href="/screenings-in-progress"]';
  private readonly signOutLink = "#sign-out";
  private readonly dfeCardContainer = ".dfe-card";

  constructor() {
    super("/what-do-you-need-to-do");
  }

  // ─── Page Load ───────────────────────────────────────────────────────────────

  // Verify the task choice page has loaded correctly after sign-in
  verifyPageLoaded(): ScreeningTaskChoicePage {
    cy.url().should("include", "/what-do-you-need-to-do");
    this.gds.verifyPageHeading("What do you need to do?");
    this.verifyBothTaskCardsVisible();
    return this;
  }

  // Verify all essential page elements are present
  verifyAllPageElements(): ScreeningTaskChoicePage {
    this.verifyGovUKHeader();
    this.verifyServiceName();
    this.verifyPhaseBanner();
    this.verifyPageHeading();
    this.verifyBothTaskCardsVisible();
    this.verifyFooterElements();
    return this;
  }

  // ─── Header ──────────────────────────────────────────────────────────────────

  // Verify the GOV.UK header and logo are present
  verifyGovUKHeader(): ScreeningTaskChoicePage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logo").should("be.visible");
    cy.get(".govuk-header__logotype").should("exist");
    return this;
  }

  // Verify the service name in the service navigation bar
  verifyServiceName(): ScreeningTaskChoicePage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");
    return this;
  }

  // Verify Sign Out link is present and correctly styled
  verifySignOutLinkVisible(): ScreeningTaskChoicePage {
    cy.get(this.signOutLink)
      .should("be.visible")
      .and("contain", "Sign out")
      .and("have.attr", "href")
      .and("include", "/are-you-sure-you-want-to-sign-out");
    return this;
  }

  // Click the Sign Out link
  clickSignOut(): ScreeningTaskChoicePage {
    cy.log("Clicking Sign Out link");
    cy.get(this.signOutLink).should("be.visible").click();
    return this;
  }

  // ─── Phase Banner ─────────────────────────────────────────────────────────────

  // Verify the BETA phase banner is present
  verifyPhaseBanner(): ScreeningTaskChoicePage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag").should("contain", "BETA");
    cy.contains("This is a new service").should("be.visible");
    return this;
  }

  // Verify the feedback link within the phase banner
  verifyFeedbackLink(): ScreeningTaskChoicePage {
    cy.get('a[href*="forms.office.com"]')
      .should("be.visible")
      .and("contain", "give your feedback")
      .and("have.attr", "target", "_blank");
    return this;
  }

  // ─── Page Heading ────────────────────────────────────────────────────────────

  // Verify the main H1 page heading
  verifyPageHeading(): ScreeningTaskChoicePage {
    cy.get("h1.govuk-heading-l").should("be.visible").and("contain", "What do you need to do?");
    return this;
  }

  // ─── Task Choice Cards ───────────────────────────────────────────────────────

  // Verify both task cards are visible on the page
  verifyBothTaskCardsVisible(): ScreeningTaskChoicePage {
    cy.get(this.dfeCardContainer).should("have.length", 2);
    cy.get(this.searchForApplicantCard).should("be.visible");
    cy.get(this.viewScreeningsInProgressCard).should("be.visible");
    return this;
  }

  // Verify the "Search for or start a new screening" card
  verifySearchForApplicantCard(): ScreeningTaskChoicePage {
    cy.get(this.searchForApplicantCard)
      .should("be.visible")
      .and("contain", "Search for or start a new screening")
      .and("have.class", "govuk-link")
      .and("have.attr", "href", "/search-for-visa-applicant");
    return this;
  }

  // Verify the "View all screenings in progress" card
  verifyViewScreeningsInProgressCard(): ScreeningTaskChoicePage {
    cy.get(this.viewScreeningsInProgressCard)
      .should("be.visible")
      .and("contain", "View all screenings in progress")
      .and("have.class", "govuk-link")
      .and("have.attr", "href", "/screenings-in-progress");
    return this;
  }

  // Click the "Search for or start a new screening" card
  clickSearchForOrStartNewScreening(): ScreeningTaskChoicePage {
    cy.log("Clicking Search for or start a new screening");
    cy.get(this.searchForApplicantCard).should("be.visible").click();
    return this;
  }

  // Click the "View all screenings in progress" card
  clickViewAllScreeningsInProgress(): ScreeningTaskChoicePage {
    cy.log("Clicking View all screenings in progress");
    cy.get(this.viewScreeningsInProgressCard).should("be.visible").click();
    return this;
  }

  // ─── Navigation Verification ─────────────────────────────────────────────────

  // Verify clicking "Search for or start a new screening" redirects correctly
  verifySearchForApplicantNavigation(): ScreeningTaskChoicePage {
    this.clickSearchForOrStartNewScreening();
    cy.url({ timeout: 10000 }).should("include", "/search-for-visa-applicant");
    cy.log("Successfully navigated to Search for Visa Applicant page");
    return this;
  }

  // ─── Footer ──────────────────────────────────────────────────────────────────

  // Verify all footer elements are present
  verifyFooterElements(): ScreeningTaskChoicePage {
    cy.get(".govuk-footer").should("be.visible");

    const expectedFooterLinks = ["Privacy", "Cookies", "Accessibility statement"];
    expectedFooterLinks.forEach((linkText) => {
      cy.contains(".govuk-footer__link", linkText).should("be.visible");
    });

    cy.contains("UK Health Security Agency").should("be.visible");
    cy.contains("Open Government Licence v3.0").should("be.visible");
    cy.contains("Crown copyright").should("be.visible");

    return this;
  }

  // Verify the "More information" section and TB technical instructions link in the footer
  verifyMoreInformationSection(): ScreeningTaskChoicePage {
    cy.contains("h2.govuk-heading-m", "More information").should("be.visible");
    cy.contains("a", "UK tuberculosis technical instructions")
      .should("be.visible")
      .and("have.attr", "target", "_blank")
      .and(
        "have.attr",
        "href",
        "https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions",
      );
    return this;
  }

  // Click Privacy link in footer
  clickPrivacyLink(): ScreeningTaskChoicePage {
    cy.contains(".govuk-footer__link", "Privacy").click();
    return this;
  }

  // Click Cookies link in footer
  clickCookiesLink(): ScreeningTaskChoicePage {
    cy.contains(".govuk-footer__link", "Cookies").click();
    return this;
  }

  // Click Accessibility statement link in footer
  clickAccessibilityLink(): ScreeningTaskChoicePage {
    cy.contains(".govuk-footer__link", "Accessibility statement").click();
    return this;
  }

  // ─── Accessibility ───────────────────────────────────────────────────────────

  // Verify skip link for accessibility compliance
  verifySkipLink(): ScreeningTaskChoicePage {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain", "Skip to main content");
    return this;
  }

  // Verify main content area has correct ARIA attributes
  verifyMainContent(): ScreeningTaskChoicePage {
    cy.get('main[id="main-content"]')
      .should("be.visible")
      .and("have.attr", "role", "main")
      .and("have.attr", "tabindex", "-1");
    return this;
  }

  // ─── Comprehensive ───────────────────────────────────────────────────────────

  // Full verification of all page elements
  verifyCompleteTaskChoicePage(): ScreeningTaskChoicePage {
    this.verifyPageLoaded();
    this.verifySkipLink();
    this.verifyGovUKHeader();
    this.verifySignOutLinkVisible();
    this.verifyServiceName();
    this.verifyPhaseBanner();
    this.verifyFeedbackLink();
    this.verifyPageHeading();
    this.verifySearchForApplicantCard();
    this.verifyViewScreeningsInProgressCard();
    this.verifyMainContent();
    this.verifyMoreInformationSection();
    this.verifyFooterElements();
    return this;
  }
}
