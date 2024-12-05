import { countryList } from "../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T =>arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

//Scenario; Test to check error message is displayed when a mandatory field is empty

describe("Validate the errors for empty Mandatory Fields", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should return errors for empty mandatory fields", () => {
    //Enter valid data for 'Full name'
    cy.get('input[name="fullName"]').type("John Doe");

    //Select a 'Sex'
    cy.get('input[name="sex"]').check("male");

    // Randomly Select 'Country of Nationality & Issue'
    cy.get("#country-of-nationality.govuk-select").select(countryName);
    cy.get("#country-of-issue.govuk-select").select(countryName);

    //Leave 'date of birth' field EMPTY
    cy.get("input#birth-date-day").should("have.value", "");
    cy.get("input#birth-date-month").should("have.value", "");
    cy.get("input#birth-date-year").should("have.value", "");

    //Leave 'Applicant's Passport number' field EMPTY
    cy.get('input[name="passportNumber"]').should("have.value", "");

    //Enter VALID data for 'Issue Date'
    cy.get("input#passport-issue-date-day").type("20");
    cy.get("input#passport-issue-date-month").type("11");
    cy.get("input#passport-issue-date-year").type("2011");

    //Enter VALID data for 'Expiry Date'
    cy.get("input#passport-expiry-date-day").type("19");
    cy.get("input#passport-expiry-date-month").type("11");
    cy.get("input#passport-expiry-date-year").type("2031");

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

    // Validate the error messages above each text box are correct
    const errorMessages = [
      "Date of birth must include a day, month and year.",
      "Enter the applicant's passport number.",
      "Passport issue date must include a day, month and year.",
      
    ];
    // Validate the summary box appears at the top contains the correct error messages
    cy.get(".govuk-error-summary").should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);
    });
  });
});
