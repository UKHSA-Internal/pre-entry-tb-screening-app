// This holds all fields for the TB Progress Tracker Page

// Type safety for task statuses
type TaskStatus = "Not yet started" | "Completed" | "Not required" | "Incomplete" | "In progress";

export class TBProgressTrackerPage {
  visit(): void {
    cy.visit("/tracker");
  }

  verifyPageLoaded(): void {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "TB screening progress tracker");

    // Check summary list is present
    cy.get(".govuk-summary-list").should("be.visible");
  }

  // Verify applicant information
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
  }

  // Verify applicant photo is displayed
  verifyApplicantPhotoDisplayed(): void {
    // Check the photo container exists
    cy.get('div[style*="border: 1px solid"]')
      .should("be.visible")
      .within(() => {
        // Check the image element
        cy.get('img[alt="Applicant"]')
          .should("be.visible")
          .and("have.attr", "src")
          .and("not.be.empty");
      });
  }

  // Verify photo has expected attributes
  verifyApplicantPhotoAttributes(expectedTitle?: string): void {
    if (expectedTitle) {
      cy.get('img[alt="Applicant"]').should("have.attr", "title", expectedTitle);
    } else {
      cy.get('img[alt="Applicant"]').should("have.attr", "title").and("not.be.empty");
    }
  }

  // Get summary value for a specific field
  getSummaryValue(fieldKey: string): Cypress.Chainable<string> {
    return cy
      .contains("dt.govuk-summary-list__key", fieldKey)
      .siblings(".govuk-summary-list__value")
      .invoke("text");
  }

  // Verify specific summary value
  verifySummaryValue(fieldKey: string, expectedValue: string): void {
    this.getSummaryValue(fieldKey).should("eq", expectedValue);
  }

  // Verify the complete all sections text
  verifyCompleteAllSectionsText(): void {
    cy.get("p.govuk-body").contains("Complete all sections.").should("be.visible");
  }

  // Get task element by name
  getTaskElement(taskName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    // Check if the task exists anywhere in the task list first
    return cy
      .get(".govuk-task-list__item")
      .contains(taskName)
      .then(($el) => {
        // Now check if it's within a link or just plain text
        const $link = $el.closest(".govuk-task-list__item").find(".govuk-task-list__link");
        if ($link.length > 0 && $link.text().includes(taskName)) {
          return cy.wrap($link);
        } else {
          // Return the name-and-hint container for non-link tasks
          return cy.wrap($el.closest(".govuk-task-list__name-and-hint"));
        }
      });
  }

  // Get task status
  getTaskStatus(taskName: string): Cypress.Chainable<string> {
    return this.getTaskElement(taskName)
      .closest(".govuk-task-list__item")
      .find(".govuk-task-list__status strong")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify task status
  verifyTaskStatus(taskName: string, expectedStatus: string): void {
    this.getTaskStatus(taskName).should("eq", expectedStatus);
  }

  // Verify task status with type safety
  verifyTaskHasStatus(taskName: string, expectedStatus: TaskStatus): void {
    this.verifyTaskStatus(taskName, expectedStatus);
  }

  // Click on specific task link (only works for tasks that have links)
  clickTaskLink(taskName: string): void {
    cy.contains(".govuk-task-list__link", taskName).click();
  }

  // Verify task exists (whether it's a link or not)
  verifyTaskExists(taskName: string): void {
    this.getTaskElement(taskName).should("exist");
  }

  // Verify all expected tasks exist
  verifyAllTasksExist(): void {
    const expectedTasks = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Radiological outcome",
      "Sputum collection and results",
      "TB certificate declaration",
    ];

    expectedTasks.forEach((task) => {
      this.verifyTaskExists(task);
    });
  }

  // Verify task links exist (for tasks that should be clickable)
  verifyTaskLinksExist(): void {
    const expectedTaskLinks = ["Visa applicant details", "Travel information"];

    expectedTaskLinks.forEach((task) => {
      cy.contains(".govuk-task-list__link", task).should("be.visible").and("have.attr", "href");
    });
  }

  // Click search again button
  clickSearchAgainButton(): void {
    cy.contains("button", "Search again").click();
  }

  // For backward compatibility
  clickSearchAgain(): void {
    this.clickSearchAgainButton();
  }

  // Verify service name in header
  verifyServiceName(): void {
    cy.get(".govuk-header__service-name")
      .should("be.visible")
      .and("contain", "Complete UK Pre-Entry Health Screening");
  }

  // Check URL
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }

  // Check URL after clicking search again button
  checkRedirectionAfterSearchAgain(expectedUrlPath: string): void {
    this.clickSearchAgainButton();
    cy.url().should("include", expectedUrlPath);
  }

  // Verify visa applicant details task is completed
  verifyVisaApplicantDetailsCompleted(): void {
    this.verifyTaskStatus("Visa applicant details", "Completed");
  }

  // Verify all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
  }): void {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyApplicantPhotoDisplayed();
    this.verifyCompleteAllSectionsText();
    this.verifyAllTasksExist();
    this.verifyServiceName();
  }

  // Verify all task statuses
  verifyAllTaskStatuses(expectedStatuses: {
    "Visa applicant details"?: string;
    "Travel information"?: string;
    "Medical history and TB symptoms"?: string;
    "Radiological outcome"?: string;
    "Sputum collection and results"?: string;
    "TB certificate declaration"?: string;
  }): void {
    Object.entries(expectedStatuses).forEach(([taskName, status]) => {
      if (status !== undefined) {
        this.verifyTaskStatus(taskName, status);
      }
    });
  }

  // Verify task is a clickable link
  verifyTaskIsClickable(taskName: string): void {
    cy.get(".govuk-task-list__item")
      .contains(".govuk-task-list__link", taskName)
      .should("exist")
      .and("have.attr", "href");
  }

  // Verify task is NOT a clickable link (plain text)
  verifyTaskIsNotClickable(taskName: string): void {
    // First verify the task exists
    this.verifyTaskExists(taskName);

    // Then verify it's not within a link element
    cy.get(".govuk-task-list__item")
      .contains(taskName)
      .closest(".govuk-task-list__name-and-hint")
      .within(() => {
        cy.get("a").should("not.exist");
        cy.get("p.govuk-body").should("exist");
      });
  }

  // Verify which tasks are clickable and which are not based on business requirements
  verifyTaskClickability(): void {
    // These should be clickable links when accessible
    const clickableTasks = ["Visa applicant details", "Travel information"];

    // These should NOT be clickable until prerequisites are met
    const nonClickableTasks = [
      "Medical history and TB symptoms", // Not accessible until prerequisites completed
      "Radiological outcome", // Not accessible until prerequisites completed
      "Sputum collection and results", // Not accessible until prerequisites completed
      "TB certificate declaration", // Not accessible until ALL other tasks are completed
    ];

    clickableTasks.forEach((task) => {
      this.verifyTaskIsClickable(task);
    });

    nonClickableTasks.forEach((task) => {
      this.verifyTaskIsNotClickable(task);
    });
  }

  //Verify task actionability based on status and business rules
  verifyTaskActionabilityByStatus(taskName: string, status: TaskStatus): void {
    // Special case for TB certificate declaration - should not be clickable until all other tasks are completed
    if (taskName === "TB certificate declaration") {
      this.verifyTaskIsNotClickable(taskName);
      return;
    }

    // For other tasks, generally actionable when they are:
    // - "Not yet started" (if prerequisites are met)
    // - "Incomplete"
    // - "In progress"
    const actionableStatuses: TaskStatus[] = ["Not yet started", "Incomplete", "In progress"];
    const shouldBeActionable = actionableStatuses.includes(status);

    if (shouldBeActionable) {
      // Additional check for tasks that require prerequisites
      const tasksWithPrerequisites = [
        "Medical history and TB symptoms",
        "Radiological outcome",
        "Sputum collection and results",
      ];

      if (tasksWithPrerequisites.includes(taskName)) {
        // These tasks should not be clickable even if status suggests they should be
        this.verifyTaskIsNotClickable(taskName);
      } else {
        this.verifyTaskIsClickable(taskName);
      }
    } else if (status === "Not required") {
      // "Not required" tasks should definitely not be clickable
      this.verifyTaskIsNotClickable(taskName);
    }
  }

  // Get all task statuses at once (useful for debugging)
  getAllTaskStatuses(): Cypress.Chainable<Record<string, string>> {
    const taskNames = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Radiological outcome",
      "Sputum collection and results",
      "TB certificate declaration",
    ];

    return cy.wrap({}).then(() => {
      const statuses: Record<string, string> = {};

      taskNames.forEach((taskName) => {
        this.getTaskStatus(taskName).then((status) => {
          statuses[taskName] = status;
        });
      });

      return cy.wrap(statuses);
    });
  }

  //Verify TB certificate declaration is not accessible when prerequisites are incomplete
  verifyTBCertificateDeclarationNotAccessible(): void {
    // Verify the task exists but is not clickable
    this.verifyTaskExists("TB certificate declaration");
    this.verifyTaskIsNotClickable("TB certificate declaration");

    // Verify the status is "Not yet started" (as it shouldn't be accessible)
    this.verifyTaskStatus("TB certificate declaration", "Not yet started");
  }

  //Verify prerequisites for TB certificate declaration
  verifyTBCertificateDeclarationPrerequisites(): void {
    const prerequisiteTasks = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Radiological outcome",
      "Sputum collection and results",
    ];

    prerequisiteTasks.forEach((task) => {
      // All prerequisite tasks should be completed before TB certificate declaration is accessible
      this.getTaskStatus(task).then((status) => {
        if (status !== "Completed" && status !== "Not required") {
          // If any prerequisite is not completed, TB certificate should not be accessible
          this.verifyTBCertificateDeclarationNotAccessible();
        }
      });
    });
  }

  // Verify breadcrumb navigation
  verifyBreadcrumbNavigation(): void {
    cy.get(".govuk-breadcrumbs").should("be.visible");
  }

  // Click breadcrumb link to tracker
  clickBreadcrumbTrackerLink(): void {
    cy.get('.govuk-breadcrumbs__list-item a[href="/tracker"]')
      .contains("Application progress tracker")
      .click();
  }
}
