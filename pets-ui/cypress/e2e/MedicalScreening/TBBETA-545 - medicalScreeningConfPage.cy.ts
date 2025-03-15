import { MedicalScreeningPage } from "../../support/page-objects/medicalScreeningPage";

/*As a Clinic user who has submitted all mandatory data in the Medical screening page
I want to see a confirmation page
So that I can confirm that the data entered is saved.

Given I am on the confirmation page
When I click the "Continue to chest x-ray" button
Then I am navigated to the "Chest x-ray" page*/

describe.skip("Validate that medical screening page is submitted successfully when all Mandatory fields have VALID data", () => {
  const medicalScreeningPage: MedicalScreeningPage = new MedicalScreeningPage();

  beforeEach(() => {
    medicalScreeningPage.visit();
  });

  it.skip("Should redirect user to Medical Confirmation page", () => {
    // Verify page is loaded
    medicalScreeningPage.verifyPageLoaded();

    // Fill the form
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

    // Submit the form
    medicalScreeningPage.submitForm();

    // Validate that user is navigated to correct url when clicking on link in summary page
    const summaryItems = {
      Age: "#age",
      "Does the applicant have TB symptoms?": "#tb-symptoms",
      "TB symptoms": "#tb-symptoms",
      "Other symptoms": "#other-symptoms-detail",
      "Applicant history if under 11": "#under-eleven-conditions",
      "Additional details of applicant history if under 11": "#under-eleven-conditions-detail",
      "Has the applicant ever had tuberculosis?": "#previous-tb",
      "Detail of applicant's previous TB": "#previous-tb-detail",
      "Is the applicant pregnant?": "#pregnant",
      "Does the applicant have menstrual periods?": "#menstrual-periods",
      "Physical examination notes": "#physical-exam-notes",
    };

    Object.entries(summaryItems).forEach(([summaryList, expectedUrl]) => {
      cy.get(".govuk-summary-list__key")
        .contains(summaryList)
        .closest(".govuk-summary-list__row")
        .find(".govuk-link")
        .contains("Change")
        .click();

      cy.url().should("include", expectedUrl);

      switch (summaryList) {
        case "Age":
          cy.contains("label", "Applicant Age")
            .siblings(".govuk-input__wrapper")
            .find("input")
            .should("have.value", "29");
          break;
        case "Does the applicant have TB symptoms?":
        case "TB symptoms":
          cy.get(`input[name="tbSymptoms"][value="Yes"]`).should("be.checked");
          break;
        case "Other symptoms":
          cy.get(`input[name="tbSymptomsList"][value="Other symptoms"]`).should("be.checked");
          break;
        case "Has the applicant ever had tuberculosis?":
          cy.get(`input[name="previousTb"][value="Yes"]`).should("be.checked");
          break;
        case "Applicant history if under 11":
          cy.get(
            `input[name="underElevenConditions"][value="Not applicable - applicant is aged 11 or over"]`,
          ).should("be.checked");
          break;
        case "Is the applicant pregnant?":
          cy.get(`input[name="pregnant"][value="Don't know"]`).should("be.checked");
          break;
        case "Does the applicant have menstrual periods?":
          cy.get(`input[name="menstrualPeriods"][value="N/A"]`).should("be.checked");
          break;
        case "Physical examination notes":
          cy.contains("label", "Physical examination notes")
            .siblings("textarea")
            .should("have.value", "Applicant appears fit");
          break;
      }

      cy.go("back");
    });

    // Click the confirm button on the summary page
    //Click the confirm button
    cy.get('button[type="submit"]').click();

    // Validate that page navigates to Medical Confirmation page
    cy.url().should("include", "http://localhost:3000/medical-confirmation");

    // Confirm Medical Screening Record is created
    cy.get("h1").should("contain.text", "Medical screening record created");

    // Click the continue button
    cy.get('button[type="submit"]').click();

    // Validate the page navigates to 'Chest x-ray' page
    cy.url().should("include", "http://localhost:3000/chest-xray");
  });
});
