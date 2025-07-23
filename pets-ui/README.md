# Complete UK pre-entry health screening - UI

## Setup

This project uses:

- [Vite](https://vite.dev/) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/docs/)
- [govuk-frontend](https://github.com/alphagov/govuk-frontend) for GDS-compliant sass styling
- [Vitest](https://vitest.dev/) and [Cypress](https://www.cypress.io/) for testing
- [Redux](https://redux.js.org/) for state management
- [pnpm](https://pnpm.io/) for package management

To install dependencies, run `pnpm i`.

## Commands

| Command      | Description |
| ----------- | ----------- |
| `pnpm run dev`        | Starts the UI in development mode,       |
| `pnpm run build`      | Create a build in `/dist`        |
| `pnpm run preview`    | Preview a build created locally        |
| `pnpm run test`       | Run unit tests        |
| `pnpm run cypress`    | Opens the Cypress UI        |
| `npx cypress run`     | Run cypress E2E tests in the terminal        |

## Cypress End to End Tests

### Prerequisites

- Download the cypress binary

```sh
cd pets-ui
pnpm exec cypress install --force
```

- Pull local enviroment secrets using this [guide](../README.md#pulling-secrets-for-local-development).

### Running the test

- In one terminal, start up the Dev Environment in the background using `pnpm start`

- Please contine to either running via Cypress UI or via the CLI

#### Running via Cypress UI(Please note this might not work on Mac, use CLI if that's the case)

- Open a second terminal, run the commands below to open the cypress UI:

    ```sh
        cd pets-ui
        pnpm cypress:open
    ```

- Once cypress is open click on the 'E2E Testing' option, it should say 'Configured' underneath in green.
- Select your browser and then Select the test you wish to run;
  - Electron and Mozilla are highly recommended due to enforced organization policy on Chrome and Edge that might affect your test run.

- See below for information on existing test;
  - applicantDetailsDateValidationTest - This Test is validating applicant date fields will reject special characters.
  - applicantDetailsPage- Happy path Test with VALID data enteredt in all fields (This test does not currently include submission validation which will - be included at a later date. the scipt for it is ( // Validate that the page navigates to the confirmation page cy.url().should('include', '<http://localhost:3000/applicant/confirmation>');)
  - emptyMandatoryFieldTest - This Test checks error messages are displayed when a mandatory field is left empty at submission.
  - textFieldValidation - This Test validates error messages are displayed when special characters are entered in the Free Text fields.

#### Running via CLI

- On a second terminal, run `cd pets-ui`.

- To run all tests in browser mode:
    `pnpm cypress:run --headed`

- To run test for a single file: `pnpm cypress:run --spec '[the/relative/path/to/test/]' --headed`

    For example:

    `pnpm cypress:run --spec 'cypress/e2e/ApplicantDetailsPage/TBBETA-324 - TC04.cy.ts' --headed`

    `pnpm cypress:run --spec 'cypress/e2e/TravelDetailsPage/TBBETA-547 - TC02.cy.ts' --headed`

- See [cypress-run](https://docs.cypress.io/app/references/command-line#cypress-run) for more options
