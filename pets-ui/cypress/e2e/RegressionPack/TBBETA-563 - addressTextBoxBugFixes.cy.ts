import { countryList } from "../../../src/utils/helpers";
import { randomElement } from "../../support/test-utils";

// Random number generator
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

describe("Validate Applicant name and address fields accept punctuations and special characters", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/contact");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should not throw error messages when special characters and punctuations are entered in name and address fields", () => {
    // Enter VALID data for 'Full name'
    cy.get('input[name="fullName"]').type("John O'Sullivan - Hantan");

    //Select a 'Sex'
    cy.get('input[name="sex"]').check("male");

    //Enter VALID data for 'date of birth'
    cy.get("input#birth-date-day").type("4");
    cy.get("input#birth-date-month").type("JAN");
    cy.get("input#birth-date-year").type("1998");

    //Enter INVALID data for 'Applicant's Passport number'
    cy.get('input[name="passportNumber"]').type("AA12354607");

    // Randomly Select 'Country of Nationality & Issue'
    cy.get("#country-of-nationality.govuk-select").select(countryName);
    cy.get("#country-of-issue.govuk-select").select(countryName);

    //Enter VALID data for 'Issue Date'
    cy.get("input#passport-issue-date-day").type("20");
    cy.get("input#passport-issue-date-month").type("11");
    cy.get("input#passport-issue-date-year").type("2031");

    //Enter VALID data for 'Expiry Date'
    cy.get("input#passport-expiry-date-day").type("19");
    cy.get("input#passport-expiry-date-month").type("11");
    cy.get("input#passport-expiry-date-year").type("2011");

    // Enter INVALID Address Information
    cy.get("#address-1").type("123 Main St");
    cy.get("#address-2").type("Flat 1/2");
    cy.get("#address-3").type("West-Lane");
    cy.get("#town-or-city").type("Springfield.");
    cy.get("#province-or-state").type("Stockholm");
    cy.get("#address-country.govuk-select").select(countryName);
    cy.get("#postcode").type("S4R 0M6");

    // Click the submit button
    cy.get('button[type="submit"]').click();
  });
});
