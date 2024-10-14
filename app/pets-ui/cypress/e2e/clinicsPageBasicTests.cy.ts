describe('clinics page', () => {
    beforeEach(() => {
        cy.intercept('/').as('homePage')
        cy.visit('http://localhost:3000')
        cy.wait('@homePage')
      })

    it('displays header & footer', () => {
        cy.get('header').should('exist')
        cy.get('footer').should('exist')
    })
})