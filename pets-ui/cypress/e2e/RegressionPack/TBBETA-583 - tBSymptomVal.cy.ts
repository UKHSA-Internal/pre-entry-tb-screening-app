describe.skip("Validate nagivates to Medical Summary Page where 'NO' is selected for TB Symptoms", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
  });
  it.skip("Should navigate to medical summary page", () => {
    //Enter applicant's age
    cy.get('input[name="age"]').type("29");

    //Select applicants TB Status'
    cy.get('input[name="tbSymptoms"]').check("no");

    //Select applicant's symptoms if applicant answers 'YES' to above
    cy.get("#tb-symptoms-list").should("be.visible");

    //Enter details for 'Other symptoms' if applicable
    cy.get("#other-symptoms-detail").should("be.visible");

    //Select an option if applicant is a child under 11
    cy.get('input[name="underElevenConditions"]').check(
      "not-applicable---applicant-is-aged-11-or-over",
    );

    //Enter details of procedure or condition
    cy.get("#under-eleven-conditions-detail").should("be.visible");

    //Select if applicant has ever had Tuberculosis
    cy.get('input[name="previousTb"]').check("no");

    //Enter details of previous TB infection
    cy.get("#previous-tb-detail").should("be.visible");

    //Select if applicant has had close contact with a person with Pulmonary TB in the past year
    cy.get('input[name="closeContactWithTb"]').check("yes");

    //Enter details of close contact with a person with Pulmonary TB in the past year
    cy.get("#close-contact-with-tb-detail").should("be.visible");

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
  });
});
