import { countryList } from "../../../src/utils/countryList";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { randomElement } from "../../support/test-utils";

describe.skip("Validate Applicant name and address fields accept punctuations and special characters", () => {
  const applicantDetailsPage = new ApplicantDetailsPage();

  // Random number generator
  const randomCountry = randomElement(countryList);
  const countryName = randomCountry?.value;

  beforeEach(() => {
    applicantDetailsPage.visit();
  });

  it.skip("Should not throw error messages when special characters and punctuations are entered in name and address fields", () => {
    // Enter VALID data for 'Full name'
    applicantDetailsPage.fillFullName("John O'Sullivan - Hantan");

    // Select a 'Sex'
    applicantDetailsPage.selectSex("Male");

    // Enter VALID data for 'date of birth'
    applicantDetailsPage.fillBirthDate("4", "JAN", "1998");

    // Enter INVALID data for 'Applicant's Passport number'
    applicantDetailsPage.fillPassportNumber("AA12354607");

    // Randomly Select 'Country of Nationality & Issue'
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Enter VALID data for 'Issue Date'
    applicantDetailsPage.fillPassportIssueDate("20", "11", "2031");

    // Enter VALID data for 'Expiry Date'
    applicantDetailsPage.fillPassportExpiryDate("19", "11", "2011");

    // Enter INVALID Address Information
    applicantDetailsPage.fillAddressLine1("123 Main St");
    applicantDetailsPage.fillAddressLine2("Flat 1/2");
    applicantDetailsPage.fillAddressLine3("West-Lane");
    applicantDetailsPage.fillTownOrCity("Springfield.");
    applicantDetailsPage.fillProvinceOrState("Stockholm");
    applicantDetailsPage.selectAddressCountry(countryName);
    applicantDetailsPage.fillPostcode("S4R 0M6");

    // Click the submit button
    applicantDetailsPage.submitForm();
  });
});
