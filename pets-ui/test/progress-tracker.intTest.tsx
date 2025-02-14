import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ProgressTrackerPage from "@/pages/progress-tracker";
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

test("Progress tracker page displays incomplete application sections correctly & links to applicant details form", async () => {
  const preloadedState = {
    applicant: {
      status: ApplicationStatus.INCOMPLETE,
      fullName: "Reginald Backwaters",
      sex: "",
      dateOfBirth: {
        year: "1970",
        month: "12",
        day: "31",
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
      <ProgressTrackerPage />
    </Router>,
    { preloadedState },
  );

  const user = userEvent.setup();

  expect(screen.getByText("Application Progress Tracker")).toBeInTheDocument();

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Reginald Backwaters");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of Birth");
  expect(screen.getAllByRole("definition")[1]).toHaveTextContent("31/12/1970");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("Passport Number");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("12345");

  const applicantDetailsLink = screen.getByRole("link", { name: /Applicant Details/i });
  expect(applicantDetailsLink).toHaveAttribute("href", "/contact");
  const applicantDetailsListItem = applicantDetailsLink.closest("li");
  expect(applicantDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(applicantDetailsListItem as HTMLElement).getByText("Incomplete"));

  await user.click(screen.getByRole("button"));
  expect(useNavigateMock).toHaveBeenCalled();
});

test("Progress tracker page displays complete application sections correctly & links to summary page", async () => {
  const preloadedState = {
    applicant: {
      status: ApplicationStatus.COMPLETE,
      fullName: "Chelsea Cummerbund",
      sex: "",
      dateOfBirth: {
        year: "1971",
        month: "11",
        day: "30",
      },
      countryOfNationality: "",
      passportNumber: "54321",
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
      <ProgressTrackerPage />
    </Router>,
    { preloadedState },
  );

  const user = userEvent.setup();

  expect(screen.getByText("Application Progress Tracker")).toBeInTheDocument();

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Chelsea Cummerbund");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of Birth");
  expect(screen.getAllByRole("definition")[1]).toHaveTextContent("30/11/1971");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("Passport Number");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("54321");

  const applicantDetailsLink = screen.getByRole("link", { name: /Applicant Details/i });
  expect(applicantDetailsLink).toHaveAttribute("href", "/applicant-summary");
  const applicantDetailsListItem = applicantDetailsLink.closest("li");
  expect(applicantDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(applicantDetailsListItem as HTMLElement).getByText("Completed"));

  await user.click(screen.getByRole("button"));
  expect(useNavigateMock).toHaveBeenCalled();
});
