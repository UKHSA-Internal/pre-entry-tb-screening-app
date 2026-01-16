import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { getRandomPassportNumber, randomElement } from "../../support/test-utils";

describe("Applicant Details Form - Empty Form Error Test", () => {
  const applicantConsentPage = new ApplicantConsentPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantSearchPage = new ApplicantSearchPage();
  // Define variables to store test data
  let countryName: string = "";
  let passportNumber: string = "";

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.label; // For validation (e.g., "Barbados")
    passportNumber = getRandomPassportNumber();

    // Navigate to the applicant details page
    applicantSearchPage.fillPassportNumber(passportNumber);
    applicantSearchPage.selectCountryOfIssue(countryName);
    applicantSearchPage.submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();
    applicantDetailsPage.verifyPageLoaded();
  });

  it("should display appropriate error messages when submitting an empty form", () => {
    // Submit the form without filling any fields
    applicantDetailsPage.submitForm();

    // Validate that error summary is visible
    applicantDetailsPage.verifyErrorSummary();

    // Validate individual field errors on personal information page
    applicantDetailsPage.verifyFieldError("name", "Enter the applicant's full name");
    applicantDetailsPage.verifyFieldError("sex", "Select the applicant's sex");
    applicantDetailsPage.verifyFieldError(
      "country-of-nationality",
      "Select the country of nationality",
    );
    applicantDetailsPage.verifyFieldError(
      "birth-date",
      "Date of birth must include a day, month and year",
    );
  });
});
