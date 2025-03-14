import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";

// Define the expected error messages
const searchErrorMessages = [
  "Enter the applicant's passport number",
  "Select the country of issue",
];

/*Scenario: As a Clinic user
I want to view the results from the applicant search
So that I can see applicants that match the criteria entered during the search process.*/

const applicantSearchPage = new ApplicantSearchPage();

describe.skip("Validate that error message is displayed when user clicks the search button without entering a search criteria", () => {
  beforeEach(() => {
    // Navigate to the applicant search page
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
  });

  it.skip("Should display error messages when search is performed without criteria", () => {
    // Click search button without entering any criteria
    applicantSearchPage.submitSearch();

    // Validate that error messages are displayed
    applicantSearchPage.validateErrorSummaryVisible();

    // Verify each expected error message appears
    searchErrorMessages.forEach((errorMessage) => {
      applicantSearchPage.validateErrorMessage(errorMessage);
    });

    // Validate specific field errors
    applicantSearchPage.validateFormErrors({
      passportNumber: "Enter the applicant's passport number.",
      countryOfIssue: "Select the country of issue.",
    });
  });
});
