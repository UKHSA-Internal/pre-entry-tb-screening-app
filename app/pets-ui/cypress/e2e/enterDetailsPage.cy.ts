const fieldNames = [

        'Full Name',
        'Passport Number',
        'Country of Nationality',
        'Country of Issue',
        'Issue Date',
        'Expiry Date',
        'Date of Birth',
        "Applicant's Sex",
        "Applicant's Visa Type",
        'Address line 1',
        'Address line 2',
        'Address line 3',
        'Town/City',
        'Province/State',
        'Country',
        'Postcode'
]

describe ('Enter Applicant Details Page contains all the necessary fields', () => {
// Check whether the 'Full Name' and 'Passport Number' fields are visible on Enter applicant details page. 
    it('should display mandatory fields with correct properties', () => { 
// Visit the "enter details" page 
        cy.visit('http://localhost:3000/applicant/enter-details'); 

// Check that the 'Full Name' field is visible
        fieldNames.forEach(label => {
                cy.contains('label, legend, h1', label).should('be.visible'); 
        })       
        
});      
});