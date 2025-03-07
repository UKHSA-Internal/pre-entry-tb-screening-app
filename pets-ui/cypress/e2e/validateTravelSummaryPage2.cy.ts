import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../support/page-objects/travelSummaryPage";
import { randomElement, visaType } from "../support/test-utils";

describe("Validate form is prefilled with data when user navigates back to the Enter Travel Information", () => {
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();

  // Test data
  const testData = {
    visaTypeValue: "",
    addressLine1: "Flat 2, 26 Monmouth St.",
    addressLine2: "Bath",
    townOrCity: "Somerset",
    postcode: "BA1 0AP",
    mobileNumber: "00447123402876",
    email: "Appvanceiq.efc1@aiq.ukhsa.gov.uk",
  };

  beforeEach(() => {
    travelInformationPage.visit();

    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Form should be prefilled with the data that was entered initially", () => {
    const selectedVisaType = randomElement(visaType);
    testData.visaTypeValue = selectedVisaType;
    travelInformationPage.selectVisaType(selectedVisaType);

    // Fill in address and contact information
    travelInformationPage.fillAddressLine1(testData.addressLine1);
    travelInformationPage.fillAddressLine2(testData.addressLine2);
    travelInformationPage.fillTownOrCity(testData.townOrCity);
    travelInformationPage.fillPostcode(testData.postcode);
    travelInformationPage.fillMobileNumber(testData.mobileNumber);
    travelInformationPage.fillEmail(testData.email);

    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();

    // Define mapping between summary list items and their associated field selectors and values
    const fieldMappings = [
      {
        key: "Visa type",
        selector: "#visa-type",
        value: testData.visaTypeValue,
        navigateBack: true,
      },
      {
        key: "UK Address Line 1",
        selector: 'input[name="applicantUkAddress1"]',
        value: testData.addressLine1,
        navigateBack: true,
      },
      {
        key: "UK Address Line 2",
        selector: 'input[name="applicantUkAddress2"]',
        value: testData.addressLine2,
        navigateBack: true,
      },
      {
        key: "UK Town or City",
        selector: 'input[name="townOrCity"]',
        value: testData.townOrCity,
        navigateBack: true,
      },
      {
        key: "UK Postcode",
        selector: 'input[name="postcode"]',
        value: testData.postcode,
        navigateBack: true,
      },
      {
        key: "UK Mobile Number",
        selector: 'input[name="ukMobileNumber"]',
        value: testData.mobileNumber,
        navigateBack: true,
      },
      {
        key: "UK Email Address",
        selector: 'input[name="ukEmail"]',
        value: testData.email,
        navigateBack: false,
      },
    ];

    // Test each field by clicking its change link and verifying the form is prefilled
    fieldMappings.forEach((mapping, index) => {
      cy.get(".govuk-summary-list__key")
        .contains(mapping.key)
        .closest(".govuk-summary-list__row")
        .find(".govuk-link")
        .contains("Change")
        .click();

      // Verify navigation back to the travel information page
      cy.url().should("include", "http://localhost:3000/travel-details");

      // Verify the field has the expected value
      if (mapping.key === "Visa type") {
        cy.get(mapping.selector).should("have.value", mapping.value);
      } else {
        cy.get(mapping.selector).should("have.value", mapping.value);
      }
      if (mapping.navigateBack) {
        cy.go("back");

        // Verify we're back on the summary page
        travelSummaryPage.verifyPageLoaded();
      }
    });
  });

  it("Should validate all prefilled values in a single workflow", () => {
    // Select a visa type and store the selected value
    const selectedVisaType = randomElement(visaType);
    testData.visaTypeValue = selectedVisaType;
    travelInformationPage.selectVisaType(selectedVisaType);

    // Fill in address and contact information
    travelInformationPage.fillAddressLine1(testData.addressLine1);
    travelInformationPage.fillAddressLine2(testData.addressLine2);
    travelInformationPage.fillTownOrCity(testData.townOrCity);
    travelInformationPage.fillPostcode(testData.postcode);
    travelInformationPage.fillMobileNumber(testData.mobileNumber);
    travelInformationPage.fillEmail(testData.email);

    // Submit the form
    travelInformationPage.submitForm();

    // Verify navigation to travel summary page
    travelSummaryPage.verifyPageLoaded();

    // Click the first Change link to go back to the form
    cy.get(".govuk-link").contains("Change").first().click();

    // Verify navigation back to the travel information page
    cy.url().should("include", "http://localhost:3000/travel-details");

    // Verify all fields retain their values
    cy.get("#visa-type").should("have.value", testData.visaTypeValue);
    cy.get('input[name="applicantUkAddress1"]').should("have.value", testData.addressLine1);
    cy.get('input[name="applicantUkAddress2"]').should("have.value", testData.addressLine2);
    cy.get('input[name="townOrCity"]').should("have.value", testData.townOrCity);
    cy.get('input[name="postcode"]').should("have.value", testData.postcode);
    cy.get('input[name="ukMobileNumber"]').should("have.value", testData.mobileNumber);
    cy.get('input[name="ukEmail"]').should("have.value", testData.email);
  });
});
