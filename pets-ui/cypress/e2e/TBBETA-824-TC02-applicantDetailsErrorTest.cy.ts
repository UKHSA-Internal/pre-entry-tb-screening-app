import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { getRandomPassportNumber, randomElement } from "../support/test-utils";

describe("Applicant Details Form - Invalid Date Relationship Test", () => {
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

  it("should display error when passport issue date is after expiry date", () => {
    // Fill form with valid data except for passport dates
    applicantDetailsPage.fillFullName("Michael Johnson");
    applicantDetailsPage.selectSex("Male");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);
    applicantDetailsPage.fillBirthDate("15", "09", "1990");
    applicantDetailsPage.fillPassportNumber(passportNumber);

    // Set issue date after expiry date
    const currentYear = new Date().getFullYear();
    applicantDetailsPage.fillPassportIssueDate("30", "08", (currentYear + 2).toString());
    applicantDetailsPage.fillPassportExpiryDate("30", "08", (currentYear + 1).toString());

    // Fill address fields
    applicantDetailsPage.fillAddressLine1("789 Test Road");
    applicantDetailsPage.fillTownOrCity("Sydney");
    applicantDetailsPage.fillProvinceOrState("Greater London");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("2000");

    // Submit the form
    applicantDetailsPage.submitForm();

    // Validate error specific to INVALID DATE
    applicantDetailsPage.validateErrorContainsText(
      "Passport issue date must be today or in the past",
    );
    applicantDetailsPage.validateFormErrors({
      passportIssueDate: "Passport issue date must be today or in the past",
    });
  });
});
