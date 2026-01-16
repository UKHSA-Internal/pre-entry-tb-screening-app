import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe('TC06: Select "No, choose a different photo" and navigate back to Upload', () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
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

  it('should navigate back to Upload Photo page with no file chosen when "No, choose a different photo" is selected', () => {
    // AC5: GIVEN I am on the "Check visa applicant photo" page
    // AND have selected the "No, choose a different photo" radio button
    // WHEN I click the continue button
    // THEN I am navigated back to the "Upload visa applicant photo (optional)" page
    // AND no file is chosen

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

    // Fill in applicant personal details
    applicantDetailsPage
      .fillFullName("David Wilson")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .submitForm();

    // Fill in passport details
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillExpiryDate(passportExpiryDate.day, passportExpiryDate.month, passportExpiryDate.year)
      .submitForm();

    // Fill in contact information
    contactInformationPage.verifyPageLoaded();
    contactInformationPage
      .fillAddressLine1("888 Birch Street")
      .fillAddressLine2("Apartment 7D")
      .fillTownOrCity("Bridgetown")
      .fillProvinceOrState("Saint Michael")
      .fillPostcode("BB66666")
      .selectCountry(countryName)
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    // Continue to Check Photo page
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

    // Verify we're on the check photo page
    cy.url().should("include", "/check-visa-applicant-photo");
    checkPhotoPage.verifyPageLoaded();

    // Select "No, choose a different photo" and continue
    checkPhotoPage.selectNoChooseDifferent().clickContinue();

    // Verify we're back on the upload page
    applicantPhotoUploadPage.verifyPageLoaded().verifyPageUrl();

    // Verify no file is chosen
    applicantPhotoUploadPage.verifyNoFileChosenText().verifyChooseFileButtonExists();
  });
});
