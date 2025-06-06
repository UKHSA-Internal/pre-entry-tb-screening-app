import { screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ApplicantResultsPage from "@/pages/applicant-results";
import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});
vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

export const handlers = [];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

test("No results section is correctly displayed with information from the Redux store", () => {
  const preloadedState = {
    applicant: {
      status: ApplicationStatus.NOT_YET_STARTED,
      fullName: "",
      sex: "",
      dateOfBirth: {
        year: "",
        month: "",
        day: "",
      },
      countryOfNationality: "",
      passportNumber: "12345",
      countryOfIssue: "",
      passportIssueDate: {
        year: "",
        month: "",
        day: "",
      },
      passportExpiryDate: {
        year: "",
        month: "",
        day: "",
      },
      applicantHomeAddress1: "",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      townOrCity: "",
      provinceOrState: "",
      country: "",
      postcode: "",
    },
  };

  renderWithProviders(
    <Router>
      <ApplicantResultsPage />
    </Router>,
    { preloadedState },
  );

  expect(screen.getByText("No matching record found")).toBeInTheDocument();
  expect(screen.getByText("No matches for passport number 12345")).toBeInTheDocument();
});
