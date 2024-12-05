import { countryList } from "../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

//Scenario; Test to validate applicant details date fields will reject special characters

describe("Validate error messages for Applicant Details Date Fields", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Fill out the application date fields with invalid characters", () => {
    //Enter valid data for 'Full name'
    cy.get('input[name="fullName"]').type("John Doe");

    //Select a 'Sex'
    cy.get('input[name="sex"]').check("male");

    // Randomly Select 'Country of Nationality & Issue'
    cy.get("#country-of-nationality.govuk-select").select(countryName);
    cy.get("#country-of-issue.govuk-select").select(countryName);

    //Enter INVALID data for 'date of birth'
    cy.get("input#birth-date-day").type("4");
    cy.get("input#birth-date-month").type("JAN");
    cy.get("input#birth-date-year").type("19/8");

    //Enter valid data for 'Applicant's Passport number'
    cy.get('input[name="passportNumber"]').type("AA1235467");

    //Enter INVALID data for 'Issue Date'
    cy.get("input#passport-issue-date-day").type("2o");
    cy.get("input#passport-issue-date-month").type("10");
    cy.get("input#passport-issue-date-year").type("20&1");

    //Enter INVALID data for 'Expiry Date'
    cy.get("input#passport-expiry-date-day").type("10");
    cy.get("input#passport-expiry-date-month").type("10");
    cy.get("input#passport-expiry-date-year").type("20$1");

    //Enter valid address information
    cy.get("#address-1").type("1322");
    cy.get("#address-2").type("100th St");
    cy.get("#address-3").type("Apt 16");
    cy.get("#town-or-city").type("North Battleford");
    cy.get("#province-or-state").type("Saskatchewan");
    cy.get("#address-country.govuk-select").select("CAN");
    cy.get("#postcode").type("S4R 0M6");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the error messages above each text box are correct
    const errorMessages = [
      "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
      "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
      "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
    ];
    // Validate the summary box appears at the top contains the correct error messages
    cy.get(".govuk-error-summary").should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);
    });
  });
});
