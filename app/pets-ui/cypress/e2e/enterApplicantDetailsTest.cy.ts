import { countryList } from '../../utils/country-list';

// Random number generator
const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const countryNames = countryList.map(country => country.value)
const visaType = [
    'Family Reunion','Settlement and Dependents', 'Students', 'Work', 'Working Holiday Maker','Government Sponsored'
];

describe ('Fill out applicant details form', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/applicant/enter-details'); 
        cy.intercept('POST', 'http://localhost:3004/dev/register-applicant', {
            statusCode: 200,
            body: {success: true, message: 'Data successfully posted'}
        }).as('formSubmit');
    });

    it('Fill out the application from with valid data', () => { 

        // Enter valid data for 'Full name'
        cy.get('input[name="name"]').type('John Doe'); 

        // Enter valid data for 'Passport number'
        cy.get('input[name="passport-number"]').type('AB1234567');

        // Randomly Select 'Country of Nationality & Issue' 
        cy.get('#country-of-nationality.govuk-select').select(randomElement(countryNames));
        cy.get('#country-of-issue.govuk-select').select(randomElement(countryNames));

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

        // Fill out Address Information
        cy.get('input[name="address-1"]').type('123 Main St');
        cy.get('input[name="address-2"]').type('Apt 4B');
        cy.get('input[name="address-3"]').type('West Lane');
        cy.get('input[name="town-or-city"]').type('Springfield');
        cy.get('input[name="province-or-state"]').type('IL');
        cy.get('#address-country.govuk-select').select(randomElement(countryNames));
        cy.get('input[name="postcode"]').type('62701');


        // Click the submit button 
        cy.get('button[type="submit"]').click(); 
        // Wait for POST request to complete
        cy.wait('@formSubmit').its('response.statusCode').should('eq', 200)
        // Validate that the page navigates to the confirmation page 
        cy.url().should('include', 'http://localhost:3000/applicant/confirmation'); 

    });
});