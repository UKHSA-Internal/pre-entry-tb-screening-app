describe ('Validate the error messages for the Free Text Boxes', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/applicant/enter-details');       
    });

    it('Should prompt user to fill out mandatory text fields', () => { 

        // Submit empty application form
        cy.get('button[type="submit"]').click(); 
        
        // Validate that error messages appear on screen and display correct text
        const errorMessages = [
            "Enter the applicant's full name",
            "Enter the applicant's passport number",
            "Enter the first line of the applicant's home address.",
            "Enter the town or city of the applicant's home address.",
            "Enter the province or state of the applicant's home address."
        ];

       errorMessages.forEach(error => {
            cy.get('.govuk-error-message').should('contain.text', error);
        });

        // Validate the summary box appears at the top contains the correct error messages
        cy.get('[data-module="govuk-error-summary"]').should('be.visible');
        errorMessages.forEach(error => {
                cy.get('.govuk-error-summary').should('contain.text', error);
            });

        // Validate that user is navigated to correct error when clicking message in summary
        const urlFragment = ['#name', '#passport-number', '#address-1', '#town-or-city', '#province-or-state']
       
        cy.get('.govuk-error-summary a').each(($link, index) => {
            cy.wrap($link).click();
            cy.url().should('include', urlFragment[index]);
        });
    }); 
});

it('Should change error messages when incorrect format is used', () => { 
    
    cy.visit('http://localhost:3000/applicant/enter-details');    

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

    // Enter valid data for 'Full name'
    cy.get('input[name="name"]').type('J@hn Doe'); 

    // Enter valid data for 'Passport number'
    cy.get('input[name="passport-number"]').type('AB1234567!');

    // Fill out Address Information
    cy.get('input[name="address-1"]').type('123 @ Main St');
    cy.get('input[name="address-2"]').type('Apt 4B!!');
    cy.get('input[name="address-3"]').type('West_Lane');
    cy.get('input[name="town-or-city"]').type('22 Springfield');
    cy.get('input[name="province-or-state"]').type('IL67');
    cy.get('input[name="postcode"]').type('62701 @!');

    cy.get('button[type="submit"]').click(); 

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




