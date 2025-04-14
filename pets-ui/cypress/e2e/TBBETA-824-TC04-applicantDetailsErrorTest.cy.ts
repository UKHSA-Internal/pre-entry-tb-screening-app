import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";

describe("Applicant Details Form - Invalid Month Format Test", () => {
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

  it("should display error when invalid month name is entered in birth date", () => {
    // Fill form with valid data except for birth date
    applicantDetailsPage.fillFullName("Sarah Brown");
    applicantDetailsPage.selectSex("Female");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Enter an INVALID MONTH
    applicantDetailsPage.fillBirthDate("15", "JAZ", "1988");

    applicantDetailsPage.fillPassportNumber(passportNumber);
    applicantDetailsPage.fillPassportIssueDate("10", "04", "2018");
    applicantDetailsPage.fillPassportExpiryDate("10", "04", "2028");

    // Fill address fields
    applicantDetailsPage.fillAddressLine1("321 Test Blvd");
    applicantDetailsPage.fillTownOrCity("Toronto");
    applicantDetailsPage.fillProvinceOrState("Ontario");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("M5V 2A8");

    // Submit the form
    applicantDetailsPage.submitForm();

    // Validate error for invalid date format is displayed
    applicantDetailsPage.validateErrorContainsText(
      "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month",
    );
    applicantDetailsPage.validateFormErrors({
      birthDate:
        "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month",
    });
  });
});
