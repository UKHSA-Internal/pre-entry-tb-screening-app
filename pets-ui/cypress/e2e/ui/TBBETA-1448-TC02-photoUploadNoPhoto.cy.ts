import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("TC02: Navigate to Check Details page when no photo is uploaded", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    // Create test fixtures before test run
    createTestFixtures();

    // Generate dynamic dates for adult applicant (25 years old)
    adultAge = 25;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);
    // Format with leading zeros, then normalize for UI comparison
    adultDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getAdultDateOfBirth(adultAge)),
    );
    // Generate passport dates (issued 2 years ago, expires in 8 years)
    const passportIssue = DateUtils.getDateInPast(2);
    const passportExpiry = DateUtils.getPassportExpiryDate(passportIssue, false);
    passportIssueDate = DateUtils.getDateComponents(passportIssue);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Log generated dates for debugging
    cy.log(`Adult Age: ${adultAge}`);
    cy.log(`Adult DOB: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(`DOB Formatted: ${adultDOBFormatted}`);
    cy.log(
      `Calculated Age: ${DateUtils.calculateAge(DateUtils.getAdultDateOfBirth(adultAge))} years`,
    );
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year}`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
  });

  beforeEach(() => {
    // Login before each test
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();
    // Generate random passport number for each test
    passportNumber = getRandomPassportNumber();
    // Select random country
    const randomCountry = randomElement(countryList);
    countryCode = randomCountry?.value;
    countryName = randomCountry?.label;
    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
  });

  it("should navigate directly to Check Details page when no photo is uploaded and Continue is clicked", () => {
    // AC2: GIVEN I have NOT uploaded a photo in the "Upload visa applicant photo (optional)" page
    // WHEN I click the Continue button
    // THEN I am navigated to the "Check visa applicant details" page

    // Search for applicant with passport number
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
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
      .fillFullName("John Doe")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("456 Oak Avenue")
      .fillAddressLine2("Suite 10")
      .fillAddressLine3("Uptown")
      .fillTownOrCity("Bridgetown")
      .fillProvinceOrState("Saint Michael")
      .selectAddressCountry(countryName)
      .fillPostcode("BB22222")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // DO NOT upload a photo - just click continue
    applicantPhotoUploadPage.verifyNoFileChosenText();
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

    // Verify we're on the check details page (skipping check photo page)
    cy.url().should("include", "/check-visa-applicant-details");
  });
});
