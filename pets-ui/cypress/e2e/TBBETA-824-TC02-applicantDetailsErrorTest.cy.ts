import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";

describe("PETS Application End-to-End Tests with Sputum Collection", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantDetailsPage = new ApplicantDetailsPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    applicantSearchPage.verifyPageLoaded();
    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryCode = randomCountry?.value; // For form filling (e.g., "BRB")
    countryName = randomCountry?.label; // For validation (e.g., "Barbados")
    passportNumber = getRandomPassportNumber();
    tbCertificateNumber = "TB" + Math.floor(10000000 + Math.random() * 90000000);

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
    cy.log(`Using TB certificate number: ${tbCertificateNumber}`);
  });

  it("should display error when passport issue date is after expiry date", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName) // Use country code for form filling
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details
    applicantDetailsPage
      .fillFullName("Jon Tester")
      .selectSex("Male")
      .selectNationality(countryName) // Use country code for form filling
      .fillBirthDate("15", "09", "1990");

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
