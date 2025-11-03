import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConsentPage } from "../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";

describe("Applicant Details Form - Invalid Date Format Test", () => {
  const applicantConsentPage = new ApplicantConsentPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantSearchPage = new ApplicantSearchPage();
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
    // Fill form with valid data except for birth date
    applicantDetailsPage.fillFullName("Sarah Brown");
    applicantDetailsPage.selectSex("Female");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Enter an INVALID MONTH
    applicantDetailsPage.fillBirthDate("15", "JAN", "1988");

    applicantDetailsPage.fillPassportNumber(passportNumber);
    applicantDetailsPage.fillPassportIssueDate("10", "JUN", "2018");
    applicantDetailsPage.fillPassportExpiryDate("10", "JUN", "2028");

    // Fill address fields
    applicantDetailsPage.fillAddressLine1("321 Test Blvd");
    applicantDetailsPage.fillTownOrCity("Toronto");
    applicantDetailsPage.fillProvinceOrState("Ontario");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("M5V 2A8");

    // Submit the form
    applicantDetailsPage.submitForm();

    // Validate error for invalid date format is displayed
    applicantDetailsPage.validateFormErrors({
      birthDate: "Date of birth day, month and year must contain only numbers",
      passportIssueDate: "Passport issue day, month and year must contain only numbers",
      passportExpiryDate: "Passport expiry day, month and year must contain only numbers",
    });
  });
});
