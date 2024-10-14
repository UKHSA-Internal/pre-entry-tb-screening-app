describe ('Enter Applicant Details Page'), () => {
// Check whether the 'Full Name' and 'Passport Number' fields are visible on Enter applicant details page. 
    it('should display mandatory fields with correct properties', () => { 
// Visit the "enter details" page 
        cy.visit('http://localhost:3000/applicant/enter-details'); 

// Check that the 'Full Name' field is mandatory, and accepts alphanumeric characters 
        cy.get('Full name').should('be.visible')
             .should('have.attr', 'required') 
             .should('have.attr', 'type', 'text'); 

// Check that the 'Passport Number' field is mandatory, and accepts alphanumeric characters
       cy.get('Passport number').should('be.visible') 
            .should('have.attr', 'required')
            .should('have.attr', 'type', 'text'); 

// Check the user is navigated to the confirmation page after submission
    it('should navigate to confirmation page after valid data submission', () => { 
    // Visit the "enter details" page 
        cy.visit('http://localhost:3000/applicant/enter-details'); 

        // Enter valid data into the 'Full Name' field 
        cy.get('Full name').type('John Doe'); 
        // Enter valid data into the 'Passport Number' field 
        cy.get('Passport number').type('AB1234567'); 
        // Click the submit button 
        cy.get('Submit').click(); 
        // Validate that the page navigates to the confirmation page 
        cy.url().should('include', 'http://localhost:3000/applicant/check-answers'); 
        
}); });
    
}