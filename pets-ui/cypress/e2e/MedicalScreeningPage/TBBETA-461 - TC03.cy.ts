import { countryList } from "../../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
const visaType = [
  "Family Reunion",
  "Settlement and Dependents",
  "Students",
  "Work",
  "Working Holiday Maker",
  "Government Sponsored",
];
//Scenario:Test to verify error message is displayed where TB Symptoms checked 'Yes' and no symptom is selected. Validation for this test will be
//implemented post mvp
// Validate the error messages above each text box are correct
const errorMessages = ["Select a symptom."];

describe("Validate error message is displayed where 'YES' is selected for TB Symptoms but no symptoms is selected", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display error for not selecting a symptom", () => {
    //Enter applicant's age
    cy.get('input[name="age"]').type("29");

    //Select applicants TB Status'
    cy.get('input[name="tbSymptoms"]').check("yes");

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
    cy.get('input[name="previousTb"]').check("yes");

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
  });
});
