// This holds all fields for the TB Progress Tracker Page
import { BasePage } from "../BasePage";

// Type safety for task statuses
type TaskStatus =
  | "Not yet started"
  | "Completed"
  | "Not required"
  | "In progress"
  | "Certificate not issued"
  | "Certificate issued";

export class TBProgressTrackerPage extends BasePage {
  constructor() {
    super("/tracker");
  }

  // Verify page loaded with correct heading
  verifyPageLoaded(): TBProgressTrackerPage {
    cy.get("h1.govuk-heading-l")
      .should("be.visible")
      .and("contain", "Complete UK pre-entry health screening");

    // Check summary list is present in the header
    cy.get(".progress-tracker-header .govuk-summary-list").should("be.visible");
    return this;
  }

  // Verify applicant information in header section
  verifyApplicantInfo(expectedValues: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
    "TB screening"?: string;
  }): TBProgressTrackerPage {
    Object.entries(expectedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        this.verifySummaryValue(key, value);
      }
    });
    return this;
  }

  // Verify applicant photo is displayed
  verifyApplicantPhotoDisplayed(): TBProgressTrackerPage {
    cy.get(".progress-tracker-photo-container")
      .should("be.visible")
      .within(() => {
        cy.get("img.progress-tracker-photo")
          .should("be.visible")
          .should("have.attr", "src")
          .should("not.be.empty");

        cy.get("img.progress-tracker-photo").should("have.attr", "alt", "Applicant");
      });
    return this;
  }

  // Verify photo has expected attributes
  verifyApplicantPhotoAttributes(expectedTitle?: string): TBProgressTrackerPage {
    if (expectedTitle) {
      cy.get("img.progress-tracker-photo").should("have.attr", "title", expectedTitle);
    } else {
      cy.get("img.progress-tracker-photo").should("have.attr", "title").and("not.be.empty");
    }
    return this;
  }

  // Note: getSummaryValue and verifySummaryValue are inherited from BasePage

  // Get task element by name
  getTaskElement(taskName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .get(".govuk-task-list__item")
      .contains(taskName)
      .then(($el) => {
        const $link = $el.closest(".govuk-task-list__item").find(".govuk-task-list__link");
        if ($link.length > 0 && $link.text().includes(taskName)) {
          return cy.wrap($link);
        } else {
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
  verifyTaskStatus(taskName: string, expectedStatus: string): TBProgressTrackerPage {
    this.getTaskStatus(taskName).should("eq", expectedStatus);
    return this;
  }

  // Verify task status with type safety
  verifyTaskHasStatus(taskName: string, expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus(taskName, expectedStatus);
    return this;
  }

  // Verify TB certificate outcome has "Certificate issued" status
  verifyTBCertificateOutcomeIssued(): TBProgressTrackerPage {
    this.verifyTaskStatus("TB certificate outcome", "Certificate issued");
    return this;
  }

  // Verify TB screening status shows "Certificate issued" in header
  verifyTBScreeningCertificateIssued(): TBProgressTrackerPage {
    this.verifySummaryValue("TB screening", "Certificate issued");
    return this;
  }

  // Verify complete scenario where all tasks are done and certificate is issued
  verifyCompleteScenarioWithCertificateIssued(): TBProgressTrackerPage {
    // Verify all standard tasks are completed
    this.verifyTaskStatus("Visa applicant details", "Completed");
    this.verifyTaskStatus("Travel information", "Completed");
    this.verifyTaskStatus("Medical history and TB symptoms", "Completed");
    this.verifyTaskStatus("Upload chest X-ray images", "Completed");
    this.verifyTaskStatus("Radiological outcome", "Completed");
    this.verifyTaskStatus("Make a sputum decision", "Completed");
    this.verifyTaskStatus("Sputum collection and results", "Completed");

    // Verify TB certificate outcome shows "Certificate issued"
    this.verifyTBCertificateOutcomeIssued();

    // Verify TB screening status in header shows "Certificate issued"
    this.verifyTBScreeningCertificateIssued();
    return this;
  }

  // Verify all tasks are clickable when screening is complete
  verifyAllTasksClickableWhenComplete(): TBProgressTrackerPage {
    const allTasks = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    allTasks.forEach((task) => {
      this.verifyTaskIsClickable(task);
    });
    return this;
  }

  // Click on specific task link (only works for tasks that have links)
  clickTaskLink(taskName: string): TBProgressTrackerPage {
    cy.contains(".govuk-task-list__link", taskName).click();
    return this;
  }

  // Verify task exists (whether it's a link or not)
  verifyTaskExists(taskName: string): TBProgressTrackerPage {
    this.getTaskElement(taskName).should("exist");
    return this;
  }

  //Verify all expected tasks exist
  verifyAllTasksExist(): TBProgressTrackerPage {
    const expectedTasks = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    expectedTasks.forEach((task) => {
      this.verifyTaskExists(task);
    });
    return this;
  }

  // Verify task links exist (for tasks that should be clickable)
  verifyTaskLinksExist(): TBProgressTrackerPage {
    const expectedTaskLinks = ["Visa applicant details", "Travel information"];

    expectedTaskLinks.forEach((task) => {
      cy.contains(".govuk-task-list__link", task).should("be.visible").and("have.attr", "href");
    });
    return this;
  }

  // Click search for another applicant link
  clickSearchForAnotherApplicant(): TBProgressTrackerPage {
    cy.contains(".govuk-link", "Search for another visa applicant").click();
    return this;
  }

  // For backward compatibility
  clickSearchAgain(): TBProgressTrackerPage {
    this.clickSearchForAnotherApplicant();
    return this;
  }

  // Note: verifyServiceName and getCurrentUrl are inherited from BasePage

  //Check URL after clicking search for another applicant
  checkRedirectionAfterSearchAgain(expectedUrlPath: string): TBProgressTrackerPage {
    this.clickSearchForAnotherApplicant();
    cy.url().should("include", expectedUrlPath);
    return this;
  }

  // Verify visa applicant details task is completed
  verifyVisaApplicantDetailsCompleted(): TBProgressTrackerPage {
    this.verifyTaskStatus("Visa applicant details", "Completed");
    return this;
  }

  //Verify all elements on the page
  verifyAllPageElements(applicantInfo: {
    Name?: string;
    "Date of birth"?: string;
    "Passport number"?: string;
    "TB screening"?: string;
  }): TBProgressTrackerPage {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyApplicantPhotoDisplayed();
    this.verifyAllTasksExist();
    this.verifyServiceName();
    return this;
  }

  // Verify all task statuses with correct task names
  verifyAllTaskStatuses(expectedStatuses: {
    "Visa applicant details"?: string;
    "Travel information"?: string;
    "Medical history and TB symptoms"?: string;
    "Upload chest X-ray images"?: string;
    "Radiological outcome"?: string;
    "Make a sputum decision"?: string;
    "Sputum collection and results"?: string;
    "TB certificate outcome"?: string;
  }): TBProgressTrackerPage {
    Object.entries(expectedStatuses).forEach(([taskName, status]) => {
      if (status !== undefined) {
        this.verifyTaskStatus(taskName, status);
      }
    });
    return this;
  }

  // Verify task is a clickable link
  verifyTaskIsClickable(taskName: string): TBProgressTrackerPage {
    cy.get(".govuk-task-list__item")
      .contains(".govuk-task-list__link", taskName)
      .should("exist")
      .and("have.attr", "href");
    return this;
  }

  // Verify task is NOT a clickable link
  verifyTaskIsNotClickable(taskName: string): TBProgressTrackerPage {
    this.verifyTaskExists(taskName);

    cy.get(".govuk-task-list__item")
      .contains(taskName)
      .closest(".govuk-task-list__name-and-hint")
      .within(() => {
        cy.get("a").should("not.exist");
        cy.get("p.govuk-body").should("exist");
      });
    return this;
  }

  // Verify clickable task based on sequential prerequisites
  verifyTaskClickability(): TBProgressTrackerPage {
    // Define the sequential order of tasks
    const taskSequence = [
      "Visa applicant details", // Section 1
      "Travel information",
      "Medical history and TB symptoms", // Section 2
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome", // Section 3
    ];

    // Check each task's clickability based on sequential prerequisites
    taskSequence.forEach((task, index) => {
      this.getTaskStatus(task).then((status) => {
        if (status === "Completed" || status === "Certificate issued") {
          // Completed tasks are always clickable for review
          this.verifyTaskIsClickable(task);
        } else if (status === "In progress") {
          // In progress tasks are always clickable to continue
          this.verifyTaskIsClickable(task);
        } else if (status === "Not yet started") {
          // Check if this task should be accessible based on sequential prerequisites
          if (index === 0) {
            // First task is always accessible
            this.verifyTaskIsClickable(task);
          } else {
            // Check if the previous task is completed
            const previousTask = taskSequence[index - 1];
            this.getTaskStatus(previousTask).then((prevStatus) => {
              if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
                // Previous task completed, this task should be clickable
                this.verifyTaskIsClickable(task);
              } else {
                // Previous task not completed, this task should not be clickable
                this.verifyTaskIsNotClickable(task);
              }
            });
          }
        } else if (status === "Not required") {
          // Not required tasks are not clickable
          this.verifyTaskIsNotClickable(task);
        }
      });
    });
    return this;
  }

  // Verify task actionability based on sequential flow
  verifyTaskActionabilityByStatus(taskName: string, status: TaskStatus): TBProgressTrackerPage {
    // Define the sequential order
    const taskSequence = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    const taskIndex = taskSequence.indexOf(taskName);

    // Completed, certificate issued, and in progress tasks are always clickable
    if (status === "Completed" || status === "In progress" || status === "Certificate issued") {
      this.verifyTaskIsClickable(taskName);
      return this;
    }

    // Not required tasks are never clickable
    if (status === "Not required") {
      this.verifyTaskIsNotClickable(taskName);
      return this;
    }

    // For "Not yet started" tasks, check sequential prerequisites
    if (status === "Not yet started") {
      if (taskIndex === 0) {
        // First task is always accessible
        this.verifyTaskIsClickable(taskName);
      } else if (taskIndex > 0) {
        // Check if previous task is completed
        const previousTask = taskSequence[taskIndex - 1];
        this.getTaskStatus(previousTask).then((prevStatus) => {
          if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
            this.verifyTaskIsClickable(taskName);
          } else {
            this.verifyTaskIsNotClickable(taskName);
          }
        });
      } else {
        // Task not found in sequence, assume not clickable
        this.verifyTaskIsNotClickable(taskName);
      }
    }
    return this;
  }

  // Check if task should be clickable based on sequential prerequisites
  verifyTaskClickabilityByPrerequisites(taskName: string): TBProgressTrackerPage {
    const taskSequence = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    const taskIndex = taskSequence.indexOf(taskName);

    if (taskIndex === 0) {
      // First task is always accessible
      this.verifyTaskIsClickable(taskName);
    } else if (taskIndex > 0) {
      // Check if the immediate previous task is completed
      const previousTask = taskSequence[taskIndex - 1];
      this.getTaskStatus(previousTask).then((prevStatus) => {
        if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
          this.verifyTaskIsClickable(taskName);
        } else {
          this.verifyTaskIsNotClickable(taskName);
        }
      });
    } else {
      // Task not in sequence, not clickable
      this.verifyTaskIsNotClickable(taskName);
    }
    return this;
  }

  // Get all task statuses with correct task names
  getAllTaskStatuses(): Cypress.Chainable<Record<string, string>> {
    const taskNames = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
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

  // TB certificate outcome accessibility based on sequential flow
  verifyTBCertificateOutcomeNotAccessible(): TBProgressTrackerPage {
    this.verifyTaskExists("TB certificate outcome");

    // Check if the immediate prerequisite is completed
    this.getTaskStatus("Sputum collection and results").then((prevStatus) => {
      this.getTaskStatus("TB certificate outcome").then((status) => {
        if (status === "Completed" || status === "In progress" || status === "Certificate issued") {
          // Completed or in progress tasks are always clickable
          this.verifyTaskIsClickable("TB certificate outcome");
        } else if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
          // Previous task completed, should be accessible
          this.verifyTaskIsClickable("TB certificate outcome");
        } else {
          // Previous task not completed, should not be accessible
          this.verifyTaskIsNotClickable("TB certificate outcome");
        }
      });
    });
    return this;
  }

  verifyTBCertificateOutcomePrerequisites(): TBProgressTrackerPage {
    // Check if the immediate prerequisite (Sputum collection and results) is completed
    this.getTaskStatus("Sputum collection and results").then((prevStatus) => {
      this.getTaskStatus("TB certificate outcome").then((status) => {
        if (status === "Completed" || status === "In progress" || status === "Certificate issued") {
          // Completed/in progress/certificate issued tasks should always be clickable
          this.verifyTaskIsClickable("TB certificate outcome");
        } else if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
          // Immediate prerequisite is completed, TB certificate should be accessible
          this.verifyTaskIsClickable("TB certificate outcome");
        } else {
          // Immediate prerequisite not completed, should not be accessible
          this.verifyTaskIsNotClickable("TB certificate outcome");
        }
      });
    });
    return this;
  }

  // Note: verifyBreadcrumbNavigation is inherited from BasePage (verifyBreadcrumbs)

  // Verify the progress tracker header structure
  verifyProgressTrackerHeader(): TBProgressTrackerPage {
    cy.get(".progress-tracker-header")
      .should("be.visible")
      .within(() => {
        cy.get(".progress-tracker-header-content").should("exist");
        cy.get(".govuk-summary-list").should("be.visible");
      });
    return this;
  }

  // Verify TB screening status in header
  verifyTBScreeningStatus(expectedStatus: string): TBProgressTrackerPage {
    this.verifySummaryValue("TB screening", expectedStatus);
    return this;
  }

  // Verify section headings exist
  verifySectionHeadings(): TBProgressTrackerPage {
    cy.contains("h2.govuk-heading-s", "1. Visa applicant information").should("be.visible");
    cy.contains("h2.govuk-heading-s", "2. Medical screening").should("be.visible");
    cy.contains("h2.govuk-heading-s", "3. Review outcome").should("be.visible");
    cy.contains("h2.govuk-heading-s", "Start a new search").should("be.visible");
    return this;
  }

  // Verify search for another applicant section
  verifySearchForAnotherApplicantSection(): TBProgressTrackerPage {
    cy.contains("h2.govuk-heading-s", "Start a new search").should("be.visible");
    cy.contains("p.govuk-body", "Search for another visa applicant").should("be.visible");
    cy.contains(".govuk-link", "Search for another visa applicant")
      .should("be.visible")
      .and("have.attr", "href", "/applicant-search");
    return this;
  }

  // Verify task clickability based on actual status
  verifyTaskClickabilityByActualStatus(taskName: string): TBProgressTrackerPage {
    this.getTaskStatus(taskName).then((status) => {
      this.verifyTaskActionabilityByStatus(taskName, status as TaskStatus);
    });
    return this;
  }

  // Verify all tasks clickability based on their current status
  verifyAllTasksClickabilityByStatus(): TBProgressTrackerPage {
    const allTasks = [
      "Visa applicant details",
      "Travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    allTasks.forEach((task) => {
      this.verifyTaskClickabilityByActualStatus(task);
    });
    return this;
  }

  // Verify current values
  verifyCurrentPageStructure(): TBProgressTrackerPage {
    this.verifyPageLoaded();
    this.verifyProgressTrackerHeader();
    this.verifyApplicantPhotoDisplayed();
    this.verifySectionHeadings();
    this.verifySearchForAnotherApplicantSection();
    return this;
  }

  // Verify sequential task flow based on Business Logic
  verifySequentialTaskFlow(): TBProgressTrackerPage {
    const taskSequence = [
      "Visa applicant details", // Should be completed and clickable
      "Travel information", // Should be clickable if previous is completed
      "Medical history and TB symptoms", // Should be clickable only if Travel information is completed
      "Upload chest X-ray images", // Should be clickable only if Medical history is completed
      "Radiological outcome", // Should be clickable only if Upload chest X-ray is completed
      "Make a sputum decision", // Should be clickable only if Radiological outcome is completed
      "Sputum collection and results", // Should be clickable only if Make a sputum decision is completed
      "TB certificate outcome", // Should be clickable only if Sputum collection is completed
    ];

    // Verify each task follows the sequential rule
    taskSequence.forEach((task, index) => {
      if (index === 0) {
        // First task should always be accessible
        this.verifyTaskIsClickable(task);
      } else {
        // Check if this task should be clickable based on previous task completion
        const previousTask = taskSequence[index - 1];
        this.getTaskStatus(previousTask).then((prevStatus) => {
          this.getTaskStatus(task).then((currentStatus) => {
            if (
              currentStatus === "Completed" ||
              currentStatus === "In progress" ||
              currentStatus === "Certificate issued"
            ) {
              // Always clickable if completed, in progress, or certificate issued
              this.verifyTaskIsClickable(task);
            } else if (prevStatus === "Completed" || prevStatus === "Certificate issued") {
              // Previous task completed, this should be clickable
              this.verifyTaskIsClickable(task);
            } else {
              // Previous task not completed, this should not be clickable
              this.verifyTaskIsNotClickable(task);
            }
          });
        });
      }
    });
    return this;
  }

  // Comprehensive task validation including clickability
  verifyTasksWithClickabilityValidation(): TBProgressTrackerPage {
    this.verifyAllTasksExist();
    this.verifySequentialTaskFlow();
    return this;
  }
}
