// PETS Date Validation Test: BOUNDARY INVALID - Passport Issue Date SAME as Date of Birth
// VALIDATION: Passport issue date cannot be same as date of birth (must be AFTER)
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

describe("PETS Date Validation: BOUNDARY - Passport Issue Date Same as DOB", () => {
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

    // Generate dates for 27 year old adult
    adultAge = 27;
    adultDOB = DateUtils.getAdultDOBComponents(adultAge);

    // BOUNDARY SCENARIO: Passport issued on SAME day as date of birth
    const birthDate = DateUtils.getAdultDateOfBirth(adultAge);
    passportIssueDate = DateUtils.getDateComponents(birthDate); // Same as DOB

    // Passport expiry in future (10 years from today)
    const passportExpiry = DateUtils.getDateInFuture(10);
    passportExpiryDate = DateUtils.getDateComponents(passportExpiry);

    // Log dates for debugging
    cy.log("=== BOUNDARY SCENARIO: PASSPORT ISSUE SAME AS DOB ===");
    cy.log(`Date of Birth: ${adultDOB.day}/${adultDOB.month}/${adultDOB.year}`);
    cy.log(
      `Passport Issue: ${passportIssueDate.day}/${passportIssueDate.month}/${passportIssueDate.year} (SAME AS BIRTH - INVALID!)`,
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

  it("should reject passport issue date that is same as date of birth", () => {
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

    // Fill Applicant Details with passport issue date SAME as DOB
    applicantDetailsPage
      .verifyPageLoaded()
      .fillFullName("Test Boundary Passport")
      .selectSex("Male")
      .selectNationality(countryName)
      .fillBirthDate(adultDOB.day, adultDOB.month, adultDOB.year)
      .fillPassportIssueDate(passportIssueDate.day, passportIssueDate.month, passportIssueDate.year)
      .fillPassportExpiryDate(
        passportExpiryDate.day,
        passportExpiryDate.month,
        passportExpiryDate.year,
      )
      .fillAddressLine1("456 Boundary Street")
      .fillTownOrCity("Boundary City")
      .fillProvinceOrState("Boundary Province")
      .selectAddressCountry(countryName)
      .fillPostcode("B0UN 2RY");

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
