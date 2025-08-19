import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";

describe.skip("Applicant Details Form - Invalid File Type Test", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantDetailsPage = new ApplicantDetailsPage();

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

  it.skip("should display error when invalid file type is uploaded", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
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
      .fillFullName("Jan Hailes")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("01", "01", "2000")
      .fillPassportIssueDate("15", "08", "2020")
      .fillPassportExpiryDate("15", "08", "2040")
      .fillAddressLine1("789 Main Street")
      .fillAddressLine2("Suite 101")
      .fillAddressLine3("Stanbic Heights")
      .fillTownOrCity("Hallstatt")
      .fillProvinceOrState("Hallstatt")
      .selectAddressCountry(countryName)
      .fillPostcode("84209")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Verify the upload section is displayed with correct instructions
    applicantPhotoUploadPage.verifyApplicantPhotoUploadSectionDisplayed();

    // Verify file type
    applicantPhotoUploadPage.verifyFileTypeValidation(
      "cypress/fixtures/invalid-file.docx",
      "The selected file must be a JPG, JPEG or PNG",
    );
    // Upload INVALID FILE and click continue manually
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/invalid-file.docx")
      .clickContinue();

    // Error validation
    cy.get(".govuk-error-summary").should("be.visible").and("contain", "There is a problem");
    cy.get(".govuk-error-message")
      .should("be.visible")
      .and("contain", "The selected file must be a JPG, JPEG or PNG");
    cy.get(".govuk-error-summary__list").should(
      "contain",
      "The selected file must be a JPG, JPEG or PNG",
    );
    cy.get(".govuk-form-group--error").should("exist");
  });
});
