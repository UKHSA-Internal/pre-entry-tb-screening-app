// PETS Date Validation Test: INVALID - Passport Issue Date BEFORE Date of Birth
// VALIDATION: Passport issue date cannot be before date of birth
// Expected Error: "The passport issue date must be after the date of birth"
import { countryList } from "../../../src/utils/countryList";
import { loginViaB2C } from "../../support/commands";
import { DateUtils } from "../../support/DateUtils";
import { ApplicantConsentPage } from "../../support/page-objects/applicantConsentPage";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { ApplicantSearchPage } from "../../support/page-objects/applicantSearchPage";
import {
  createTestFixtures,
  getRandomPassportNumber,
  randomElement,
} from "../../support/test-helpers";

describe("PETS Date Validation: INVALID - Passport Issue Date Before DOB", () => {
  // Page object instances
  const applicantSearchPage = new ApplicantSearchPage();
  const applicantDetailsPage = new ApplicantDetailsPage();
  const applicantConsentPage = new ApplicantConsentPage();

  // Define variables to store test data
  let countryName: string = "";
  let passportNumber: string = "";

  // Dynamic date variables
  let adultAge: number;
  let adultDOB: ReturnType<typeof DateUtils.getDOBComponentsForAge>;
  let passportIssueDate: ReturnType<typeof DateUtils.getDateComponents>;
  let passportExpiryDate: ReturnType<typeof DateUtils.getDateComponents>;

  before(() => {
    createTestFixtures();

    // Generate dates for 25 year old adult
    adultAge = 25;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);

    // INVALID SCENARIO: Passport issued BEFORE date of birth
    // If DOB is 25 years ago, passport issue will be 26 years ago (1 year before birth)
    const birthDate = DateUtils.getAdultDateOfBirth(adultAge);
    const invalidPassportIssue = new Date(birthDate);
    invalidPassportIssue.setFullYear(birthDate.getFullYear() - 1); // 1 year before birth
    passportIssueDate = DateUtils.getDateComponents(invalidPassportIssue);

    // Passport expiry in future (10 years from today)
    const passportExpiry = DateUtils.getDateInFuture(10);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Log dates for debugging
    cy.log("=== INVALID SCENARIO: PASSPORT ISSUE BEFORE DOB ===");
    cy.log(`Date of Birth: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year} (1 YEAR BEFORE BIRTH - INVALID!)`,
    );
    cy.log(
      `Passport Expiry: ${passportExpiryDate.day}/${passportExpiryDate.month}/${passportExpiryDate.year}`,
    );
  });

  beforeEach(() => {
    loginViaB2C();
    applicantSearchPage.visit();
    cy.acceptCookies();
    applicantSearchPage.verifyPageLoaded();

    // Generate random country and passport number
    const randomCountry = randomElement(countryList);
    countryName = randomCountry?.label;
    passportNumber = getRandomPassportNumber();

    cy.log(`Using passport number: ${passportNumber}`);
    cy.log(`Using country: ${countryName}`);
  });

  it("should reject passport issue date that is before date of birth", () => {
    // Search for new applicant
    applicantSearchPage
      .fillPassportNumber(passportNumber)
      .selectCountryOfIssue(countryName)
      .submitSearch();

    applicantSearchPage.verifyNoMatchingRecordMessage(20000);
    applicantSearchPage.clickCreateNewApplicant();

    // Applicant Consent
    applicantConsentPage.continueWithConsent("Yes");
    applicantSearchPage.verifyRedirectionToCreateApplicantPage();

    // Fill Applicant Details with INVALID passport issue date
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Test Invalid Passport")
      .selectSex("Female")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("123 Test Street")
      .fillTownOrCity("Test City")
      .fillProvinceOrState("Test Province")
      .selectAddressCountry(countryName)
      .fillPostcode("T3ST 1AA");

    // Attempt to submit form - should fail validation
    applicantDetailsPage.submitForm();

    // Verify we're still on the same page
    cy.url().should("include", "/visa-applicant-passport-information");

    // Verify error summary is displayed
    cy.get(".govuk-error-summary").should("be.visible");
    cy.get(".govuk-error-summary__title")
      .should("be.visible")
      .and("contain.text", "There is a problem");

    // Verify the specific error message in error summary
    cy.get(".govuk-error-summary__body")
      .should("be.visible")
      .and("contain.text", "The passport issue date must be after the date of birth");

    // Verify inline error message on the passport issue date field
    cy.get('[id="passport-issue-date"]')
      .parents(".govuk-form-group")
      .find(".govuk-error-message")
      .should("be.visible")
      .and("contain.text", "The passport issue date must be after the date of birth");
  });
});
