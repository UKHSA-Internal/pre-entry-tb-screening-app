describe ('Enter Applicant Details Page', () => {
// Check whether the 'Full Name' and 'Passport Number' fields are visible on Enter applicant details page. 
    it('should display mandatory fields with correct properties', () => { 
// Visit the "enter details" page 
        cy.visit('http://localhost:3000/applicant/enter-details'); 

// Check that the 'Full Name' field is visible
        cy.contains('label', 'Full Name').should('be.visible'); 

// Check that the 'Passport Number' field is visible
       cy.contains('label', 'Passport Number').should('be.visible');
            
});

// Check the user is navigated to the confirmation page after submission
    it('should navigate to confirmation page after valid data submission', () => { 
    // Visit the "enter details" page 
        cy.visit('http://localhost:3000/applicant/enter-details'); 

        // Check the 'Full Name' field accepts alphanumeric characters and Enter valid data.
        cy.get('input[name="name"]').should('have.attr', 'type', 'text')
        .type('John Doe'); 
        // Check the 'Passport Number'field accepts alphanumeric characters and Enter valid data.
        cy.get('input[name="passport-number"]').should('have.attr', 'type', 'text')
        .type('AB1234567'); 
        // Click the submit button 
        cy.get('button[type="submit"]').click(); 
        // Validate that the page navigates to the confirmation page 
        cy.url().should('include', 'http://localhost:3000/applicant/check-answers'); 
        
});
});