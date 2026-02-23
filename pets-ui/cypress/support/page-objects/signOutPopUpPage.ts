//Timeout popup screen objets
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

export class SignOutPopUpPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private summary = new SummaryHelper();

  constructor() {
    super("/check-chest-x-ray-results-findings");
  }
  verifyIdleTimeoutPopupVisible() {
    cy.get(".govuk-heading-m", { timeout: 1110000 }).should(
      "contain.text",
      "You are about to be signed out",
    );
    cy.get(".govuk-link").should("contain.text", "Sign out");

    return this;
  }
}
