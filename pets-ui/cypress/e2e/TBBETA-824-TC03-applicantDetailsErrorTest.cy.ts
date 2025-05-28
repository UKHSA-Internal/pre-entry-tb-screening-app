import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";

describe("Applicant Details Form - Expired Passport Test", () => {
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantSearchPage = new ApplicantSearchPage();
  // Define variables to store test data
  let countryName: string;
  let passportNumber: string;

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.value;
    passportNumber = getRandomPassportNumber();

    // Navigate to the applicant details page
    applicantSearchPage.fillPassportNumber(passportNumber);
    applicantSearchPage.selectCountryOfIssue(countryName);
    applicantSearchPage.submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();
    applicantDetailsPage.verifyPageLoaded();
  });

  it("should display error when passport expiry date is in the past", () => {
    // Fill form with valid data except for passport expiry date
    applicantDetailsPage.fillFullName("John Doe");
    applicantDetailsPage.selectSex("Male");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);
    applicantDetailsPage.fillBirthDate("10", "05", "1985");
    applicantDetailsPage.fillPassportNumber(passportNumber);
    applicantDetailsPage.fillPassportIssueDate("15", "06", "2015");

    // Set an expired passport date
    applicantDetailsPage.fillPassportExpiryDate("15", "06", "2020");

    // Fill address fields
    applicantDetailsPage.fillAddressLine1("123 Test Street");
    applicantDetailsPage.fillTownOrCity("London");
    applicantDetailsPage.fillProvinceOrState("Greater London");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("SW1A 1AA");

    // Submit the form
    applicantDetailsPage.submitForm();

    // Validate error displayed for EXPIRED passport
    applicantDetailsPage.validateErrorContainsText("Passport expiry date must be in the future");
    applicantDetailsPage.validateFormErrors({
      passportExpiryDate: "Passport expiry date must be in the future",
    });
  });
});
