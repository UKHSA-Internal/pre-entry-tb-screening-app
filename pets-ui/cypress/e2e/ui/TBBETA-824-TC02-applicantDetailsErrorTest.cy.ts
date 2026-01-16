import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Application Applicant Details Error Test", () => {
  // Page object instances
  const applicantConsentPage = new ApplicantConsentPage();
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();

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
      .selectCountryOfIssue(countryCode) // Use country code for form filling
      .submitSearch();

    // Verify no matching record found and click create new
    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Verify Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");

    // Verify redirection to the contact page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant details
    applicantDetailsPage
      .fillFullName("Jon Tester")
      .selectSex("Male")
      .selectNationality(countryCode) // Use country code for form filling
      .fillBirthDate("15", "09", "1990")
      .submitForm();

    // Move to passport information page
    passportInformationPage.verifyPageLoaded();

    // Set issue date after expiry date (issue date in future)
    const currentYear = new Date().getFullYear();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate("30", "08", (currentYear + 2).toString())
      .fillExpiryDate("30", "08", (currentYear + 1).toString())
      .submitForm();

    // Validate error specific to INVALID DATE
    passportInformationPage.validateErrorSummaryVisible();
    passportInformationPage.validateIssueDateFieldError(
      "Passport issue date must be today or in the past",
    );
  });
});
