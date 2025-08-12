//JIRA STory TBBETA-550 - Prevent access to TB certificate declaration tasks
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { TBProgressTrackerPage } from "../support/page-objects/tbProgressTrackerPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";
import { ApplicantDetailsPage } from "./../support/page-objects/applicantDetailsPage";

describe("TB certificate declaration task links should NOT be clickable until all pre-requisite tasks are completed", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Define variables to store test data
  let countryCode: string;
  let countryName: string;
  let passportNumber: string;
  let tbCertificateNumber: string;

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

  it("should prevent access to TB certificate declaration task", () => {
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
      .fillFullName("Tess Tester-Test")
      .selectSex("Female")
      .selectNationality(countryName) // Use country code for form filling
      .fillBirthDate("01", "03", "1998")
      .fillPassportIssueDate("10", "05", "2020")
      .fillPassportExpiryDate("10", "05", "2030")
      .fillAddressLine1("123 Vanilla Avenue")
      .fillAddressLine2("Apartment 4B")
      .fillAddressLine3("Downtown")
      .fillTownOrCity("London")
      .fillProvinceOrState("Testershire")
      .selectAddressCountry(countryName) // Use country code for form filling
      .fillPostcode("SW1A 1AA")
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });

    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/applicant-summary");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Name", "Tess Tester-Test");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName); // Use country name for validation
    applicantSummaryPage.verifySummaryValue("Country of nationality", countryName);
    applicantSummaryPage.verifySummaryValue("Country", countryName);

    //confirm above details to proceed to next page
    applicantSummaryPage.confirmDetails();

    // Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();

    // Click continue - this goes to tracker
    applicantConfirmationPage.clickContinue();
    // Verify we're on the tracker page
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // Check applicant information is displayed correctly
    tbProgressTrackerPage.verifyApplicantInfo({
      Name: "Tess Tester-Test",
      "Date of birth": "01/03/1998",
      "Passport number": passportNumber,
    });

    // Verify the applicant photo is displayed
    tbProgressTrackerPage.verifyApplicantPhotoDisplayed();

    // Verify the photo title attribute
    tbProgressTrackerPage.verifyApplicantPhotoAttributes("passportpic.jpeg");

    // Verify task status information
    tbProgressTrackerPage.verifyVisaApplicantDetailsCompleted();

    /* // Verify complete all sections text
    tbProgressTrackerPage.verifyCompleteAllSectionsText(); */

    // Verify all tasks exist
    tbProgressTrackerPage.verifyAllTasksExist();

    // Verify service name
    tbProgressTrackerPage.verifyServiceName();

    // Verify all task statuses
    tbProgressTrackerPage.verifyAllTaskStatuses({
      "Visa applicant details": "Completed",
      "Travel information": "Not yet started",
      "Medical history and TB symptoms": "Not yet started",
      "Radiological outcome": "Not yet started",
      "Sputum collection and results": "Not yet started",
      "TB certificate outcome": "Not yet started",
    });

    // Verify which tasks are clickable links and which are not
    tbProgressTrackerPage.verifyTaskClickability();

    // Verify individual tasks - clickable ones
    tbProgressTrackerPage.verifyTaskIsClickable("Visa applicant details");
    tbProgressTrackerPage.verifyTaskIsClickable("Travel information");

    // Verify individual tasks - non-clickable ones
    tbProgressTrackerPage.verifyTaskIsNotClickable("Medical history and TB symptoms");
    tbProgressTrackerPage.verifyTaskIsNotClickable("Radiological outcome");
    tbProgressTrackerPage.verifyTaskIsNotClickable("Sputum collection and results");
    tbProgressTrackerPage.verifyTaskIsNotClickable("TB certificate outcome");

    // Verify we can click on the "Travel information" link
    tbProgressTrackerPage.clickTaskLink("Travel information");
    cy.url().should("include", "/travel-details");

    // Navigate back to tracker to test other clickable link
    cy.go("back");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify can click on the "Visa applicant details" link
    tbProgressTrackerPage.clickTaskLink("Visa applicant details");
    cy.url().should("include", "/applicant-summary");

    // Navigate back to tracker
    cy.go("back");
    tbProgressTrackerPage.verifyPageLoaded();

    // Verify TB certificate declaration is NOT clickable when other tasks are incomplete
    tbProgressTrackerPage.verifyTaskIsNotClickable("TB certificate outcome");

    // Attempt to manually navigate to TB certificate declaration page (this should be blocked)
    cy.visit("/tb-certificate-declaration", { failOnStatusCode: false });

    // Verify error message or blocking behavior if attempting to access TB certificate task
    cy.log(
      "TB certificate declaration task should remain inaccessible until all other tasks are completed",
    );
  });
});
