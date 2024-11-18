import { countryList } from '../../utils/country-list';

// Random number generator
const randomElement = <T> (arr: T[]) : T => arr[Math.floor(Math.random() * arr.length)];
const randomCountry = randomElement(countryList);
const countryName = randomCountry?.value;
const visaType = [
    'Family Reunion','Settlement and Dependents', 'Students', 'Work', 'Working Holiday Maker','Government Sponsored'
];
describe ('Validate the error messages for the Free Text Boxes', () => {

it.skip('Should change error messages when incorrect format is used', () => { 
    
    cy.visit('http://localhost:3000/applicant/enter-details');    

    // Enter INVALID data for 'Full name'
    cy.get('input[name="name"]').type('J@hn Doe'); 

    // Enter INVALID data for 'Passport number'
    cy.get('input[name="passport-number"]').type('AB1234567!');

    // Randomly Select 'Country of Nationality & Issue' 
    cy.get('#country-of-nationality.govuk-select').select(countryName);
    cy.get('#country-of-issue.govuk-select').select(countryName);

    // Enter valid data for the Issue Date
    cy.get('input[name="passport-issue-date-day"]').type('10');
    cy.get('input[name="passport-issue-date-month"]').type('12');
    cy.get('input[name="passport-issue-date-year"]').type('2016');

    // Enter valid data for the Expiry date 
    cy.get('input[name="passport-expiry-date-day"]').type('16');
    cy.get('input[name="passport-expiry-date-month"]').type('APR');
    cy.get('input[name="passport-expiry-date-year"]').type('2027');

    // Enter valid data for the Date of Birth
    cy.get('input[name="birth-date-day"]').type('4');
    cy.get('input[name="birth-date-month"]').type('JULY');
    cy.get('input[name="birth-date-year"]').type('1998');

    // Randomly select a Sex
    cy.get('input[name="applicants-sex"]').check(randomElement(['male', 'female']));

    // Randomly select Visa Type
    cy.get('#visa-type.govuk-select').select(randomElement(visaType));

    // Fill out INVALID Address Information
    cy.get('input[name="address-1"]').type('123 @ Main St');
    cy.get('input[name="address-2"]').type('Apt 4B!!');
    cy.get('input[name="address-3"]').type('West_Lane');
    cy.get('input[name="town-or-city"]').type('22 Springfield');
    cy.get('input[name="province-or-state"]').type('IL67');
    cy.get('#address-country.govuk-select').select(countryName);

    // Validate the error messages above each text box are correct
    const errorMessages = [
        "Full name must contain only letters and spaces.",
        "Passport number must contain only letters and numbers.",
        "Home address must contain only letters, numbers, spaces and punctuation.",
        "Home address must contain only letters, numbers, spaces and punctuation.",
        "Home address must contain only letters, numbers, spaces and punctuation.",
        "Town name must contain only letters, spaces and punctuation.",
        "Province/state name must contain only letters, spaces and punctuation",
        "Postcode must contain only letters, numbers and spaces."
    ]
    // Validate the summary box appears at the top contains the correct error messages
    cy.get('[data-module="govuk-error-summary"]').should('be.visible');
    errorMessages.forEach(error => {
            cy.get('.govuk-error-summary').should('contain.text', error);
        });

    // Validate that user is navigated to correct error when clicking message in summary
    const urlFragment = [
        '#name', 
        '#passport-number', 
        '#address-1', 
        '#address-2', 
        '#address-3', 
        '#town-or-city', 
        '#province-or-state', 
        '#postcode']
   
    cy.get('.govuk-error-summary a').each(($link, index) => {
        cy.wrap($link).click();
        cy.url().should('include', urlFragment[index]);

});
});
});

