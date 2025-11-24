// Landing Page POM - Main entry point with Sign In functionality

import { BasePage } from "../BasePage";

export class LandingPage extends BasePage {
  constructor() {
    super("/");
  }

  // Verify the landing page has loaded correctly
  verifyPageLoaded(): LandingPage {
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    this.verifyPageHeading("Complete a UK visa applicant's TB screening");
    this.verifySignInButtonVisible();
    return this;
  }
  // Verify all essential page elements are present
  verifyAllPageElements(): LandingPage {
    this.verifyPageHeading("Complete a UK visa applicant's TB screening");
    this.verifyPageDescription();
    this.verifyBeforeYouStartSection();
    this.verifyToCompleteScreeningSection();
    this.verifySignInButtonVisible();
    this.verifyPhaseBanner();
    this.verifyFooterElements();
    return this;
  }

  // Verify the main page description
  verifyPageDescription(): LandingPage {
    cy.contains(
      "p.govuk-body",
      "Authorised staff can use this service to view, enter and update tuberculosis (TB) screening information for UK visa applicants.",
    ).should("be.visible");
    return this;
  }

  // Verify "Before you start" section
  verifyBeforeYouStartSection(): LandingPage {
    cy.contains("h2.govuk-heading-m", "Before you start").should("be.visible");

    cy.contains("You must have the visa applicant's written consent for TB screening").should(
      "be.visible",
    );

    cy.contains("The visa applicant must have a valid passport").should("be.visible");

    return this;
  }

  // Verify "To complete the screening" section
  verifyToCompleteScreeningSection(): LandingPage {
    cy.contains("h2.govuk-heading-m", "To complete the screening").should("be.visible");

    cy.contains("You will need the visa applicant's:").should("be.visible");

    // Verify list items
    cy.contains("li", "medical history, for example symptoms of pulmonary TB").should("be.visible");
    cy.contains("li", "X-ray images or sputum sample results").should("be.visible");

    return this;
  }

  // Verify the phase banner (BETA)
  verifyPhaseBanner(): LandingPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag").should("contain", "BETA");
    cy.contains("This is a new service").should("be.visible");
    return this;
  }

  // Verify feedback link in phase banner
  verifyFeedbackLink(): LandingPage {
    cy.get('a[href*="forms.office.com"]')
      .should("be.visible")
      .and("contain", "give your feedback")
      .and("have.attr", "target", "_blank");
    return this;
  }

  // Verify footer elements
  verifyFooterElements(): LandingPage {
    cy.get(".govuk-footer").should("be.visible");

    // Verify footer links
    const expectedFooterLinks = ["Privacy", "Cookies", "Accessibility statement"];
    expectedFooterLinks.forEach((linkText) => {
      cy.contains(".govuk-footer__link", linkText).should("be.visible");
    });

    // Verify footer additional information
    cy.contains("UK Health Security Agency").should("be.visible");
    cy.contains("Open Government Licence v3.0").should("be.visible");
    cy.contains("Crown copyright").should("be.visible");

    return this;
  }

  // Verify technical instructions link
  verifyTechnicalInstructionsLink(): LandingPage {
    cy.contains("a", "UK tuberculosis technical instructions")
      .should("be.visible")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "href")
      .and(
        "include",
        "https://www.gov.uk/government/publications/uk-tuberculosis-technical-instructions",
      );
    return this;
  }

  // Verify sign in button is visible and has correct styling
  verifySignInButtonVisible(): LandingPage {
    cy.get("#sign-in")
      .should("be.visible")
      .and("contain", "Sign in")
      .and("have.class", "govuk-button")
      .and("have.class", "govuk-button--start");
    return this;
  }

  // Verify sign in button has the start icon
  verifySignInButtonStartIcon(): LandingPage {
    cy.get("#sign-in").find("svg.govuk-button__start-icon").should("exist").and("be.visible");
    return this;
  }

  // Click the sign in button
  clickSignIn(): LandingPage {
    cy.log("Clicking Sign In button");
    cy.get("#sign-in").should("be.visible").click({ force: true });
    return this;
  }

  // Verify the instruction text below sign in button
  verifySignInInstructions(): LandingPage {
    cy.contains("Use the username you set up when you were given access to the service").should(
      "be.visible",
    );
    return this;
  }

  // Complete the sign-in process (assumes B2C login command is available)
  signInToService(): LandingPage {
    cy.log("Initiating sign-in flow from landing page");
    this.clickSignIn();
    // The B2C authentication is handled by the custom command
    return this;
  }

  // Verify redirection after successful sign-in
  verifySuccessfulSignIn(): LandingPage {
    cy.url({ timeout: 30000 }).should("include", "/search-for-visa-applicant");
    cy.log("Successfully signed in and redirected");
    return this;
  }

  // Click on Privacy link in footer
  clickPrivacyLink(): LandingPage {
    cy.contains(".govuk-footer__link", "Privacy").click();
    return this;
  }

  // Click on Cookies link in footer
  clickCookiesLink(): LandingPage {
    cy.contains(".govuk-footer__link", "Cookies").click();
    return this;
  }

  // Click on Accessibility statement link in footer
  clickAccessibilityLink(): LandingPage {
    cy.contains(".govuk-footer__link", "Accessibility statement").click();
    return this;
  }

  // Comprehensive verification of all page elements
  verifyCompleteLandingPage(): LandingPage {
    this.verifyPageLoaded();
    this.verifyAllPageElements();
    this.verifySignInButtonStartIcon();
    this.verifySignInInstructions();
    this.verifyFeedbackLink();
    this.verifyTechnicalInstructionsLink();
    return this;
  }

  // Verify GOV.UK header and logo

  verifyGovUKHeader(): LandingPage {
    cy.get(".govuk-header").should("be.visible");
    cy.get(".govuk-header__logo").should("be.visible");
    cy.get(".govuk-header__logotype").should("exist");
    return this;
  }

  // Verify skip link for accessibility

  verifySkipLink(): LandingPage {
    cy.get(".govuk-skip-link")
      .should("exist")
      .and("have.attr", "href", "#main-content")
      .and("contain", "Skip to main content");
    return this;
  }

  // Get the text content of a specific heading

  getHeadingText(level: "h1" | "h2" | "h3"): Cypress.Chainable<string> {
    return cy.get(level).first().invoke("text");
  }

  // Verify main content area
  verifyMainContent(): LandingPage {
    cy.get('main[id="main-content"]')
      .should("be.visible")
      .and("have.attr", "role", "main")
      .and("have.attr", "tabindex", "-1");
    return this;
  }
}
