import { countryList } from "../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];

describe("Validate that the continue to medical screening button navigates to the medical screening page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/travel-details");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("should redirect user to Medical Screening Page", () => {
    cy.visit("http://localhost:3000/travel-details");

    // Select a Visa Type
    cy.get("#visa-type.govuk-select").select(randomElement(visaType));

    // Enter VALID Address Information
    cy.get("#address-1").type("17 Exmoor Rd.");
    cy.get("#address-2").type("Southampton");
    cy.get("#town-or-city").type("Hampshire");
    cy.get("#postcode").type("SO14 0AR");
    cy.get("#mobile-number").type("00447811123456");
    cy.get("#email").type("Appvanceiq.efc1@aiq.ukhsa.gov.uk");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that page navigates to travel summary page
    cy.url().should("include", "http://localhost:3000/travel-summary");

    // Validate that user is navigated to correct url when clicking on link in summary page
    const urlMap = {
      "Visa type": "#visa-type",
      "UK Address Line 1": "#address-1",
      "UK Address Line 2": "#address-2",
      "UK Town or City": "#town-or-city",
      "UK Postcode": "#postcode",
      "UK Mobile Number": "#mobile-number",
      "UK Email Address": "#email",
    };

    Object.entries(urlMap).forEach(([summaryList, expectedUrl]) => {
      cy.get(".govuk-summary-list__key")
        .contains(summaryList)
        .closest(".govuk-summary-list__row")
        .find(".govuk-link")
        .contains("Change")
        .click();

      cy.url().should("include", expectedUrl);

      switch (summaryList) {
        case "Visa type":
          cy.get("#visa-type.govuk-select").should("not.have.value", "");
          break;
        case "UK Address Line 1":
          cy.get('input[type="text"][name="applicantUkAddress1"]').should("have.value","17 Exmoor Rd.");
          break;
        case "UK Address Line 2":
          cy.get('input[type="text"][name="applicantUkAddress2"]').should("have.value","Southampton");
          break;
        case "UK Town or City":
          cy.get('input[type="text"][name="townOrCity"]').should("have.value","Hampshire");
          break;
        case "UK Postcode":
          cy.get('input[type="text"][name="postcode"]').should("have.value", "SO14 0AR");
          break;
        case "UK Mobile Number":
          cy.get('input[type="text"][name="ukMobileNumber"]').should("have.value","00447811123456");
          break;
        case "UK Email Address":
          cy.get('input[type="text"][name="ukEmail"]').should("have.value","Appvanceiq.efc1@aiq.ukhsa.gov.uk");
          break;
      }

      cy.go("back");
    });

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that page navigates to travel summary page
    cy.url().should("include", "http://localhost:3000/travel-confirmation");

    //Confirm Travel Record is created
    cy.get("h1").should("have.text", "Travel Information record created");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that page navigates to medical screening page
    cy.url().should("include", "http://localhost:3000/medical-screening");
  });
});
