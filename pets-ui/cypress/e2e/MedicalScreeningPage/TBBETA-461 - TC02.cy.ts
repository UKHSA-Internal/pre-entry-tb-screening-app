const urlFragment = ["#age"];
//Scenario:validate age field and corresponding error message - this field is mandatory.
// Validate the error messages above each text box are correct
const errorMessages = ["Enter applicant's age in years."];

describe("Test to validate applicant AGE field and corresponding error message", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display error message where AGE field is empty", () => {
    //Select applicants TB Status'
    cy.get('input[name="tbSymptoms"]').check("no");

    //Select applicant's symptoms if applicant selects 'YES' to above
    cy.get("#tb-symptoms-list").should("be.visible");

    //Enter details for 'Other symptoms' if applicable
    cy.get("#other-symptoms-detail").should("be.visible");

    //Select an option if applicant is a child under 11
    cy.get('input[name="underElevenConditions"]').check(
      "not-applicable---applicant-is-aged-11-or-over",
    );

    //Select if applicant has ever had Tuberculosis
    cy.get('input[name="previousTb"]').check("no");

    //Select if applicant has had close contact with a person with Pulmonary TB in the past year
    cy.get('input[name="closeContactWithTb"]').check("no");

    //Indicate if applicant is pregnant
    cy.get('input[name="pregnant"]').check("no");

    //Select if applicant have menstrual periods
    cy.get('input[name="menstrualPeriods"]').check("no");

    //Enter applicant physical examination notes
    cy.get("#physical-exam-notes").type("Applicant appears fit");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the summary box appears at the top contains the correct error messages
    cy.get(".govuk-error-summary").should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);

      // Validate that user is navigated to correct error when clicking message in summary
      cy.get(".govuk-error-summary a").each((link, index) => {
        cy.wrap(link).click();
        cy.url().should("include", urlFragment[index]);
      });
    });
  });
});
