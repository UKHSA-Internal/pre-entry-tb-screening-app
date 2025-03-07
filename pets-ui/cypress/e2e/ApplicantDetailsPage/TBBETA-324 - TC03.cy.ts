import { countryList } from "../../../src/utils/countryList";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { randomElement } from "../../support/test-utils";

//Scenario; Test to check error message is displayed when a mandatory field is empty

const applicantDetailsPage = new ApplicantDetailsPage();

// Random country selection
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

// Define only the error messages to test for empty mandatory fields
const mandatoryFieldErrorMessages = [
  "Date of birth must include a day, month and year.",
  "Enter the applicant's passport number.",
  "Passport issue date must include a day, month and year.",
];

describe("Validate the errors for empty Mandatory Fields", () => {
  beforeEach(() => {
    applicantDetailsPage.visit();
    applicantDetailsPage.interceptFormSubmission();
    applicantDetailsPage.verifyPageLoaded();
  });

  it("Should return errors for empty mandatory fields", () => {
    // Fill in the fields that should have valid data
    applicantDetailsPage.fillFullName("John Doe");
    applicantDetailsPage.selectSex("male");
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Skip date of birth fields (leaving them empty)

    // Skip passport number (leaving it empty)

    // Skip passport issue date fields (leaving them empty)

    // Fill in passport expiry date
    applicantDetailsPage.fillPassportExpiryDate("19", "11", "2031");

    // Fill in address information
    applicantDetailsPage.fillAddressLine1("1322");
    applicantDetailsPage.fillAddressLine2("100th St");
    applicantDetailsPage.fillAddressLine3("Apt 16");
    applicantDetailsPage.fillTownOrCity("North Battleford");
    applicantDetailsPage.fillProvinceOrState("Saskatchewan");
    applicantDetailsPage.selectAddressCountry("CAN");
    applicantDetailsPage.fillPostcode("S4R 0M6");

    applicantDetailsPage.submitForm();

    // Validate error messages
    applicantDetailsPage.validateErrorSummary(mandatoryFieldErrorMessages);
  });
});
