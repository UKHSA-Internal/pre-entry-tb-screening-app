import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";
import TaskChoicePage from "../src/pages/task-choice";

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Task choice page", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  it("renders text & links correctly", () => {
    renderWithProviders(<TaskChoicePage />);

    expect(screen.getByText("What do you need to do?")).toBeInTheDocument();

    const newScreeningLink = screen.getByRole("link", {
      name: "Search for or start a new screening",
    });
    const screeningsInProgress = screen.getByRole("link", {
      name: "View all screenings in progress",
    });
    expect(newScreeningLink).toBeInTheDocument();
    expect(newScreeningLink).toHaveAttribute("href", "/search-for-visa-applicant");
    expect(screeningsInProgress).toBeInTheDocument();
    expect(screeningsInProgress).toHaveAttribute("href", "/screenings-in-progress");
  });

  it("store correctly populated and user navigated to dashboard when apps successfully retrieved (200 response)", async () => {
    const preloadedState = {
      applicationsInProgress: { applications: [], cursor: null },
    };

    const applicationsResFixture = {
      applications: [
        {
          applicationId: "9189a071-945b-4834-a6cb-8748c4746eba",
          applicantId: "COUNTRY#AFG#PASSPORT#abc1",
          applicantName: "Name One",
          passportNumber: "abc1",
          countryOfIssue: "AFG",
          clinicId: "my-clinic",
          dateCreated: "2021-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.IN_PROGRESS,
        },
        {
          applicationId: "b1a2f682-9281-4b92-b4ef-878edfd06d23",
          applicantId: "COUNTRY#AFG#PASSPORT#abc2",
          applicantName: "Name Two",
          passportNumber: "abc2",
          countryOfIssue: "AFG",
          clinicId: "my-clinic",
          dateCreated: "2026-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.IN_PROGRESS,
        },
        {
          applicationId: "17811cbc-501d-4051-94ae-67692fe6f393",
          applicantId: "COUNTRY#AFG#PASSPORT#abc3",
          applicantName: "Name Three",
          passportNumber: "abc3",
          countryOfIssue: "AFG",
          clinicId: "my-clinic",
          dateCreated: "2023-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.IN_PROGRESS,
        },
        {
          applicationId: "17811cbc-501d-4051-94ae-67692fe6f363",
          applicantId: "COUNTRY#AFG#PASSPORT#abc4",
          applicantName: "Should not see - different clinic",
          passportNumber: "abc4",
          countryOfIssue: "AFG",
          clinicId: "another-clinic",
          dateCreated: "2026-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.IN_PROGRESS,
        },
        {
          applicationId: "17814cbc-501d-4051-94ae-67692fe6f363",
          applicantId: "COUNTRY#AFG#PASSPORT#abc9",
          applicantName: "Should not see - different status",
          passportNumber: "abc9",
          countryOfIssue: "AFG",
          clinicId: "my-clinic",
          dateCreated: "2026-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.CERTIFICATE_NOT_ISSUED,
        },
      ],
      cursor: null,
    };

    const { store } = renderWithProviders(<TaskChoicePage />, { preloadedState });

    const user = userEvent.setup();

    mock.onGet("/application/dashboard").reply(200, applicationsResFixture);

    await user.click(screen.getByRole("link", { name: "View all screenings in progress" }));

    expect(mock.history[0].url).toEqual("/application/dashboard");
    expect(mock.history).toHaveLength(1);

    await waitFor(() => {
      expect(store.getState().applicationsInProgress).toMatchObject(applicationsResFixture);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/screenings-in-progress");
    });
  });

  it("user navigated to error page on 500 response", async () => {
    renderWithProviders(<TaskChoicePage />);

    const user = userEvent.setup();

    mock.onGet("/applications").reply(500);

    await user.click(screen.getByRole("link", { name: "View all screenings in progress" }));

    expect(mock.history[0].url).toEqual("/application/dashboard");
    expect(mock.history).toHaveLength(1);

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });
  });
});
