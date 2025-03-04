/* Scenario:
GIVEN I am on the "Radiological Outcome" page
THEN I see the above data fields and their corresponding properties.

GIVEN I have entered all mandatory data 
WHEN I click the Continue button
THEN I am navigated to the Summary page

GIVEN I have NOT entered all mandatory data
WHEN I click the Continue button
THEN I am shown the relevant error message. */

describe("Validate data fields on x-ray results page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/chest-xray-findings");
    cy.intercept("POST", "http://localhost:3004/dev/register-applicant", {
      statusCode: 200,
      body: { success: true, message: "Data successfully posted" },
    }).as("formSubmit");
  });

  it("Should display all required fields and components", () => {
    // Validate Banner and page headings
    cy.get(".govuk-notification-banner__title").contains("Important").should("be.visible");
    cy.get(".govuk-notification-banner__content").should("be.visible");
    cy.get("h1").contains("Enter X-ray results and findings").should("be.visible");

    // Validate Summary list fields
    const summaryFields = ["Name", "Date of Birth", "Passport Number"];
    summaryFields.forEach((field) => {
      cy.contains(".govuk-summary-list__key", field)
        .should("be.visible")
        .siblings(".govuk-summary-list__value")
        .should("be.visible");
    });

    // Validate X-ray results radio options
    const radioOptions = ["Chest X-ray normal", "Non-TB abnormality", "Old or active TB"];
    radioOptions.forEach((option, index) => {
      cy.get('[data-testid="xray-result"]')
        .eq(index)
        .should("have.value", option)
        .siblings(".govuk-radios__label")
        .should("contain", option)
        .should("be.visible");
    });

    // Validate Section headings
    cy.get("h2.govuk-heading-l").contains("X-ray findings").should("be.visible");
    cy.get("h3.govuk-heading-m").contains("Minor findings").should("be.visible");
    cy.get("h3.govuk-heading-m")
      .contains("Minor findings (occasionally associated with TB infection)")
      .should("be.visible");
    cy.get("h3.govuk-heading-m")
      .contains("Findings sometimes seen in active TB (or other conditions)")
      .should("be.visible");

    // Validate all checkbox sections
    validateCheckboxSection("xray-minor-findings", [
      "1.1 Single fibrous streak or band or scar",
      "1.2 Bony islets",
      "2.1 Pleural capping with a smooth inferior border (less than 1cm thick at all points)",
      "2.2 Unilateral or bilateral costophrenic angle blunding (below the horizontal)",
      "2.3 Calcified nodule(s) in the hilum or mediastinum with no pulmonary granulomas",
    ]);

    validateCheckboxSection("xray-associated-minor-findings", [
      "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
      "3.2 Solitary granuloma (less than 1cm and of any lobe) with calcified or enlarged hilar lymph nodes",
      "3.3 Single or multiple calcified pulmonary nodules or micronodulese with distinct borders",
      "3.4 Calcified pleural lesion",
      "3.5 Costophrenic angle blunting (either side above the horizontal)",
    ]);

    validateCheckboxSection("xray-active-tb-findings", [
      "4.0 Notable apical pleural capping (rough or ragged inferior border an/or equal or greater than 1cm thick at any point)",
      "4.1 Apical fibronodular or fibrocalcific lesions or apical microcalcifications",
      "4.2 Single or multiple pulmonary nodules or micronodules (noncalcified or poorly defined)",
      "4.3 Isolated hilar or mediastinal mass or lymphadenopathy (noncalcified)",
      "4.4 Single or multiple pulmonary nodules / masses equal or greater than 1cm",
      "4.5 Non calcified pleural fibrosis or effusion",
      "4.6 Interstitial fibrosis or parenchymal lung disease and or acute pulmonary disease",
      "4.7 Any cavitating lesion or 'fluffy' or 'soft' lesions felt likely to represent active TB",
    ]);
  });

  //Validate checkbox sections
  function validateCheckboxSection(sectionId: string, options: string[]): void {
    cy.get(`#${sectionId}`).within(() => {
      cy.get(`[data-testid="${sectionId}"]`).should("have.length", options.length);

      // Get all checkboxes and verify the count matches expected options
      cy.get(".govuk-checkboxes__item").should("have.length", options.length);

      // Verify each input has the right value
      cy.get(".govuk-checkboxes__input").each(($input, index) => {
        cy.wrap($input).should("exist").should("have.value", options[index]);
      });
    });
  }
});
