import { BasePage } from "../BasePageNew";
import { GdsComponentHelper, ButtonHelper } from "../helpers";

// This holds all fields of the Get Written Consent Page
export class GetWrittenConsentPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();

  constructor() {
    super("/get-written-consent");
  }

  // Verify page loaded
  verifyPageLoaded(): GetWrittenConsentPage {
    cy.url().should("include", "/get-written-consent");
    cy.contains("h1", "Get written consent").should("be.visible");
    return this;
  }

  // Verify notification banner
  verifyNotificationBanner(): GetWrittenConsentPage {
    cy.get(".govuk-notification-banner").should("exist");
    cy.get("#govuk-notification-banner-title").should("be.visible").and("contain", "Important");
    cy.get(".govuk-notification-banner__heading")
      .should("be.visible")
      .and("contain", "You need the visa applicant's consent");
    return this;
  }

  // Verify page heading
  verifyPageHeading(): GetWrittenConsentPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Do you have the visa applicant's written consent for TB screening?");
    return this;
  }

  // Verify body text
  verifyBodyText(): GetWrittenConsentPage {
    cy.get("p.govuk-body")
      .should("be.visible")
      .and(
        "contain",
        "The visa applicant (or their parent or guardian) must have signed a paper consent form before you start TB screening",
      );
    return this;
  }

  // Click search again button
  clickSearchAgain(): GetWrittenConsentPage {
    cy.get("button[type='submit']")
      .contains("Search again")
      .filter(":visible")
      .first()
      .should("be.visible")
      .click();
    return this;
  }

  // Verify search again button
  verifySearchAgainButton(): GetWrittenConsentPage {
    cy.get("button[type='submit']")
      .should("contain", "Search again")
      .and("have.class", "govuk-button")
      .and("have.attr", "data-module", "govuk-button");
    return this;
  }

  // Verify service name in header
  verifyServiceName(): GetWrittenConsentPage {
    cy.get(".govuk-service-navigation__service-name")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening")
      .and("have.attr", "href", "/");
    return this;
  }

  // Verify beta banner
  verifyBetaBanner(): GetWrittenConsentPage {
    cy.get(".govuk-phase-banner").should("exist");
    cy.get(".govuk-tag").should("contain", "BETA");
    cy.get(".govuk-phase-banner__text")
      .should("contain", "This is a new service")
      .and("contain", "give your feedback");
    return this;
  }

  // Verify sign out link
  verifySignOutLink(): GetWrittenConsentPage {
    cy.get("#sign-out")
      .should("be.visible")
      .and("have.attr", "href", "/are-you-sure-you-want-to-sign-out")
      .and("contain", "Sign out");
    return this;
  }

  // Verify footer links
  verifyFooterLinks(): GetWrittenConsentPage {
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
  verifyCrownCopyright(): GetWrittenConsentPage {
    cy.get(".govuk-footer").should("contain", "© Crown copyright");
    return this;
  }

  // Verify Open Government Licence
  verifyOpenGovernmentLicence(): GetWrittenConsentPage {
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

  // Verify complete page structure
  verifyPageStructure(): GetWrittenConsentPage {
    this.verifyPageLoaded();
    this.verifyNotificationBanner();
    this.verifyPageHeading();
    this.verifyBodyText();
    this.verifySearchAgainButton();
    return this;
  }

  // Verify all page elements comprehensively
  verifyAllPageElements(): GetWrittenConsentPage {
    this.verifyPageStructure();
    this.verifyBetaBanner();
    this.verifySignOutLink();
    this.verifyServiceName();
    this.verifyFooterLinks();
    this.verifyCrownCopyright();
    this.verifyOpenGovernmentLicence();
    return this;
  }
}
