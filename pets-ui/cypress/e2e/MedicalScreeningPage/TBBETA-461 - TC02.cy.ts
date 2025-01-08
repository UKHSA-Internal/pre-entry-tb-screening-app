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
const urlFragment = [
    "#age",
    
];
// Validate the error messages above each text box are correct
const errorMessages = ["Enter applicant's age in years."];

describe("Test Applicant under 11 years with previous TB history and selected 'Other Symptoms'", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/medical-screening");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });
  it("Should display error message where symptoms is selected", () => {

     //Enter applicant's age
     cy.get('input[name="age"]').type("10");

     //Select applicants TB Status'
     cy.get('input[name="tbSymptoms"]').check("no");
   
     //Select applicant's symptons
     cy.get('input[name="tbSymptomsList"]').check("other-symptoms");

     //Enter 'Other symptons'
     cy.get('#other-symptoms-detail').type("chest pains, headache and fatigue");

     //Select an option if applicant is a child under 11
     cy.get('input[name="underElevenConditions"]').check("cyanosis");

     //Select Applicant's previous TB status
     cy.get('input[name="previousTb"]').check("no");

     //Select if applicant has had close contact with a person with Pulmonary TB in the past year
     cy.get('input[name="closeContactWithTb"]').check("no");

     //Indicate if applicant is pregnant
     cy.get('input[name="pregnant"]').check("yes");

     //Select if applicant have menstrual periods
     cy.get('input[name="menstrualPeriods"]').check("yes");

     //Enter applicant physical examination notes
     cy.get('#physical-exam-notes').type("Applicant appears fit");


    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate that the page navigates to the confirmation page 
    cy.url().should('include', 'http://localhost:3000/medical-confirmation');
    });
    });