// travelConfirmationPage.ts
export class TravelConfirmationPage {
  // Navigation
  visit(): void {
    cy.visit("http://localhost:3000/travel-confirmation");
  }

  // Verify page loaded
  verifyPageLoaded(): void {
    cy.url().should("include", "/travel-confirmation");
    cy.get("h1").should("have.text", "Travel Information record created");
  }

  // Submit Form to continue to medical screening
  submitForm(): void {
    cy.get('button[type="submit"]').should("be.visible").click();
  }

  // Verify redirection to medical screening page
  verifyRedirectionToMedicalScreening(): void {
    cy.url().should("include", "http://localhost:3000/medical-screening");
  }
}
