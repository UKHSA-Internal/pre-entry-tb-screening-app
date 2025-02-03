/*As a Clinic user who has submitted all mandatory data in the Medical screening page
I want to see a confirmation page
So that I can confirm that the data entered is saved.

Given I am on the confirmation page
When I click the "Continue to chest x-ray" button
Then I am navigated to the "Chest x-ray" page
*/

// Validate the error messages above each text box are correct

describe("Validate that page navigates to Chest x-ray page when user clicks on 'Continue to chest x-ray' button", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should navigate to Chest x-ray page", () => {
    //Enter applicant's age
    cy.get('input[name="age"]').type("29");

    //Select applicants TB Status'
    cy.get('input[name="tbSymptoms"]').check("yes");

    //Select applicant's symptons
    cy.get('input[name="tbSymptomsList"]').check("cough");
    cy.get('input[name="tbSymptomsList"]').check("other-symptoms");

    //Enter details If you have selected "Other symptoms", list these
    cy.get("#other-symptoms-detail").type("chest pains, headache and vomitting");

    //Select an option if applicant is a child under 11
    cy.get('input[name="underElevenConditions"]').check(
      "not-applicable---applicant-is-aged-11-or-over",
    );

    //Enter details of procedure or condition
    cy.get("#under-eleven-conditions-detail").should("be.visible");

    //Select if applicant has ever had Tuberculosis
    cy.get('input[name="previousTb"]').check("yes");

    //Enter details if applicant selected 'yes' to previous TB infection
    cy.get("#previous-tb-detail").type("chest infection");

    //Select if applicant has had close contact with a person with Pulmonary TB in the past year
    cy.get('input[name="closeContactWithTb"]').check("yes");

    //Enter details if applicant has close contact with a person with Pulmonary TB in the past year
    cy.get("#close-contact-with-tb-detail").type("Grandmother diagnosed with TB");

    //Indicate if applicant is pregnant
    cy.get('input[name="pregnant"]').check("dont-know");

    //Select if applicant have menstrual periods
    cy.get('input[name="menstrualPeriods"]').check("na");

    //Enter applicant physical examination notes
    cy.get("#physical-exam-notes").type("Applicant appears fit");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that the page navigates to the summary page
    cy.url().should("include", "http://localhost:3000/medical-summary");

    // Validate that user is navigated to correct url when clicking on link in summary page
    const urlMap = {
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

    Object.entries(urlMap).forEach(([summaryList, expectedUrl]) => {
      cy.get(".govuk-summary-list__key")
        .contains(summaryList)
        .closest(".govuk-summary-list__row")
        .find(".govuk-link")
        .contains("Change")
        .click();

      cy.url().should("include", expectedUrl);

      switch (summaryList) {
        case "age":
          cy.get('input[name="age"]').should("have.value", "29");
          break;
        case "TB symptoms":
          cy.get('input[type="radio"][name="tbSymptoms"][value="yes"]').should("be.checked");
          break;
        case "Other symptoms":
          cy.get('input[type="checkbox"][name="tbSymptomsList"][value="other-symptoms"]').should(
            "be.checked",
          );
          break;
        case "Has the applicant ever had tuberculosis?":
          cy.get('input[type="radio"][name="previousTb"]').should("be.checked");
          break;
        case "Applicant history if under 11":
          cy.get(
            'input[type="checkbox"][value="not-applicable---applicant-is-aged-11-or-over"]',
          ).should("be.checked");
          break;
        case "Is the applicant pregnant?":
          cy.get('input[type="radio"][name="pregnant"]').should("be.checked");
          break;
        case "Does the applicant have menstrual periods?":
          cy.get('input[type="radio"][name="menstrualPeriods"]').should("be.checked");
          break;
        case "Physical examination notes":
          cy.get("#physical-exam-notes").should("contain.text", "Applicant appears fit");
          break;
      }

      cy.go("back");
    });

    //Click the confirm button
    cy.get('button[type="submit"]').click();

    //validate that page navigates to Medical Confirmation page
    cy.url().should("include", "http://localhost:3000/medical-confirmation");

    //Confirm Medical Screening Record is created
    cy.get("h1").should("contain.text", "Medical screening record created");

    //Click the confirm button
    cy.get('button[type="submit"]').click();

    //Validate the page navigates to 'Chest x-ray' page
    cy.url().should("include", "http://localhost:3000/chest-xray");
  });
});
