import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";

describe.skip("Validate that medical screening page is submitted successfully when all Mandatory fields have VALID data", () => {
  const medicalScreeningPage: MedicalScreeningPage = new MedicalScreeningPage();

  beforeEach(() => {
    medicalScreeningPage.visit();
  });

  it.skip("Should redirect user to Medical Confirmation page", () => {
    medicalScreeningPage.verifyPageLoaded();
    medicalScreeningPage.fillAge("29");
    medicalScreeningPage.selectTbSymptoms("Yes");
    medicalScreeningPage.selectTbSymptomsList(["Cough", "Other symptoms"]);
    medicalScreeningPage.fillOtherSymptoms("chest pains, headache and vomitting");
    medicalScreeningPage.selectUnderElevenOption("Not applicable - applicant is aged 11 or over");
    medicalScreeningPage.fillUnderElevenDetails("thoracic surgery");
    medicalScreeningPage.selectPreviousTb("Yes");
    medicalScreeningPage.fillPreviousTbDetails("chest infection");
    medicalScreeningPage.selectCloseContact("Yes");
    medicalScreeningPage.fillCloseContactDetails("Grandmother diagnosed with TB");
    medicalScreeningPage.selectPregnancyStatus("Don't know");
    medicalScreeningPage.selectMenstrualPeriods("N/A");
    medicalScreeningPage.fillPhysicalExamNotes("Applicant appears fit");
    medicalScreeningPage.submitForm();
    medicalScreeningPage.verifyRedirectedToSummary();
  });
});
