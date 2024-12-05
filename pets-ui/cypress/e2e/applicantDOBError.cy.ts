import { countryList } from '../../src/utils/helpers';

// Random number generator
const randomElement = <T> (arr: T[]) : T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
 
//Scenario; Test to check error message is displayed when a mandatory field (DOB) is empty

describe ('Validate the errors for Date of Birth Field', () => {

 

  beforeEach(() => {
  
  cy.visit('http://localhost:3000');
  cy.intercept('POST', 'http://localhost:3004/dev/register-applicant', {
    statusCode: 200,
    body: {success: true, message: 'Data successfully posted'}
}).as('formSubmit');
});

it('Should return errors for empty Data for Date of Birth field', () => { 

  //Enter valid data for 'Full name'
  cy.get('input[name="fullName"]').type('John Doe');
  

  //Select a 'Sex'
  cy.get('input[name="sex"]').check('male');

 // Randomly Select 'Country of Nationality & Issue' 
 cy.get('#country-of-nationality.govuk-select').select(countryName);
 cy.get('#country-of-issue.govuk-select').select(countryName);

  //Omit data for 'date of birth'
  cy.get('input#birth-date-day').should('have.value','');
  cy.get('input#birth-date-month').should('have.value','');
  cy.get('input#birth-date-year').should('have.value','');


  //Enter valid data for 'Applicant's Passport number'
  cy.get('input[name="passportNumber"]').type('AA1235467');



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