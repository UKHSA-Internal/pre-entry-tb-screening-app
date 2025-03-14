import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";

/*Scenario:
GIVEN I am on the "Search results" page for no matching applicant
WHEN I click on the "Search again" Link
THEN I am navigated to the "Search for Applicant" page.*/

const applicantSearchPage = new ApplicantSearchPage();

describe.skip("Validate that page navigates to 'Applicant Search' page when user clicks on 'search again' link", () => {
  beforeEach(() => {
    // Navigate directly to the results page for this specific test
    cy.visit("/applicant-results");
  });

  it.skip("Should navigate to applicant search page when clicking 'search again' link", () => {
    // Verify we're on the no results page
    applicantSearchPage.verifyNoMatchingRecordMessage();

    // Click 'search again' link
    cy.get(".govuk-link").click();

    // Validate navigation to search applicant page
    cy.url().should("include", "/applicant-search");

    // Verify the search page is loaded correctly
    applicantSearchPage.verifyPageLoaded();
  });
});
