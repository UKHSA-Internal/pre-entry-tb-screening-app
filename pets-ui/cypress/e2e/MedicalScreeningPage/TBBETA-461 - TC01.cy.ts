import { countryList } from "../../../src/utils/helpers";

// Random number generator
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
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
// Validate the error messages above each text box are correct
const errorMessages = ["Select a visa type."];

describe("Validate that medical screening page is submitted successfully when all Mandatory fields have VALID data", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should redirect user to Medical Confirmation page", () => {

    //Enter applicant's age
    cy.get('input[name="age"]').type("29");

     //Select applicants TB Status'
     cy.get('input[name="tbSymptoms"]').check("yes");
   
     //Select applicant's symptons
     cy.get('input[name="tbSymptomsList"]').check("cough");
     cy.get('input[name="tbSymptomsList"]').check("other-symptoms");

     //Enter 'Other symptons'
     cy.get('#other-symptoms-detail').type("chest pains, headache and vomitting");

     //Select an option if applicant is a child under 11
     cy.get('input[name="underElevenConditions"]').check("not-applicable---applicant-is-aged-11-or-over");

     //Enter details of procedure or condition
     cy.get('#under-eleven-conditions-detail').type("thoracic surgery");

     //Select if applicant has ever had Tuberculosis
     cy.get('input[name="previousTb"]').check("yes");

     //Enter details of previous TB infection
     cy.get('#previous-tb-detail').type("chest infection");

     //Select if applicant has had close contact with a person with Pulmonary TB in the past year
     cy.get('input[name="closeContactWithTb"]').check("yes");

     //Enter details of close contact with a person with Pulmonary TB in the past year
     cy.get('#close-contact-with-tb-detail').type("Grandmother diagnosed with TB");

     //Indicate if applicant is pregnant
     cy.get('input[name="pregnant"]').check("dont-know");

     //Select if applicant have menstrual periods
     cy.get('input[name="menstrualPeriods"]').check("na");

     //Enter applicant physical examination notes
     cy.get('#physical-exam-notes').type("Applicant appears fit");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    //Validate that the page navigates to the summary page
    cy.url().should('include','http://localhost:3000/medical-summary');
    });
  });
