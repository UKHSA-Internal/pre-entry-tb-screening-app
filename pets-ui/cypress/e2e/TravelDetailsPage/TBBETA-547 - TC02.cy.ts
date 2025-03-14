import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { randomElement, visaType } from "../../support/test-utils";

//Scenario: Travel Information Page Happy Path Test
describe.skip("Enter VALID Data for Applicant Travel Information", () => {
  const travelInformationPage = new TravelInformationPage();

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("Should be redirected to travel confirmation page on submission", () => {
    travelInformationPage.selectVisaType(randomElement(visaType));
    travelInformationPage.fillAddressLine1("61 Legard Drive");
    travelInformationPage.fillAddressLine2("Anlaby");
    travelInformationPage.fillTownOrCity("Hull");
    travelInformationPage.fillPostcode("HU10 6UH");
    travelInformationPage.fillMobileNumber("07123402876");
    travelInformationPage.fillEmail("Appvanceiq.efc1@aiq.ukhsa.gov.uk");
    travelInformationPage.submitForm();
    cy.url().should("include", "http://localhost:3000/travel-summary");
  });
});
