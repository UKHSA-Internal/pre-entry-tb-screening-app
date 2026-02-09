// TBBETA-1586: Test visa category page with radio buttons
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConfirmationPage } from "../../support/page-objects/applicantConfirmationPage";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { CheckVisaApplicantPhotoPage } from "../../support/page-objects/checkVisaApplicantPhotoPage";
import { ContactInformationPage } from "../../support/page-objects/contactInformationPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("TBBETA-1586: Visa Category Radio Buttons Tests", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();
  const contactInformationPage = new ContactInformationPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const passportInformationPage = new PassportInformationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let adultDOBFormatted: string;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;
  let xrayDate: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample1Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample2Date: ReturnType<typeof DateUtils.getDateComponents>;
  let sputumSample3Date: ReturnType<typeof DateUtils.getDateComponents>;

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

    // Generate screening date (1 month ago for realistic scenario)
    const screening = DateUtils.getDateInPast(0, 1, 0); // 1 month ago
    screeningDate = DateUtils.getDateComponents(screening);

    // Generate X-ray date (2 weeks ago, after screening)
    const xray = DateUtils.getDateInPast(0, 0, 14); // 2 weeks ago
    xrayDate = DateUtils.getDateComponents(xray);

    // Generate sputum collection dates (2-3 months ago for realistic scenario)
    const sample1 = DateUtils.getDateInPast(0, 3, 0); // 3 months ago
    const sample2 = DateUtils.getDateInPast(0, 3, -1); // 1 day after sample 1
    const sample3 = DateUtils.getDateInPast(0, 3, -2); // 1 day after sample 2

    sputumSample1Date = DateUtils.getDateComponents(sample1);
    sputumSample2Date = DateUtils.getDateComponents(sample2);
    sputumSample3Date = DateUtils.getDateComponents(sample3);

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
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);
    cy.log(`X-ray Date: ${xrayDate.day}/${xrayDate.month}/${xrayDate.year}`);
    cy.log(
      `Sputum Sample 1: ${sputumSample1Date.day}/${sputumSample1Date.month}/${sputumSample1Date.year}`,
    );
    cy.log(
      `Sputum Sample 2: ${sputumSample2Date.day}/${sputumSample2Date.month}/${sputumSample2Date.year}`,
    );
    cy.log(
      `Sputum Sample 3: ${sputumSample3Date.day}/${sputumSample3Date.month}/${sputumSample3Date.year}`,
    );
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
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

  it("TC02: should allow selecting each visa category option", () => {
    // Search for applicant with passport number
    cy.acceptCookies();
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName) // Use country code for form filling
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
      .fillFullName("Jane Smith")
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .selectSex("Female")
      .selectNationality(countryName) // Use country code for form filling
      .submitForm();
    // Fill in passport details
    passportInformationPage.verifyPageLoaded();
    passportInformationPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName) // Use country code for form filling
      .fillIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillExpiryDate(passportExpiryDate.day, passportExpiryDate.month, passportExpiryDate.year)
      .submitForm();
    // Fill in contact information
    contactInformationPage.verifyPageLoaded();
    contactInformationPage
      .fillAddressLine1("123 Main Street")
      .fillAddressLine2("Apt 4B")
      .fillTownOrCity("St. Peter Port")
      .fillProvinceOrState("St. Peters")
      .fillPostcode("54109")
      .selectCountry(countryName)
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();

    // Continue to Applicant Summary page
    applicantPhotoUploadPage.clickContinue();

    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`);
    });
    // Verify redirection to the Check Photo page
    cy.url().should("include", "/check-visa-applicant-photo");

    checkPhotoPage.verifyPageLoaded();
    checkPhotoPage.verifyPageHeadingText();
    checkPhotoPage.verifyUploadedPhotoDisplayed();
    checkPhotoPage.verifyFilenameDisplayed();
    checkPhotoPage.verifyImageLayout();
    checkPhotoPage.verifyRadioButtonsExist();
    checkPhotoPage.selectYesAddPhoto();
    checkPhotoPage.clickContinue();
    // Verify redirection to the Applicant Summary page
    cy.url().should("include", "/check-visa-applicant-details");
    applicantSummaryPage.verifyPageLoaded();

    // Verify some of the submitted data appears correctly in the summary
    applicantSummaryPage.verifySummaryValue("Full name", "Jane Smith");
    applicantSummaryPage.verifySummaryValue("Passport number", passportNumber);
    applicantSummaryPage.verifySummaryValue("Country of issue", countryName);
    applicantSummaryPage.verifySummaryValue("Nationality", countryName);
    applicantSummaryPage.verifySummaryValue("Country", countryName);

    // Confirm above details to proceed to next page
    applicantSummaryPage.confirmDetails();

    // Verify applicant confirmation page
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.verifyNextStepsText();

    // Click continue - this goes to tracker
    applicantConfirmationPage.clickContinue();

    // Verify we're on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();

    // NOW navigate to travel information from the tracker
    tbProgressTrackerPage.clickTaskLink("UK travel information");

    const visaCategories: Array<"Work" | "Study" | "Family reunion" | "Other" | "Do not know"> = [
      "Work",
      "Study",
      "Family reunion",
      "Other",
      "Do not know",
    ];

    visaCategories.forEach((category) => {
      cy.log(`Testing selection of: ${category}`);

      // Select the category
      visaCategoryPage.selectVisaCategory(category);

      // Verify it's selected
      visaCategoryPage.verifyVisaCategorySelected(category);

      // Verify the value can be retrieved
      visaCategoryPage.getSelectedVisaCategory().should("equal", category);
    });
  });
});
