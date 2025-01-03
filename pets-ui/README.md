# Complete UK Pre-Entry Health Screening - UI

## Setup

This project uses:
- [Vite](https://vite.dev/) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/docs/)
- [govuk-frontend](https://github.com/alphagov/govuk-frontend) for GDS-compliant sass styling
- [Vitest](https://vitest.dev/) and [Cypress](https://www.cypress.io/) for testing
- [Redux](https://redux.js.org/) for state management
- [pnpm](https://pnpm.io/) for package management

To install dependencies, run `pnpm i`.

## Commands

- To start the UI in development mode, run `pnpm run dev`.
- To create a build in `/dist`, run `pnpm run build`.
- To preview a build created locally, run `pnpm run preview`.

- To run unit tests, run `pnpm run test`.
- To open the cypress UI, run `pnpm run cypress`.
- To run cypress E2E tests in the terminal, run `npx cypress run`.

## Cypress Tests

- In one terminal, open up the UI in the background using 'pnpm run dev'
- Open a second terminal, CD to the e2e folder and run a 'pnpm cypress open' to open cypress.
- Once cypress is open click on the 'E2E Testing' option, it should say 'Configured' underneath in green. 
- Select your browser and then Select the test you wish to run;
- applicantDetailsDateValidationTest - This Test is validating applicant date fields will reject special characters.
- applicantDetailsPage- Happy path Test with VALID data enteredt in all fields (This test does not currently include submission validation which will - be included at a later date. the scipt for it is ( // Validate that the page navigates to the confirmation page cy.url().should('include', 'http://localhost:3000/applicant/confirmation');)
- emptyMandatoryFieldTest - This Test checks error messages are displayed when a mandatory field is left empty at submission.
- textFieldValidation - This Test validates error messages are displayed when special characters are entered in the Free Text fields.