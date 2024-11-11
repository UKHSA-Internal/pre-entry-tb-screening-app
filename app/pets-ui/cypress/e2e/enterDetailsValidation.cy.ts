describe ('Validate the error messages for mandatory fields', () => {
    it('Should prompt user to fill out mandatory text fields', () => { 
       
        cy.visit('http://localhost:3000/applicant/enter-details'); 
   
        // Submit empty application form
    cy.get('button[type="submit"]').click(); 
    
    // Validate that error messages appear on screen and display correct text
    const errorMessages = [
        "Enter the applicant's full name",
        "Enter the applicant's passport number",
        "Select the applicant's country of nationality.",
        "Select the passport country of issue.",
        "Passport issue date must include a day, month and year.",
        "Passport expiry date must include a day, month and year.",
        "Date of birth must include a day, month and year.",
        "Select the applicant's sex.",
        "Select the applicant's visa type.",
        "Enter the first line of the applicant's home address.",
        "Enter the town or city of the applicant's home address.",
        "Enter the province or state of the applicant's home address.",
        "Select the country of the applicant's home address."
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
    const urlFragment = ['#name', 
        '#passport-number', 
        '#country-of-nationality',
        '#country-of-issue',
        '#passport-issue-date',
        '#passport-expiry-date',
        '#birth-date',
        '#applicants-sex',
        '#visa-type',
        '#address-1', 
        '#town-or-city', 
        '#province-or-state',
        '#address-country'
    ]
   
    cy.get('.govuk-error-summary a').each(($link, index) => {
        cy.wrap($link).click();
        cy.url().should('include', urlFragment[index]);
    });
}); 
});
