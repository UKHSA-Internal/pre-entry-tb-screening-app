//Scenario; Test Submission with valid data for all fields (Happy Path Testing)

describe.skip("Error messages displayed where country of nationality and issue is missing", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/contact");
  });

  it.skip("Should display above each missing field", () => {
    //Enter valid data for 'Full name'
    cy.get('input[name="fullName"]').type("John Doe");

    //Select a 'Sex'
    cy.get('input[name="sex"]').check("Male");

    //Enter VALID data for 'date of birth'
    cy.get("input#birth-date-day").type("4");
    cy.get("input#birth-date-month").type("JAN");
    cy.get("input#birth-date-year").type("1998");

    //Enter VALID data for 'Applicant's Passport number'
    cy.get('input[name="passportNumber"]').type("AA1235467");

    //Enter VALID data for 'Issue Date'
    cy.get("input#passport-issue-date-day").type("20");
    cy.get("input#passport-issue-date-month").type("11");
    cy.get("input#passport-issue-date-year").type("2011");

    //Enter VALID data for 'Expiry Date'
    cy.get("input#passport-expiry-date-day").type("19");
    cy.get("input#passport-expiry-date-month").type("11");
    cy.get("input#passport-expiry-date-year").type("2031");

    //Enter VALID address information
    cy.get("#address-1").type("1322");
    cy.get("#address-2").type("100th St");
    cy.get("#address-3").type("Apt 16");
    cy.get("#town-or-city").type("North Battleford");
    cy.get("#province-or-state").type("Saskatchewan");
    cy.get("#address-country.govuk-select").select("CAN");
    cy.get("#postcode").type("S4R 0M6");

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Validate the error messages above each text box are correct
    const errorMessages = ["Select the country of nationality.", "Select the country of issue."];
    // Validate the summary box appears at the top contains the correct error messages
    cy.get(".govuk-error-summary").should("be.visible");
    errorMessages.forEach((error) => {
      cy.get(".govuk-error-summary").should("contain.text", error);
    });
  });
});
