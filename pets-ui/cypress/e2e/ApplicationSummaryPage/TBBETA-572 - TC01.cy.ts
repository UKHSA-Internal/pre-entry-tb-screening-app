import { countryList } from "../../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

describe("Validate that applicant form is prefilled when user navigates back to applicant information page from applicant summary page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/contact");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should be prefilled with the data that was entered initially", () => {
    // Enter VALID data for 'Full name'
    cy.get('input[name="fullName"]').type("John Doe");

    //Select a 'Sex'
    cy.get('input[name="sex"]').check("male");

    //Enter VALID data for 'date of birth'
    cy.get("input#birth-date-day").type("04");
    cy.get("input#birth-date-month").type("01");
    cy.get("input#birth-date-year").type("2001");

    //Enter data for 'Applicant's Passport number'
    cy.get('input[name="passportNumber"]').type("AA1235467");

    // Randomly Select 'Country of Nationality & Issue'
    cy.get("#country-of-nationality.govuk-select").select(countryName);
    cy.get("#country-of-issue.govuk-select").select(countryName);

    //Enter VALID data for 'Issue Date'
    cy.get("input#passport-issue-date-day").type("11");
    cy.get("input#passport-issue-date-month").type("11");
    cy.get("input#passport-issue-date-year").type("2019");

    //Enter VALID data for 'Expiry Date'
    cy.get("input#passport-expiry-date-day").type("11");
    cy.get("input#passport-expiry-date-month").type("11");
    cy.get("input#passport-expiry-date-year").type("2029");

    // Enter VALID Address Information
    cy.get("#address-1").type("123");
    cy.get("#address-2").type("100th St");
    cy.get("#address-3").type("West Lane");
    cy.get("#town-or-city").type("North Battleford");
    cy.get("#province-or-state").type("Saskatchewan");
    cy.get("#address-country.govuk-select").select(countryName);
    cy.get("#postcode").type("S4R 0M6");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate that the page navigates to the confirmation page
    cy.url().should("include", "http://localhost:3000/applicant-summary");

    // Validate that user is navigated to correct url when clicking on link in summary page
    const urlMap = {
      Name: "#name",
      Sex: "#sex",
      "Date of Birth": "#birth-date",
      "Passport number": "#passportNumber",
      "Country of Issue": "#country-of-issue",
      "Passport Issue Date": "#passport-issue-date",
      "Passport Expiry Date": "#passport-expiry-date",
      "Home Address Line 1": "#address-1",
      "Home Address Line 2": "#address-2",
      "Home Address Line 3": "#address-3",
      "Town or City": "#town-or-city",
      "Province or State": "#province-or-state",
      Postcode: "#postcode",
    };

    const fieldNames = Object.keys(urlMap);
    const summaryList = fieldNames[Math.floor(Math.random() * fieldNames.length)];
    const expectedUrl = urlMap[summaryList];

    cy.get(".govuk-summary-list__key")
      .contains(summaryList)
      .closest(".govuk-summary-list__row")
      .find(".govuk-link")
      .contains("Change")
      .click();

    cy.url().should("include", expectedUrl);
    //Validate the page is prefilled with data entered in the applicant page
    cy.get('input[name="fullName"]').should("have.value", "John Doe");
    cy.get('input[type="radio"][value="male"]').should("be.checked");
    //cy.get(`#country-of-nationality option[value="${countryName}"]`).should('be.selected');
    cy.get(`#country-of-issue option[value="${countryName}"]`).should("be.selected");
    cy.get("input#passport-issue-date-day").should("have.value", "11");
    cy.get("input#passport-issue-date-month").should("have.value", "11");
    cy.get("input#passport-issue-date-year").should("have.value", "2019");
    cy.get("input#passport-expiry-date-day").should("have.value", "11");
    cy.get("input#passport-expiry-date-month").should("have.value", "11");
    cy.get("input#passport-expiry-date-year").should("have.value", "2029");
    cy.get('input[type="text"][name="applicantHomeAddress1"]').should("have.value", "123");
    cy.get('input[type="text"][name="applicantHomeAddress2"]').should("have.value", "100th St");
    cy.get('input[type="text"][name="applicantHomeAddress3"]').should("have.value", "West Lane");
    cy.get('input[type="text"][name="townOrCity"]').should("have.value", "North Battleford");
    cy.get('input[type="text"][name="provinceOrState"]').should("have.value", "Saskatchewan");
    //cy.get(`#address-country option[value="${countryName}"]`).should('be.selected');
    cy.get('input[type="text"][name="postcode"]').should("have.value", "S4R 0M6");
  });
});
