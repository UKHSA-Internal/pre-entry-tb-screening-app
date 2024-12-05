import { countryList } from '../../src/utils/helpers';

// Random number generator
const randomElement = <T> (arr: T[]) : T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;

describe ('Validate the error messages for the Free Text Boxes', () => {

it('Should change error messages when incorrect format is used', () => { 
    
    cy.visit('http://localhost:3000');    

    // Enter valid data for 'Full name'
  cy.get('input[name="fullName"]').type('J)hn D*e'); 

  //Select a 'Sex'
  cy.get('input[name="sex"]').check('male');

  //Enter VALID data for 'date of birth'
  cy.get('input#birth-date-day').type('4');
  cy.get('input#birth-date-month').type('JAN');
  cy.get('input#birth-date-year').type('1998');


  //Enter INVALID data for 'Applicant's Passport number'
  cy.get('input[name="passportNumber"]').type('AA123546+7');

   
    // Randomly Select 'Country of Nationality & Issue' 
    cy.get('#country-of-nationality.govuk-select').select(countryName);
    cy.get('#country-of-issue.govuk-select').select(countryName);

   //Enter VALID data for 'Issue Date'
  cy.get('input#passport-issue-date-day').type('20');
  cy.get('input#passport-issue-date-month').type('11');
  cy.get('input#passport-issue-date-year').type('2031');

    //Enter VALID data for 'Expiry Date'
  cy.get('input#passport-expiry-date-day').type('19');
  cy.get('input#passport-expiry-date-month').type('11');
 cy.get('input#passport-expiry-date-year').type('2011');

   
    // Enter INVALID Address Information
    cy.get('#address-1').type('123 @ Main St');
    cy.get('#address-2').type('Apt 4B!!');
    cy.get('#address-3').type('West_Lane');
    cy.get('#town-or-city').type('22 Springfield');
    cy.get('#province-or-state').type('IL67');
    cy.get('#address-country.govuk-select').select(countryName);
    cy.get('#postcode').type('S4R 0M6');



    // Click the submit button 
  cy.get('button[type="submit"]').click();

    // Validate the error messages above each text box are correct
    const errorMessages = [
      "Full name must contain only letters and spaces.",
      "Passport number must contain only letters and numbers.",
      "Home address must contain only letters, numbers, spaces and punctuation.",
      "Home address must contain only letters, numbers, spaces and punctuation.",
      "Home address must contain only letters, numbers, spaces and punctuation.",
      "Town name must contain only letters, spaces and punctuation.",
      "Province/state name must contain only letters, spaces and punctuation",
        
    ]
    // Validate the summary box appears at the top contains the correct error messages
    cy.get('.govuk-error-summary').should('be.visible');
    errorMessages.forEach(error => {
            cy.get('.govuk-error-summary').should('contain.text', error);
        });

});
});

