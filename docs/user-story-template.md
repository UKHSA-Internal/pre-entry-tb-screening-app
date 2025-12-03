# **User Story**

**As a** [role], **I want** [goal] **so that** [reason].

---

## **Description**

[Briefly explain the purpose and context of the user story.]

---

## **Acceptance Criteria**

Use the **Given-When-Then** format:

Given [precondition] AND [additional preconditions]

    This describes the initial state or setup required for the test.

When [user action] AND [other actions]

    This outlines the user’s specific actions.

Then [a testable outcome is achieved] AND [something else happens too]

    This defines the expected results of the user’s actions.

---

### **Example**

Given the user is logged in AND has access to the product catalogue

When the user searches by category AND selects a filter

Then the system displays relevant products AND updates the results dynamically

---

## **Tech Notes**

[Briefly describe the technical aspects involved in implementing the user story.]

---

## **Test & QA Notes**

[Specify any testing or quality assurance considerations.]

---

## **NFRs / Other Considerations**

[List any Non-Functional Requirements (NFRs) or other relevant considerations.]

---

## **Definition of Ready**

A Product Backlog Item (PBI) is **Ready** when:

- Business value is clearly articulated
- The team (including the Product Owner) understands the PBI in sufficient detail to decide if it can be completed within a Sprint
- No known dependencies are expected to block completion
- The team will be adequately staffed to complete the PBI
- Acceptance Criteria are clear, well understood, and can be validated by external stakeholders
- NFRs including testing are sufficiently understood
- The team understands how to demonstrate completion in Sprint Review
- All relevant sections of the ticket template have been completed

---

## **Definition of Done**

A Product Backlog Item (PBI) is **Done** when:

- All tests (unit, integration, performance, UI, etc.) are created and pass.
- All code has been peer-reviewed and PR approved by the lead developer and at least one other developer from any squad
- All acceptance criteria have been met and tested in the PR environment
- The PBI has been deployed into a non-production environment and accepted by the Product Owner
- Secrets scanning, vulnerability scanning, and static code analysis have passed
- Project builds and deploys without errors or warnings
- Sufficient logging and monitoring are in place
- Sufficient error handling is in place
- New code has appropriate test coverage
- Documentation has been added (if required)
- Changes merged to develop and deployed to the QAT environment (/test)

---
