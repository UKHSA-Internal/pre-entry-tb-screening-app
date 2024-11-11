import { countryList } from '../../utils/country-list';

// Random number generator
const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const countryNames = countryList.map(country => country.label)
const visaType = [
    'Family Reunion','Settlement and Dependents', 'Students', 'Work', 'Working Holiday Maker','Government Sponsored'
];

beforeEach (() => {
    cy.visit('http://localhost:3000/applicant/enter-details');   
});
describe ('Validate the error messages for the Date fields', () => {

    it('Fill out the application date fields with invalid characters', () => { 

        // Enter valid data for 'Full name'
        cy.get('input[name="name"]').type('John Doe'); 

        // Enter valid data for 'Passport number'
        cy.get('input[name="passport-number"]').type('AB1234567');

        // Randomly Select 'Country of Nationality & Issue' 
        cy.get('#country-of-nationality.govuk-select').select(randomElement(countryNames));
        cy.get('#country-of-issue.govuk-select').select(randomElement(countryNames));

        // Enter Invalid data for the Issue Date
        cy.get('input[name="passport-issue-date-day"]').type('!');
        cy.get('input[name="passport-issue-date-month"]').type('@');
        cy.get('input[name="passport-issue-date-year"]').type('20!6');

        // Enter Invalid data for the Expiry date 
        cy.get('input[name="passport-expiry-date-day"]').type('=');
        cy.get('input[name="passport-expiry-date-month"]').type('A');
        cy.get('input[name="passport-expiry-date-year"]').type('2@27');

        // Enter Invalid data for the Date of Birth
        cy.get('input[name="birth-date-day"]').type('£');
        cy.get('input[name="birth-date-month"]').type('123');
        cy.get('input[name="birth-date-year"]').type('199');

        // Randomly select a Sex
        cy.get('input[name="applicants-sex"]').check(randomElement(['male', 'female']));

        // Randomly select Visa Type
        cy.get('#visa-type.govuk-select').select(randomElement(visaType));

        // Fill out Address Information
        cy.get('input[name="address-1"]').type('123 Main St');
        cy.get('input[name="address-2"]').type('Apt 4B');
        cy.get('input[name="address-3"]').type('West Lane');
        cy.get('input[name="town-or-city"]').type('Springfield');
        cy.get('input[name="province-or-state"]').type('IL');
        cy.get('#address-country.govuk-select').select(randomElement(countryNames));
        cy.get('input[name="postcode"]').type('62701');


    cy.get('button[type="submit"]').click(); 

    // Validate the error messages above each text box are correct
    const errorMessages = [
        "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
        "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
        "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
    ]

    // Validate the summary box appears at the top contains the correct error messages
    cy.get('[data-module="govuk-error-summary"]').should('be.visible');
    errorMessages.forEach(error => {
            cy.get('.govuk-error-summary').should('contain.text', error);
        });

    // Validate that user is navigated to correct error when clicking message in summary
    const urlFragment = [
        '#passport-issue-date',
        '#passport-expiry-date',
        '#birth-date'
    ]
   
    cy.get('.govuk-error-summary a').each(($link, index) => {
        cy.wrap($link).click();
        cy.url().should('include', urlFragment[index]);

});
});
});

it('Fill out the application date with Invalid Dates ', () => { 

    // Enter valid data for 'Full name'
    cy.get('input[name="name"]').type('John Doe'); 

    // Enter valid data for 'Passport number'
    cy.get('input[name="passport-number"]').type('AB1234567');

     // Randomly Select 'Country of Nationality & Issue' 
     cy.get('#country-of-nationality.govuk-select').select(randomElement(countryNames));
     cy.get('#country-of-issue.govuk-select').select(randomElement(countryNames));

     // Enter Invalid data for the Issue Date
     cy.get('input[name="passport-issue-date-day"]').type('12');
     cy.get('input[name="passport-issue-date-month"]').type('13');
     cy.get('input[name="passport-issue-date-year"]').type('2000');

     // Enter Invalid data for the Expiry date 
     cy.get('input[name="passport-expiry-date-day"]').type('36');
     cy.get('input[name="passport-expiry-date-month"]').type('APR');
     cy.get('input[name="passport-expiry-date-year"]').type('2029');

     // Enter Invalid data for the Date of Birth
     cy.get('input[name="birth-date-day"]').type('3');
     cy.get('input[name="birth-date-month"]').type('AUGUST');
     cy.get('input[name="birth-date-year"]').type('20100');

     // Randomly select a Sex
     cy.get('input[name="applicants-sex"]').check(randomElement(['male', 'female']));

     // Randomly select Visa Type
     cy.get('#visa-type.govuk-select').select(randomElement(visaType));

     // Fill out Address Information
     cy.get('input[name="address-1"]').type('123 Main St');
     cy.get('input[name="address-2"]').type('Apt 4B');
     cy.get('input[name="address-3"]').type('West Lane');
     cy.get('input[name="town-or-city"]').type('Springfield');
     cy.get('input[name="province-or-state"]').type('IL');
     cy.get('#address-country.govuk-select').select(randomElement(countryNames));
     cy.get('input[name="postcode"]').type('62701');

cy.get('button[type="submit"]').click(); 

// Validate the error messages above each text box are correct
const errorMessages = [
    "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
    "Passport expiry date must be a valid date.",
    "Date of birth date must be a valid date."
]

// Validate the summary box appears at the top contains the correct error messages
cy.get('[data-module="govuk-error-summary"]').should('be.visible');
errorMessages.forEach(error => {
        cy.get('.govuk-error-summary').should('contain.text', error);
    });

// Validate that user is navigated to correct error when clicking message in summary
const urlFragment = [
    '#passport-issue-date',
        '#passport-expiry-date',
        '#birth-date'
    ]

cy.get('.govuk-error-summary a').each(($link, index) => {
    cy.wrap($link).click();
    cy.url().should('include', urlFragment[index]);

});
});

