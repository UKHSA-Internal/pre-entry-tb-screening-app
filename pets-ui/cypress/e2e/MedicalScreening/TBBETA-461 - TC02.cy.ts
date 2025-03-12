import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";

//Scenario:validate age field and corresponding error message - this field is mandatory.

describe.skip("Test to validate applicant AGE field and corresponding error message", () => {
  const medicalScreeningPage = new MedicalScreeningPage();

  beforeEach(() => {
    medicalScreeningPage.visit();
  });

  it.skip("Should display error message where AGE field is empty", () => {
    medicalScreeningPage.verifyPageLoaded();

    // Complete the form without filling in age
    medicalScreeningPage.selectTbSymptoms("No");
    medicalScreeningPage.selectUnderElevenOption("Not applicable - applicant is aged 11 or over");
    medicalScreeningPage.selectPreviousTb("No");
    medicalScreeningPage.selectCloseContact("No");
    medicalScreeningPage.selectPregnancyStatus("No");
    medicalScreeningPage.selectMenstrualPeriods("No");
    medicalScreeningPage.fillPhysicalExamNotes("Applicant appears fit");

    // Submit the form
    medicalScreeningPage.submitForm();

    // Validate the error messages
    medicalScreeningPage.validateErrorSummaryVisible();
    medicalScreeningPage.validateErrorContainsText("There is a problem");
    medicalScreeningPage.validateErrorContainsText("Enter applicant's age in years.");
  });
});
