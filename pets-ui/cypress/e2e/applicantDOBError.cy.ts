import { countryList } from '../../src/utils/helpers';

// Random number generator
const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const countryNames = countryList.map(country => country.value)
const visaType = [
    'Family Reunion','Settlement and Dependents', 'Students', 'Work', 'Working Holiday Maker','Government Sponsored'
];

//Scenario; Test to check error message is displayed when a mandatory field (DOB) is empty

describe ('Validate the errors for Date of Birth Field', () => {

 

  beforeEach(() => {
  
  cy.visit('http://localhost:3000');
  cy.intercept('POST', 'http://localhost:3004/dev/register-applicant', {
    statusCode: 200,
    body: {success: true, message: 'Data successfully posted'}
}).as('formSubmit');
});

it('Should return errors for Date of Birth field', () => { 

  //Enter valid data for 'Full name'
  cy.get('input[name="fullName"]').type('John Doe');
  

  //Select a 'Sex'
  cy.get('input[name="sex"]').check('male');

  //Randomly select a 'Country of Nationality'
  cy.get('#country-of-nationality.govuk-select').select('ATA');

  //Omit data for 'date of birth'
  /*cy.get('input#birth-date-day').type();
  cy.get('input#birth-date-month').type();
  cy.get('input#birth-date-year').type();*/


  //Enter valid data for 'Applicant's Passport number'
  cy.get('input[name="passportNumber"]').type('AA1235467');


  //Select a 'Country of Issue'
  cy.get('#country-of-issue.govuk-select').select('ATA');

  //Enter valid data for 'Issue Date'
  cy.get('input#passport-issue-date-day').type('20');
  cy.get('input#passport-issue-date-month').type('11');
  cy.get('input#passport-issue-date-year').type('2011');


  //Enter valid data for 'Expiry Date'
  cy.get('input#passport-expiry-date-day').type('19');
  cy.get('input#passport-expiry-date-month').type('11');
  cy.get('input#passport-expiry-date-year').type('2031');


  //Enter valid address information
  cy.get('#address-1').type('1322');
  cy.get('#address-2').type('100th St');
  cy.get('#address-3').type('Apt 16');
  cy.get('#town-or-city').type('North Battleford');
  cy.get('#province-or-state').type('Saskatchewan');
  cy.get('#address-country.govuk-select').select('CAN');
  cy.get('#postcode').type('S4R 0M6');


  // Click the submit button 
  cy.get('button[type="submit"]').click();
  
  //Confirm error message is displayed
  cy.get('.govuk-error-summary__title').should('have.text', 'There is a problem');

  //Validate error message is present

  cy.contains('Date of birth must include a day, month and year.').should('exist');
  

});
});