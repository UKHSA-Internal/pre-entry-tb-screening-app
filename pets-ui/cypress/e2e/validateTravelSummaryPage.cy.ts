import { TravelInformationPage } from "../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../support/page-objects/travelSummaryPage";
import { randomElement, visaType } from "../support/test-utils";

describe.skip("Validate form is prefilled with data when user navigates back to the Enter Travel Information", () => {
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();

  // Test data
  const testData = {
    addressLine1: "Flat 2, 26 Monmouth St.",
    addressLine2: "Bath",
    townOrCity: "Somerset",
    postcode: "BA1 0AP",
    mobileNumber: "00447123402876",
    email: "Appvanceiq.efc1@aiq.ukhsa.gov.uk",
  };

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("Form should be prefilled with the data that was entered initially", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));
    travelInformationPage.fillAddressLine1(testData.addressLine1);
    travelInformationPage.fillAddressLine2(testData.addressLine2);
    travelInformationPage.fillTownOrCity(testData.townOrCity);
    travelInformationPage.fillPostcode(testData.postcode);
    travelInformationPage.fillMobileNumber(testData.mobileNumber);
    travelInformationPage.fillEmail(testData.email);
    travelInformationPage.submitForm();
    travelSummaryPage.verifyPageLoaded();

    // Click on a random Change link
    cy.get(".govuk-link").then((links) => {
      const randomIndex = Math.floor(Math.random() * links.length);
      const randomLink = links[randomIndex];
      cy.wrap(randomLink).click();

      // Verify navigation back to the travel information page
      cy.url().should("include", "http://localhost:3000/travel-details");

      cy.get("form").should("exist");
    });
  });
});
