import { countryList } from "../../../src/utils/countryList";
import { ApplicantSummaryPage } from "../../support/page-objects/applicantSummaryPage";
import { testData } from "../../support/test-data";
import { randomElement } from "../../support/test-utils";

describe.skip("Applicant Form Pre-fill Validation", () => {
  const randomCountry = randomElement(countryList);
  const countryName = randomCountry?.value;
  const applicantSummaryPage = new ApplicantSummaryPage();

  beforeEach(() => {
    cy.visit("/contact");
  });

  it.skip("should preserve form data when navigating back from summary page", () => {
    // Fill personal information
    cy.get('input[name="fullName"]').type(testData.fullName);
    cy.get('input[name="sex"]').check(testData.sex);

    // Fill birth date
    cy.get("input#birth-date-day").type(testData.birthDate.day);
    cy.get("input#birth-date-month").type(testData.birthDate.month);
    cy.get("input#birth-date-year").type(testData.birthDate.year);

    // Fill passport details
    cy.get('input[name="passportNumber"]').type(testData.passport.number);
    cy.get("#country-of-nationality.govuk-select").select(countryName);
    cy.get("#country-of-issue.govuk-select").select(countryName);

    // Fill passport dates
    cy.get("input#passport-issue-date-day").type(testData.passport.issueDate.day);
    cy.get("input#passport-issue-date-month").type(testData.passport.issueDate.month);
    cy.get("input#passport-issue-date-year").type(testData.passport.issueDate.year);

    cy.get("input#passport-expiry-date-day").type(testData.passport.expiryDate.day);
    cy.get("input#passport-expiry-date-month").type(testData.passport.expiryDate.month);
    cy.get("input#passport-expiry-date-year").type(testData.passport.expiryDate.year);

    // Fill address information
    cy.get("#address-1").type(testData.address.line1);
    cy.get("#address-2").type(testData.address.line2);
    cy.get("#address-3").type(testData.address.line3);
    cy.get("#town-or-city").type(testData.address.town);
    cy.get("#province-or-state").type(testData.address.province);
    cy.get("#address-country.govuk-select").select(countryName);
    cy.get("#postcode").type(testData.address.postcode);

    // Submit form and verify navigation
    cy.get('button[type="submit"]').click();

    // Verify we've reached the applicant summary page
    applicantSummaryPage.verifyPageLoaded();

    // Select a random field to change
    const fieldNames = [
      "Name",
      "Sex",
      "Date of Birth",
      "Passport number",
      "Country of Issue",
      "Passport Issue Date",
      "Passport Expiry Date",
      "Home Address Line 1",
      "Home Address Line 2",
      "Home Address Line 3",
      "Town or City",
      "Province or State",
      "Postcode",
    ];
    const randomField = randomElement(fieldNames);

    // Click the change link for the selected field
    applicantSummaryPage.clickChangeLink(randomField);

    // Verify form fields contain the expected values
    // Verify personal information
    cy.get('input[name="fullName"]').should("have.value", testData.fullName);
    cy.get('input[type="radio"][value="male"]').should("be.checked");

    // Verify country selections
    cy.get(`#country-of-issue option[value="${countryName}"]`).should("be.selected");

    // Verify passport dates
    cy.get("input#passport-issue-date-day").should("have.value", testData.passport.issueDate.day);
    cy.get("input#passport-issue-date-month").should(
      "have.value",
      testData.passport.issueDate.month,
    );
    cy.get("input#passport-issue-date-year").should("have.value", testData.passport.issueDate.year);

    cy.get("input#passport-expiry-date-day").should("have.value", testData.passport.expiryDate.day);
    cy.get("input#passport-expiry-date-month").should(
      "have.value",
      testData.passport.expiryDate.month,
    );
    cy.get("input#passport-expiry-date-year").should(
      "have.value",
      testData.passport.expiryDate.year,
    );

    // Verify address information
    cy.get('input[type="text"][name="applicantHomeAddress1"]').should(
      "have.value",
      testData.address.line1,
    );
    cy.get('input[type="text"][name="applicantHomeAddress2"]').should(
      "have.value",
      testData.address.line2,
    );
    cy.get('input[type="text"][name="applicantHomeAddress3"]').should(
      "have.value",
      testData.address.line3,
    );
    cy.get('input[type="text"][name="townOrCity"]').should("have.value", testData.address.town);
    cy.get('input[type="text"][name="provinceOrState"]').should(
      "have.value",
      testData.address.province,
    );
    cy.get('input[type="text"][name="postcode"]').should("have.value", testData.address.postcode);
  });
});
