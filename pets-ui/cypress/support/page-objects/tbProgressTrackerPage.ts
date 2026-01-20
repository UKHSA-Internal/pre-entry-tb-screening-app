// This holds all fields for the TB Progress Tracker Page
import { BasePage } from "../BasePageNew";
import { ButtonHelper, GdsComponentHelper, SummaryHelper } from "../helpers";

// Type safety for task statuses
type TaskStatus =
  | "Not yet started"
  | "Cannot start yet"
  | "Completed"
  | "Not required"
  | "In progress"
  | "Certificate not issued"
  | "Certificate issued";

// Interface for applicant information
interface ApplicantInfo {
  Name?: string;
  "Date of birth"?: string;
  "Passport number"?: string;
  "TB screening"?: string;
}

// Interface for task statuses
interface TaskStatuses {
  "Visa applicant details"?: TaskStatus;
  "UK travel information"?: TaskStatus;
  "Medical history and TB symptoms"?: TaskStatus;
  "Upload chest X-ray images"?: TaskStatus;
  "Radiological outcome"?: TaskStatus;
  "Make a sputum decision"?: TaskStatus;
  "Sputum collection and results"?: TaskStatus;
  "TB certificate outcome"?: TaskStatus;
}

export class TBProgressTrackerPage extends BasePage {
  // Compose helper instances
  private gds = new GdsComponentHelper();
  private button = new ButtonHelper();
  private summary = new SummaryHelper();

  constructor() {
    super("/tracker");
  }

  // Override to maintain return type
  verifyServiceName(): TBProgressTrackerPage {
    super.verifyServiceName();
    return this;
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

  // Verify applicant information in header section - DYNAMIC
  verifyApplicantInfo(expectedValues: ApplicantInfo): TBProgressTrackerPage {
    (Object.entries(expectedValues) as [keyof ApplicantInfo, string][]).forEach(([key, value]) => {
      if (value !== undefined) {
        this.summary.verifySummaryValue(key, value);
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

  // Get task status - DYNAMIC
  getTaskStatus(taskName: string): Cypress.Chainable<string> {
    return this.getTaskElement(taskName)
      .closest(".govuk-task-list__item")
      .find(".govuk-task-list__status")
      .invoke("text")
      .then((text) => text.trim());
  }

  // Verify task status - DYNAMIC
  verifyTaskStatus(taskName: string, expectedStatus: string): TBProgressTrackerPage {
    this.getTaskStatus(taskName).should("eq", expectedStatus);
    return this;
  }

  // Verify task status with type safety - DYNAMIC
  verifyTaskHasStatus(taskName: string, expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus(taskName, expectedStatus);
    return this;
  }

  // Verify multiple task statuses - DYNAMIC
  verifyMultipleTaskStatuses(expectedStatuses: TaskStatuses): TBProgressTrackerPage {
    (Object.entries(expectedStatuses) as [keyof TaskStatuses, TaskStatus][]).forEach(
      ([taskName, status]) => {
        if (status !== undefined) {
          this.verifyTaskStatus(taskName, status);
        }
      },
    );
    return this;
  }

  // Verify TB certificate outcome has specified status - DYNAMIC
  verifyTBCertificateOutcomeStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("TB certificate outcome", expectedStatus);
    return this;
  }

  // Verify TB screening status shows specified value in header - DYNAMIC
  verifyTBScreeningStatus(expectedStatus: string): TBProgressTrackerPage {
    this.summary.verifySummaryValue("TB screening", expectedStatus);
    return this;
  }

  // Verify complete scenario with dynamic expected statuses
  verifyCompleteScenario(expectedStatuses: TaskStatuses): TBProgressTrackerPage {
    this.verifyMultipleTaskStatuses(expectedStatuses);
    return this;
  }

  // Verify complete scenario where all tasks are done and certificate is issued
  verifyCompleteScenarioWithCertificateIssued(): TBProgressTrackerPage {
    const expectedStatuses: TaskStatuses = {
      "Visa applicant details": "Completed",
      "UK travel information": "Completed",
      "Medical history and TB symptoms": "Completed",
      "Upload chest X-ray images": "Completed",
      "Radiological outcome": "Completed",
      "Make a sputum decision": "Completed",
      "Sputum collection and results": "Completed",
      "TB certificate outcome": "Certificate issued",
    };

    this.verifyCompleteScenario(expectedStatuses);
    this.verifyTBScreeningStatus("Certificate issued");
    return this;
  }

  // Verify tracker with dynamic applicant and task data
  verifyTrackerWithDynamicData(
    applicantInfo: ApplicantInfo,
    taskStatuses: TaskStatuses,
  ): TBProgressTrackerPage {
    this.verifyPageLoaded();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyMultipleTaskStatuses(taskStatuses);
    return this;
  }

  // Verify all tasks are clickable when screening is complete
  verifyAllTasksClickableWhenComplete(): TBProgressTrackerPage {
    const allTasks = [
      "Visa applicant details",
      "UK travel information",
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
      "UK travel information",
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
    const expectedTaskLinks = ["Visa applicant details", "UK travel information"];

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

  // Verify visa applicant details task status - DYNAMIC
  verifyVisaApplicantDetailsStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Visa applicant details", expectedStatus);
    return this;
  }

  // Verify travel information task status - DYNAMIC
  verifyTravelInformationStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("UK travel information", expectedStatus);
    return this;
  }

  // Verify medical history task status - DYNAMIC
  verifyMedicalHistoryStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Medical history and TB symptoms", expectedStatus);
    return this;
  }

  // Verify upload chest X-ray images task status - DYNAMIC
  verifyUploadChestXrayImagesStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Upload chest X-ray images", expectedStatus);
    return this;
  }

  // Verify radiological outcome task status - DYNAMIC
  verifyRadiologicalOutcomeStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Radiological outcome", expectedStatus);
    return this;
  }

  // Verify make a sputum decision task status - DYNAMIC
  verifyMakeASputumDecisionStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Make a sputum decision", expectedStatus);
    return this;
  }

  // Verify sputum collection and results task status - DYNAMIC
  verifySputumCollectionAndResultsStatus(expectedStatus: TaskStatus): TBProgressTrackerPage {
    this.verifyTaskStatus("Sputum collection and results", expectedStatus);
    return this;
  }

  // Verify task is clickable
  verifyTaskIsClickable(taskName: string): TBProgressTrackerPage {
    cy.contains(".govuk-task-list__link", taskName).should("exist").and("be.visible");
    return this;
  }

  // Verify task is not clickable
  verifyTaskIsNotClickable(taskName: string): TBProgressTrackerPage {
    // Check that the task exists but is not a link
    cy.get(".govuk-task-list__item")
      .contains(taskName)
      .closest(".govuk-task-list__item")
      .within(() => {
        cy.get(".govuk-task-list__link").should("not.exist");
      });
    return this;
  }

  // Verify task actionability based on status - DYNAMIC
  verifyTaskActionabilityByStatus(taskName: string, status: TaskStatus): TBProgressTrackerPage {
    switch (status) {
      case "Completed":
      case "In progress":
      case "Certificate issued":
        this.verifyTaskIsClickable(taskName);
        break;
      case "Not yet started":
      case "Cannot start yet":
      case "Not required":
      case "Certificate not issued":
        // These may or may not be clickable depending on sequential flow
        // Check based on previous task status
        break;
    }
    return this;
  }

  // Verify task accessibility based on sequential dependencies - DYNAMIC
  verifyTaskAccessibilityInSequence(taskName: string): TBProgressTrackerPage {
    const taskSequence = [
      "Visa applicant details",
      "UK travel information",
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

  // Get all task statuses - DYNAMIC
  getAllTaskStatuses(): Cypress.Chainable<TaskStatuses> {
    const taskNames: (keyof TaskStatuses)[] = [
      "Visa applicant details",
      "UK travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
    ];

    const statuses: TaskStatuses = {};

    return cy.wrap(null).then(() => {
      const promises = taskNames.map((taskName) => {
        return this.getTaskStatus(taskName).then((status) => {
          statuses[taskName] = status as TaskStatus;
        });
      });

      return cy.wrap(Promise.all(promises)).then(() => statuses);
    });
  }

  // TB certificate outcome accessibility based on sequential flow - DYNAMIC
  verifyTBCertificateOutcomeAccessibility(): TBProgressTrackerPage {
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

  // Verify task clickability based on actual status - DYNAMIC
  verifyTaskClickabilityByActualStatus(taskName: string): TBProgressTrackerPage {
    this.getTaskStatus(taskName).then((status) => {
      this.verifyTaskActionabilityByStatus(taskName, status as TaskStatus);
    });
    return this;
  }

  // Verify all tasks clickability based on their current status - DYNAMIC
  verifyAllTasksClickabilityByStatus(): TBProgressTrackerPage {
    const allTasks = [
      "Visa applicant details",
      "UK travel information",
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

  // Verify current page structure
  verifyCurrentPageStructure(): TBProgressTrackerPage {
    this.verifyPageLoaded();
    this.verifyProgressTrackerHeader();
    this.verifyApplicantPhotoDisplayed();
    this.verifySectionHeadings();
    this.verifySearchForAnotherApplicantSection();
    return this;
  }

  // Verify sequential task flow based on Business Logic - DYNAMIC
  verifySequentialTaskFlow(): TBProgressTrackerPage {
    const taskSequence = [
      "Visa applicant details",
      "UK travel information",
      "Medical history and TB symptoms",
      "Upload chest X-ray images",
      "Radiological outcome",
      "Make a sputum decision",
      "Sputum collection and results",
      "TB certificate outcome",
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

  // Comprehensive task validation including clickability - DYNAMIC
  verifyTasksWithClickabilityValidation(): TBProgressTrackerPage {
    this.verifyAllTasksExist();
    this.verifySequentialTaskFlow();
    return this;
  }

  // Complete validation with all dynamic data
  verifyCompleteTrackerState(
    applicantInfo: ApplicantInfo,
    taskStatuses: TaskStatuses,
  ): TBProgressTrackerPage {
    this.verifyCurrentPageStructure();
    this.verifyApplicantInfo(applicantInfo);
    this.verifyMultipleTaskStatuses(taskStatuses);
    this.verifySequentialTaskFlow();
    return this;
  }
}
