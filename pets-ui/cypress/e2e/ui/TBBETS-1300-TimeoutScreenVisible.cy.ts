// This test verifies that the idle timeout popup screen is displayed after 18 minutes of inactivity on the Applicant Details page. It fills out the form and then waits for the timeout popup to appear.
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { SignOutPopUpPage } from "../../support/page-objects/signOutPopUpPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("Applicant Details Form - Invalid File Type Test", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantConsentPage = new ApplicantConsentPage();
  //const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const signOutPopUpPage = new SignOutPopUpPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";

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

    // Log what we're using for debugging
    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country code: ${countryCode}`);
    cy.log(`Using country name: ${countryName}`);
  });

  it("should display error when invalid file type is uploaded", () => {
    // Search for applicant with passport number
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
      .fillFullName("Jan Hailes")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("01", "01", "2000")
      .submitForm();

    // Fill in passport details
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .fillIssueDate("15", "08", "2020")
      .fillExpiryDate("15", "08", "2040")
      .submitForm();

    // Fill in contact information
    contactInformationPage.verifyPageLoaded();
    contactInformationPage
      .fillAddressLine1("789 Main Street")
      .fillAddressLine2("Suite 101")
      .fillTownOrCity("Hallstatt")
      .fillProvinceOrState("Hallstatt")
      .fillPostcode("84209")
      .selectCountry(countryName)
      .submitForm();

    // Wait up to 18 min for the timeout popup screen to be aapear and verify its contents
    signOutPopUpPage.verifyIdleTimeoutPopupVisible();
  });
});
