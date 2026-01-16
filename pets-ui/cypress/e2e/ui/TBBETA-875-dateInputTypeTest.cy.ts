import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { getRandomPassportNumber, randomElement } from "../../support/test-utils";

describe("Applicant Details Form - Invalid Date Format Test", () => {
  const applicantConsentPage = new ApplicantConsentPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantSearchPage = new ApplicantSearchPage();
  const passportInformationPage = new PassportInformationPage();
  // Define variables to store test data
  //let countryName: string;
  let passportNumber: string;
  let countryName: string;
  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.label;
    //countryName = randomCountry?.label;
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

  it("should display error when MONTH NAME is entered in the month fields", () => {
    // Fill form with valid data except for birth date with INVALID MONTH
    applicantDetailsPage
      .fillFullName("Sarah Brown")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("15", "JAN", "1988")
      .submitForm();

    // Validate birth date error
    applicantDetailsPage.verifyErrorSummary();
    applicantDetailsPage.verifyFieldError(
      "birth-date",
      "Date of birth day, month and year must contain only numbers",
    );

    // Fill valid birth date and continue to passport page
    applicantDetailsPage.fillBirthDate("15", "01", "1988").submitForm();

    // On passport information page, enter INVALID MONTH
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate("10", "JUN", "2018")
      .fillExpiryDate("10", "JUN", "2028")
      .submitForm();

    // Validate passport date errors
    passportInformationPage.validateErrorSummaryVisible();
    passportInformationPage.validateIssueDateFieldError(
      "Passport issue day, month and year must contain only numbers",
    );
    passportInformationPage.validateExpiryDateFieldError(
      "Passport expiry day, month and year must contain only numbers",
    );
  });
});
