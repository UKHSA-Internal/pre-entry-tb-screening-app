import { countryList } from "../../../src/utils/countryList";
import { ApplicantDetailsPage } from "../../support/page-objects/applicantDetailsPage";
import { randomElement } from "../../support/test-utils";

const applicantDetailsPage = new ApplicantDetailsPage();

// Random country selection
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

describe.skip("Fill out Applicant Details form", () => {
  beforeEach(() => {
    applicantDetailsPage.visit();
    applicantDetailsPage.verifyPageLoaded();
  });

  it.skip("Fill out the application form with valid data", () => {
    applicantDetailsPage.fillFormWithValidData(countryName);
    applicantDetailsPage.submitForm();
  });
});
