import { TravelConfirmationPage } from "../../support/page-objects/travelConfirmationPage";
import { TravelInformationPage } from "../../support/page-objects/travelInformationPage";
import { TravelSummaryPage } from "../../support/page-objects/travelSummaryPage";
import { randomElement, visaType } from "../../support/test-utils";

describe.skip("Validate that the continue to medical screening button navigates to the medical screening page", () => {
  const travelInformationPage = new TravelInformationPage();
  const travelSummaryPage = new TravelSummaryPage();
  const travelConfirmationPage = new TravelConfirmationPage();

  // Generate test data
  const selectedVisa = randomElement(visaType);
  const testData = {
    addressLine1: "17 Exmoor Rd.",
    addressLine2: "Southampton",
    townOrCity: "Hampshire",
    postcode: "SO14 0AR",
    mobileNumber: "00447811123456",
    email: "Appvanceiq.efc1@aiq.ukhsa.gov.uk",
  };

  beforeEach(() => {
    travelInformationPage.visit();
  });

  it.skip("should redirect user to Medical Screening Page", () => {
    cy.get("#visa-type.govuk-select")
      .find("option")
      .then(($options) => {
        const optionTexts = $options.toArray().map((el) => el.text);

        // Verify all visaType options exist in dropdown
        visaType.forEach((visaType) => {
          expect(optionTexts).to.include(visaType);
        });
      });

    travelInformationPage.selectVisaType(selectedVisa);
    travelInformationPage.fillAddressLine1(testData.addressLine1);
    travelInformationPage.fillAddressLine2(testData.addressLine2);
    travelInformationPage.fillTownOrCity(testData.townOrCity);
    travelInformationPage.fillPostcode(testData.postcode);
    travelInformationPage.fillMobileNumber(testData.mobileNumber);
    travelInformationPage.fillEmail(testData.email);

    travelInformationPage.submitForm();

    travelSummaryPage.verifyPageLoaded();
    const summaryFields = {
      "Visa type": {
        urlFragment: "#visa-type",
        value: selectedVisa,
      },
      "UK Address Line 1": {
        urlFragment: "#address-1",
        value: testData.addressLine1,
      },
      "UK Address Line 2": {
        urlFragment: "#address-2",
        value: testData.addressLine2,
      },
      "UK Town or City": {
        urlFragment: "#town-or-city",
        value: testData.townOrCity,
      },
      "UK Postcode": {
        urlFragment: "#postcode",
        value: testData.postcode,
      },
      "UK Mobile Number": {
        urlFragment: "#mobile-number",
        value: testData.mobileNumber,
      },
      "UK Email Address": {
        urlFragment: "#email",
        value: testData.email,
      },
    };

    Object.entries(summaryFields).forEach(([fieldName, fieldData]) => {
      travelSummaryPage.clickChangeLink(fieldName);
      travelSummaryPage.verifyUrlOnChangePage(fieldData.urlFragment);
      travelSummaryPage.verifyFieldValueOnChangePage(fieldName, fieldData.value);
    });

    travelSummaryPage.submitForm();
    travelConfirmationPage.verifyPageLoaded();
    travelConfirmationPage.submitForm();
    travelConfirmationPage.verifyRedirectionToMedicalScreening();
  });
});
