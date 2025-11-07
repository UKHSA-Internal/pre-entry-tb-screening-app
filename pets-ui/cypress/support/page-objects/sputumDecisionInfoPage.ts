// This holds all fields for the Check Sputum Decision Information Page
import { BasePage } from "../BasePage";

// Interface for sputum decision data
interface SputumDecisionData {
  "Sputum required"?: string;
}

export class SputumDecisionInfoPage extends BasePage {
  constructor() {
    super("/check-sputum-decision-information");
  }

  // Verify page loaded
  verifyPageLoaded(): SputumDecisionInfoPage {
    cy.contains("h1.govuk-heading-l", "Check sputum decision information").should("be.visible");
    return this;
  }

  // Verify summary list is visible
  verifySummaryListVisible(): SputumDecisionInfoPage {
    cy.get("dl.govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify sputum required value - DYNAMIC
  verifySputumRequiredValue(expectedValue: string): SputumDecisionInfoPage {
    cy.get(".govuk-summary-list__row")
      .contains(".govuk-summary-list__key", "Sputum required")
      .parent()
      .find(".govuk-summary-list__value")
      .should("contain", expectedValue);
    return this;
  }

  // Get sputum required value - DYNAMIC
  getSputumRequiredValue(): Cypress.Chainable<string> {
    return cy
      .get(".govuk-summary-list__row")
      .contains(".govuk-summary-list__key", "Sputum required")
      .parent()
      .find(".govuk-summary-list__value")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify sputum decision data - DYNAMIC
  verifySputumDecisionData(expectedData: SputumDecisionData): SputumDecisionInfoPage {
    if (expectedData["Sputum required"]) {
      this.verifySputumRequiredValue(expectedData["Sputum required"]);
    }
    return this;
  }

  // Verify change link is visible
  verifyChangeLink(): SputumDecisionInfoPage {
    cy.get(".govuk-summary-list__actions")
      .find("a.govuk-link")
      .should("be.visible")
      .should("contain", "Change")
      .should("have.attr", "href", "/is-sputum-collection-required");
    return this;
  }

  // Click change link
  clickChangeLink(): SputumDecisionInfoPage {
    cy.get(".govuk-summary-list__actions").find("a.govuk-link").contains("Change").click();
    return this;
  }

  // Verify visually hidden text in change link
  verifyChangeVisuallyHiddenText(): SputumDecisionInfoPage {
    cy.get(".govuk-summary-list__actions")
      .find("span.govuk-visually-hidden")
      .should("contain", "sputum collection required");
    return this;
  }

  // Verify "Now send the sputum decision" section
  verifySputumDecisionSection(): SputumDecisionInfoPage {
    cy.contains("h2.govuk-heading-m", "Now send the sputum decision").should("be.visible");
    cy.contains(
      "p.govuk-body",
      "You will not be able to change the collection details and results after you submit this information.",
    ).should("be.visible");
    cy.contains(
      "p.govuk-body",
      "However, you will be able to return and complete any information that you have not provided.",
    ).should("be.visible");
    return this;
  }

  // Verify warning text about not being able to change
  verifyWarningText(): SputumDecisionInfoPage {
    cy.get("p.govuk-body").should(
      "contain",
      "You will not be able to change the collection details and results after you submit this information",
    );
    return this;
  }

  // Verify save and continue button
  verifySaveAndContinueButton(): SputumDecisionInfoPage {
    cy.get('button[type="submit"].govuk-button')
      .should("be.visible")
      .should("contain", "Submit and continue");
    return this;
  }

  // Click save and continue button
  clickSaveAndContinueButton(): SputumDecisionInfoPage {
    cy.get('button[type="submit"].govuk-button').contains("Submit and continue").click();
    return this;
  }

  // Verify back link to sputum collection required page
  verifyBackLink(): SputumDecisionInfoPage {
    cy.get("a.govuk-back-link")
      .should("be.visible")
      .should("have.attr", "href", "/is-sputum-collection-required")
      .should("contain", "Back");
    return this;
  }

  // Click back link
  clickBackLink(): SputumDecisionInfoPage {
    cy.get("a.govuk-back-link").click();
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): SputumDecisionInfoPage {
    cy.get(".govuk-phase-banner").should("be.visible");
    cy.get(".govuk-tag.govuk-phase-banner__content__tag")
      .should("be.visible")
      .should("contain", "BETA");
    cy.get(".govuk-phase-banner__text").should(
      "contain",
      "This is a new service. Help us improve it and",
    );
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): SputumDecisionInfoPage {
    cy.get("footer.govuk-footer").should("be.visible");
    cy.get('a.govuk-footer__link[href="/privacy-notice"]')
      .should("be.visible")
      .should("contain", "Privacy");
    cy.get('a.govuk-footer__link[href="/accessibility-statement"]')
      .should("be.visible")
      .should("contain", "Accessibility statement");
    return this;
  }

  // Verify page title
  verifyPageTitle(): SputumDecisionInfoPage {
    cy.title().should(
      "contain",
      "Check sputum decision information - Complete UK pre-entry health screening - GOV.UK",
    );
    return this;
  }

  // Verify main content area
  verifyMainContent(): SputumDecisionInfoPage {
    cy.get("main.govuk-main-wrapper#main-content").should("be.visible");
    return this;
  }

  // Verify summary list row structure
  verifySummaryListRowStructure(): SputumDecisionInfoPage {
    cy.get(".govuk-summary-list__row").should("be.visible");
    cy.get(".govuk-summary-list__key").should("be.visible");
    cy.get(".govuk-summary-list__value").should("be.visible");
    cy.get(".govuk-summary-list__actions").should("be.visible");
    return this;
  }

  // Verify all page elements
  verifyAllPageElements(): SputumDecisionInfoPage {
    this.verifyPageLoaded();
    this.verifySummaryListVisible();
    this.verifySummaryListRowStructure();
    this.verifyChangeLink();
    this.verifySputumDecisionSection();
    this.verifySaveAndContinueButton();
    this.verifyBackLink();
    this.verifyBetaBanner();
    this.verifyServiceName();
    this.verifyFooterLinks();
    return this;
  }

  // Complete the sputum decision confirmation flow
  completeSputumDecisionConfirmation(): SputumDecisionInfoPage {
    this.verifyPageLoaded();
    this.clickSaveAndContinueButton();
    return this;
  }

  // Verify and complete with expected data - DYNAMIC
  verifyAndComplete(expectedData: SputumDecisionData): SputumDecisionInfoPage {
    this.verifyPageLoaded();
    this.verifySputumDecisionData(expectedData);
    this.clickSaveAndContinueButton();
    return this;
  }

  // Navigate back to sputum collection required
  navigateBackToSputumRequired(): SputumDecisionInfoPage {
    this.verifyPageLoaded();
    this.clickBackLink();
    return this;
  }

  // Change sputum decision via change link
  changeSputumDecision(): SputumDecisionInfoPage {
    this.verifyPageLoaded();
    this.clickChangeLink();
    return this;
  }

  // Verify URL
  verifyUrl(): SputumDecisionInfoPage {
    cy.url().should("include", "/check-sputum-decision-information");
    return this;
  }

  // Verify complete page state with dynamic data
  verifyCompletePageState(expectedData: SputumDecisionData): SputumDecisionInfoPage {
    this.verifyAllPageElements();
    this.verifySputumDecisionData(expectedData);
    return this;
  }

  // Verify sputum required is "Yes"
  verifySputumRequiredYes(): SputumDecisionInfoPage {
    this.verifySputumRequiredValue("Yes");
    return this;
  }

  // Verify sputum required is "No"
  verifySputumRequiredNo(): SputumDecisionInfoPage {
    this.verifySputumRequiredValue("No");
    return this;
  }

  // Verify heading structure
  verifyHeadingStructure(): SputumDecisionInfoPage {
    cy.get("h1.govuk-heading-l").should("have.length", 1);
    cy.get("h2.govuk-heading-m").should("be.visible");
    return this;
  }

  // Verify button attributes
  verifyButtonAttributes(): SputumDecisionInfoPage {
    cy.get('button[type="submit"].govuk-button')
      .should("have.attr", "data-module", "govuk-button")
      .should("have.css", "margin-top", "30px");
    return this;
  }
}
