/* Scenario: Given I am on the confirmation page
Then I see the page with the attached design

Given I am on the confirmation page
When I click the "Go to TB screening progress tracker" button
Then I am navigated to the "Application progress tracker" page
 */

describe.skip("Verify Go to TB screening progress tracker link navigates to the Application progress tracker page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/chest-xray-confirmation");
  });
  it.skip("Should navigate to the Application Progress Tracker Page", () => {
    //Validate text on page 'Chest X-ray information recorded'
    cy.get("h1").should("contain.text", "Chest X-ray information recorded");

    //Validate that TB screening progress tracker link exists and is visible
    cy.contains(".govuk-body a", "TB screening progress tracker")
      .should("be.visible")
      .and("have.attr", "href");

    //Validate that TB screening progress tracker link is clickable
    cy.contains(".govuk-body a", "TB screening progress tracker").click();

    //Validate that clicking the link navigates to the Application progress tracker page
    cy.url().should("include", "http://localhost:3000/tracker");
  });
});
