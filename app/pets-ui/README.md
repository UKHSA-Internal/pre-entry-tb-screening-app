This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Unit Tests

Unit tests are run using Jest (with Babel for Typescript support).

To run all unit tests use `yarn run test`.

To run a subset of tests append the names of files or folders to the command, i.e. use `yarn run test <name1> <name2> ...`. Note that the names should not include a path, they should be just the name of the file or folder.


## Cypress Tests

- In one terminal, open up the UI in the background using 'pnpm run dev'
- Open a second terminal, CD to the e2e folder and run a 'pnpm cypress open' to open cypress.
- Once cypress is open click on the 'E2E Testing' option, it should say 'Configured' underneath in green.
Select your browser and then Select the test you wish to run;
- applicantDetailsDateValidationTest - This Test is validating applicant date fields will reject special characters.
- applicantDetailsPage- Happy path Test with VALID data enteredt in all fields (_This test does not currently include submission validation which will be included at a later date. the scipt for it is_  ( // Validate that the page navigates to the confirmation page 
        cy.url().should('include', 'http://localhost:3000/applicant/confirmation');)
- emptyMandatoryFieldTest - This Test checks error messages are displayed when a mandatory field is left empty at submission.
- textFieldValidation - This Test validates error messages are displayed when special characters are entered in the Free Text fields.

