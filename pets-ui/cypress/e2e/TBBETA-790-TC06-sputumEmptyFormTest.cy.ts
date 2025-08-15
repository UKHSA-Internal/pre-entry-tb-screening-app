// Empty Form Submission Test on Sputum Page
import { countryList } from "../../src/utils/countryList";
import { loginViaB2C } from "../support/commands";
import { ApplicantConfirmationPage } from "../support/page-objects/applicantConfirmationPage";
import { ApplicantDetailsPage } from "../support/page-objects/applicantDetailsPage";
import { ApplicantPhotoUploadPage } from "../support/page-objects/applicantPhotoUploadPage";
import { ApplicantSearchPage } from "../support/page-objects/applicantSearchPage";
import { ApplicantSummaryPage } from "../support/page-objects/applicantSummaryPage";
import { ChestXrayConfirmationPage } from "../support/page-objects/chestXrayConfirmationPage";
import { ChestXrayFindingsPage } from "../support/page-objects/chestXrayFindingsPage";
import { ChestXrayPage } from "../support/page-objects/chestXrayQuestionPage";
import { ChestXraySummaryPage } from "../support/page-objects/chestXraySummaryPage";
import { ChestXrayUploadPage } from "../support/page-objects/chestXrayUploadPage";
import { MedicalConfirmationPage } from "../support/page-objects/medicalConfirmationPage";
import { MedicalScreeningPage } from "../support/page-objects/medicalScreeningPage";
import { MedicalSummaryPage } from "../support/page-objects/medicalSummaryPage";
import { SputumCollectionPage } from "../support/page-objects/sputumCollectionPage";
import { SputumQuestionPage } from "../support/page-objects/sputumQuestionPage";
import { TBProgressTrackerPage } from "../support/page-objects/tbProgressTrackerPage";
import { TravelConfirmationPage } from "../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../support/page-objects/travelSummaryPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../support/test-helpers";

describe("Empty Form Submission Test On Sputum Collection Page", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantPhotoUploadPage = new ApplicantPhotoUploadPage();
  const applicantSummaryPage = new ApplicantSummaryPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();
  const medicalScreeningPage = new MedicalScreeningPage();
  const applicantConfirmationPage = new ApplicantConfirmationPage();
  const medicalSummaryPage = new MedicalSummaryPage();
  const medicalConfirmationPage = new MedicalConfirmationPage();
  const sputumQuestionPage = new SputumQuestionPage();
  const sputumCollectionPage = new SputumCollectionPage();
  const chestXrayPage = new ChestXrayPage();
  const chestXrayUploadPage = new ChestXrayUploadPage();
  const chestXrayFindingsPage = new ChestXrayFindingsPage();
  const chestXraySummaryPage = new ChestXraySummaryPage();
  const chestXrayConfirmationPage = new ChestXrayConfirmationPage();
  const tbProgressTrackerPage = new TBProgressTrackerPage();

  // Define variables to store test data
  let countryCode: string = "";
  let countryName: string = "";
  let passportNumber: string = "";
  let tbCertificateNumber: string = "";
  let selectedVisaType: string = "";

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

  it("should display all errors when submitting a completely empty form", () => {
    // Search for applicant with passport number
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.verifyCreateNewApplicantExists();
    applicantSearchPage.clickCreateNewApplicant();

    // Fill applicant details
    applicantDetailsPage.verifyPageLoaded();
    applicantDetailsPage
      .fillFullName("Emma Tester - O'Empty")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate("25", "09", "1992")
      .fillPassportIssueDate("01", "06", "2021")
      .fillPassportExpiryDate("01", "06", "2031")
      .fillAddressLine1("100 Empty Street")
      .fillAddressLine2("Blank Building")
      .fillAddressLine3("Void Village")
      .fillTownOrCity("Empty Town")
      .fillProvinceOrState("Empty State")
      .selectAddressCountry(countryName)
      .fillPostcode("EM123")
      .submitForm();

    // Complete photo upload
    applicantPhotoUploadPage.verifyPageLoaded();
    applicantPhotoUploadPage
      .uploadApplicantPhotoFile("cypress/fixtures/passportpic.jpeg")
      .verifyUploadSuccess();
    applicantPhotoUploadPage.clickContinue();

    // Complete applicant summary
    applicantSummaryPage.verifyPageLoaded();
    applicantSummaryPage.confirmDetails();
    applicantConfirmationPage.verifyPageLoaded();
    applicantConfirmationPage.clickContinue();

    // Complete travel information
    tbProgressTrackerPage.verifyPageLoaded();
    tbProgressTrackerPage.clickTaskLink("Travel information");
    travelInformationPage.verifyPageLoaded();
    travelInformationPage
      .fillCompleteFormWithRandomVisa({
        ukAddressLine1: "200 Empty Road",
        ukAddressLine2: "Void Floor",
        ukTownOrCity: "London",
        ukPostcode: "E1 4MP",
        mobileNumber: "07700900000",
        email: "pets.tester3@hotmail.com",
      })
      .then((randomVisa) => {
        selectedVisaType = randomVisa;
        cy.log(`Selected random visa type: ${selectedVisaType}`);
      });
    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();
    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.clickContinue();

    // Complete medical screening
    tbProgressTrackerPage.clickTaskLink("Medical history and TB symptoms");
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage
      .fillAge("31")
      .selectTbSymptoms("No")
      .selectPreviousTb("No")
      .selectCloseContact("No")
      .selectPregnancyStatus("No")
      .selectMenstrualPeriods("No")
      .fillPhysicalExamNotes("Empty form test examination completed.")
      .submitForm();
    medicalSummaryPage.verifyPageLoaded();
    medicalSummaryPage.confirmDetails();
    medicalConfirmationPage.verifyPageLoaded();
    medicalConfirmationPage.clickContinueButton();

    // Complete chest X-ray
    tbProgressTrackerPage.clickTaskLink("Radiological outcome");
    chestXrayPage.verifyPageLoaded();
    chestXrayPage.selectXrayTakenYes().clickContinue();
    chestXrayUploadPage.verifyPageLoaded();
    chestXrayUploadPage
      .uploadPosteroAnteriorXray("cypress/fixtures/test-chest-xray.dcm")
      .verifyUploadSuccess();
    chestXrayUploadPage.clickContinue();
    chestXrayFindingsPage.verifyPageLoaded();
    chestXrayFindingsPage
      .selectXrayResultNormal()
      .selectMinorFindings(["1.1 Single fibrous streak or band or scar"])
      .clickSaveAndContinue();
    sputumQuestionPage.verifyPageLoaded();
    sputumQuestionPage.selectSputumRequiredYes().clickContinue();
    chestXraySummaryPage.verifyPageLoaded();
    chestXraySummaryPage.clickSaveAndContinue();
    chestXrayConfirmationPage.verifyPageLoaded();
    chestXrayConfirmationPage.clickContinueButton();

    // Navigate to sputum collection
    tbProgressTrackerPage.clickTaskLink("Sputum collection and results");
    sputumCollectionPage.verifyPageLoaded();
    sputumCollectionPage.verifySectionHeaders();
    sputumCollectionPage.verifyPageStructure();
    sputumCollectionPage.verifyAllFieldsEmpty();

    // Verify all fields are initially empty
    cy.get('[data-testid="date-sample-1-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-1-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-1-taken-year"]').should("have.value", "");

    // Check that collection method exists
    cy.get('[name="collectionMethodSample1"]').should("exist");

    cy.get('[data-testid="date-sample-2-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-2-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-2-taken-year"]').should("have.value", "");

    // Check that collection method exists
    cy.get('[name="collectionMethodSample2"]').should("exist");

    cy.get('[data-testid="date-sample-3-taken-day"]').should("have.value", "");
    cy.get('[data-testid="date-sample-3-taken-month"]').should("have.value", "");
    cy.get('[data-testid="date-sample-3-taken-year"]').should("have.value", "");
    // Check that collection method exists
    cy.get('[name="collectionMethodSample3"]').should("exist");

    // Attempt to submit the completely empty form
    sputumCollectionPage.clickSaveAndContinueToResults();

    // Verify error summary is displayed
    sputumCollectionPage.validateErrorSummaryVisible();

    // Verify all required field errors are shown
    sputumCollectionPage.validateAllRequiredFieldErrors();

    // Verify specific error messages for all samples
    sputumCollectionPage.validateErrorSummaryContains([
      "Enter the date sample 1 was taken on",
      "Enter Sputum sample 1 collection method",
      "Enter the date sample 2 was taken on",
      "Enter Sputum sample 2 collection method",
      "Enter the date sample 3 was taken on",
      "Enter Sputum sample 3 collection method",
    ]);

    // Verify individual field errors for all samples
    sputumCollectionPage.validateSample1DateError();
    sputumCollectionPage.validateSample1CollectionMethodError();
    sputumCollectionPage.validateSample2DateError();
    sputumCollectionPage.validateSample2CollectionMethodError();
    sputumCollectionPage.validateSample3DateError();
    sputumCollectionPage.validateSample3CollectionMethodError();

    // Verify comprehensive error validation
    sputumCollectionPage.validateFormErrors({
      sample1Date: "Enter the date sample 1 was taken on",
      sample1CollectionMethod: "Enter Sputum sample 1 collection method",
      sample2Date: "Enter the date sample 2 was taken on",
      sample2CollectionMethod: "Enter Sputum sample 2 collection method",
      sample3Date: "Enter the date sample 3 was taken on",
      sample3CollectionMethod: "Enter Sputum sample 3 collection method",
    });

    // Verify error styling is applied to all fields
    sputumCollectionPage.verifyFieldErrorStates();

    // Verify that error summary links work correctly
    cy.get('.govuk-error-summary__list a[href="#date-sample-1-taken"]').should("exist").click();
    cy.get('[data-testid="date-sample-1-taken-day"]').should("be.focused");

    cy.get('.govuk-error-summary__list a[href="#date-sample-2-taken"]').should("exist").click();
    cy.get('[data-testid="date-sample-2-taken-day"]').should("be.focused");

    cy.get('.govuk-error-summary__list a[href="#date-sample-3-taken"]').should("exist").click();
    cy.get('[data-testid="date-sample-3-taken-day"]').should("be.focused");

    // Verify we remain on the sputum collection page
    cy.url().should("include", "/sputum-collection");

    // Verify that all form fields still have the correct error styling
    cy.get("#date-sample-1-taken").should("have.class", "govuk-form-group--error");
    cy.get("#date-sample-2-taken").should("have.class", "govuk-form-group--error");
    cy.get("#date-sample-3-taken").should("have.class", "govuk-form-group--error");
    cy.get("#collection-method-sample-1").should("have.class", "govuk-form-group--error");
    cy.get("#collection-method-sample-2").should("have.class", "govuk-form-group--error");
    cy.get("#collection-method-sample-3").should("have.class", "govuk-form-group--error");
  });
});
