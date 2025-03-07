import { countryList } from "../../src/utils/countryList";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { randomElement } from "../support/test-utils";

const applicantDetailsPage = new ApplicantDetailsPage();

// Random country selection
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

describe("Validate User Journey for New Applicants", () => {
  beforeEach(() => {
    // Navigate to the contact page
    applicantDetailsPage.visit();
    applicantDetailsPage.interceptFormSubmission();

    applicantDetailsPage.verifyPageLoaded();
  });

  it("Fill out the application with valid data", () => {
    // Enter personal details
    applicantDetailsPage.fillFullName("John Doe");
    applicantDetailsPage.selectSex("Male");

    // Select countries
    applicantDetailsPage.selectNationality(countryName);
    applicantDetailsPage.selectCountryOfIssue(countryName);

    // Enter valid date of birth
    applicantDetailsPage.fillBirthDate("4", "JAN", "2000");

    // Enter passport details
    applicantDetailsPage.fillPassportNumber("AA1235467");
    applicantDetailsPage.fillPassportIssueDate("20", "10", "2001");
    applicantDetailsPage.fillPassportExpiryDate("10", "10", "2031");

    // Enter address information
    applicantDetailsPage.fillAddressLine1("1322");
    applicantDetailsPage.fillAddressLine2("100th St");
    applicantDetailsPage.fillAddressLine3("Apt 16");
    applicantDetailsPage.fillTownOrCity("North Battleford");
    applicantDetailsPage.fillProvinceOrState("Saskatchewan");
    applicantDetailsPage.selectAddressCountry("CAN");
    applicantDetailsPage.fillPostcode("S4R 0M6");

    // Submit the form
    applicantDetailsPage.submitForm();
    applicantDetailsPage.waitForSubmissionResponse();
  });
});
