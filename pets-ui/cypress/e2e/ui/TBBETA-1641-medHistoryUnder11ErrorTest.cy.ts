//PETS Scenario: Under 11 years Old - Medical history under 11 years Old Error Validation
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
import { MedicalHistoryUnderElevenPage } from "../../support/page-objects/medicalHistoryUnderElevenPage";
import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";
import { PassportInformationPage } from "../../support/page-objects/passportInformationPage";
import { TBProgressTrackerPage } from "../../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { VisaCategoryPage } from "../../support/page-objects/visaCategoryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Scenario : Medical history under 11 years Old Error Validation", () => {
  // Page object instances
  const applicantConsentPage = new ApplicantConsentPage();
  const checkPhotoPage = new CheckVisaApplicantPhotoPage();
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const passportInformationPage = new PassportInformationPage();
  const contactInformationPage = new ContactInformationPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const medicalHistoryUnderElevenPage = new MedicalHistoryUnderElevenPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();
  const visaCategoryPage = new VisaCategoryPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaCategory: string;

  // Date-related variables
  let childAge: number;
  let childDOB: { day: string; month: string; year: string };
  let childDOBFormatted: string;
  let passportIssueDate: { day: string; month: string; year: string };
  let passportExpiryDate: { day: string; month: string; year: string };
  let screeningDate: ReturnType<typeof DateUtils.getDateComponents>;

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

    // Generate dynamic dates for child applicant (age 6 years)
    childAge = 6;
    childDOB = DateUtils.getChildDOBComponents(childAge);
    childDOBFormatted = DateUtils.normalizeDateForComparison(
      DateUtils.formatDateDDMMYYYY(DateUtils.getChildDateOfBirth(childAge)),
    );

    // Generate passport dates (issued 1 year ago, 5-year validity for child)
    const { issueDate, expiryDate } = DateUtils.getValidPassportDates();
    passportIssueDate = issueDate;
    passportExpiryDate = expiryDate;
    /// Generate screening date (1 month ago for realistic scenario)
    const screening = DateUtils.getDateInPast(0, 1, 0); // 1 month ago
    screeningDate = DateUtils.getDateComponents(screening);

    // Log screening date
    cy.log(`Screening Date: ${screeningDate.day}/${screeningDate.month}/${screeningDate.year}`);

    // Log generated dates for debugging
    cy.log(`Child Age: ${childAge}`);
    cy.log(`Child DOB: ${childDOB.day}/${childDOB.month}/${childDOB.year}`);
    cy.log(`DOB Formatted: ${childDOBFormatted}`);
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year}`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
  });

  it('should display error message: Select all that apply, or select "None of these" on Medical History Under 11 Years Old page', () => {
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

    // Verify redirection to applicant search page
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details for Child
    applicantDetailsPage.verifyPageLoaded();

    // Fill in applicant personal details for child (born in 2018, so under 11)
    applicantDetailsPage
      .fillFullName("Nana Kobi Quist")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(childDOB.day, childDOB.month, childDOB.year)
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
      .fillAddressLine1("456 Children's Avenue")
      .fillAddressLine2("Block C")
      .fillTownOrCity("Accra")
      .fillProvinceOrState("Greater Accra")
      .fillPostcode("LS1 3BB")
      .selectCountry(countryName)
      .submitForm();

    // Verify redirection to the Applicant Photo page
    cy.url().should("include", "/upload-visa-applicant-photo");
    applicantPhotoUploadPage.verifyPageLoaded();

    // Upload Applicant Photo file
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/child-passport-photo.jpg")
      .verifyUploadSuccess();

    //Checking no errors appear
    cy.get(".govuk-error-message").should("not.exist");
    cy.get("button").contains("Continue").should("be.visible").and("be.enabled");

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
    applicantSummaryPage.verifySummaryValue("Full name", "Nana Kobi Quist");
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

    // Navigate to travel information from the tracker
    tbProgressTrackerPage.clickTaskLink("UK travel information");

    // Select random category and store the selected value
    visaCategoryPage.selectRandomVisaCategory();
    visaCategoryPage.getSelectedVisaCategory().then((category) => {
      selectedVisaCategory = category;
      cy.log(`Selected random visa category: ${selectedVisaCategory}`);

      // Store as alias for use throughout the test
      cy.wrap(selectedVisaCategory).as("selectedVisa");
    });
    // Click continue to proceed to travel information page
    visaCategoryPage.clickContinue();

    // Fill travel information
    travelInformationPage.verifyPageLoaded();

    travelInformationPage.fillCompleteForm({
      ukAddressLine1: "789 Family Road",
      ukAddressLine2: "Apartment 2C",
      ukTownOrCity: "Bristol",
      ukPostcode: "BS1 4CC",
      mobileNumber: "07700900789",
      email: "pets.parents@hotmail.com",
    });

    // Submit the form
    travelInformationPage.submitForm();

    // Review Travel Summary
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.verifyVisaTypeIsValid();
    // Verify details by clicking change links and checking fields
    travelSummaryPage.clickChangeLink("Address line 1 (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    travelSummaryPage.clickChangeLink("Town or city (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    travelSummaryPage.clickChangeLink("UK phone number (optional)");
    cy.url().should("include", "/visa-applicant-proposed-uk-address");
    cy.go("back");

    // Submit the summary page
    travelSummaryPage.submitForm();

    // Travel Confirmation
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Verify we're back on the tracker
    cy.url().should("include", "/tracker");
    tbProgressTrackerPage.verifyPageLoaded();
    // Navigate to medical screening from the tracker
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");

    // Medical Screening Page - Child with no symptoms, no TB history, no close contact
    medicalScreeningPage.verifyPageLoaded();

    medicalScreeningPage
      .fillScreeningDate(screeningDate.day, screeningDate.month, screeningDate.year)
      .fillAge(childAge.toString())
      .selectTbSymptoms("No") // No symptoms
      .selectPreviousTb("No") // No TB history
      .selectCloseContact("No") // No close contact
      .fillPhysicalExamNotes(
        "Child applicant aged 6 years. No TB symptoms or history. No close contact with TB. Physical examination normal for age.",
      )
      .submitForm();
    // Verify redirection to Medical History Under 11 Page
    medicalHistoryUnderElevenPage.verifyPageLoaded();

    // Submit withoiut selecting any conditions to verify error handling
    medicalHistoryUnderElevenPage.verifyAllConditionsPresent();
    medicalHistoryUnderElevenPage.submitForm();
    medicalHistoryUnderElevenPage.verifyMandatoryErrors();
  });
});
