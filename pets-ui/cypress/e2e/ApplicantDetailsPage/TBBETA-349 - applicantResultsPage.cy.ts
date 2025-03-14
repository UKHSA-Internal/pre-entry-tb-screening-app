/*Scenario:
GIVEN I am on the "Search results" page for no matching applicant
WHEN I click on the "Create New Application" button
THEN I am navigated to the "Enter applicant details" page.*/

import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";

const applicantSearchPage = new ApplicantSearchPage();

describe.skip("Validate that page navigates to 'Enter applicant details' page when user clicks on 'Create New Application'", () => {
  beforeEach(() => {
    cy.visit("/applicant-results");
  });

  it.skip("Should navigate to create new application page", () => {
    // Validate that 'No matching record found ' is visible
    applicantSearchPage.verifyNoMatchingRecordMessage();

    // Click create new applicant button
    applicantSearchPage.clickCreateNewApplicant();

    // Validate that page navigates to enter applicant details page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();
  });
});
