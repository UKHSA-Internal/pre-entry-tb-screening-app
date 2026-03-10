import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import CancellationAreYouSurePage from "@/pages/cancellation-are-you-sure";
import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const preloadedState = {
  application: {
    applicationId: "abc-123",
    dateCreated: { year: "2010", month: "1", day: "1" },
    applicationStatus: ApplicationStatus.IN_PROGRESS,
    cancellationReason: "The clinic uploaded the wrong data",
    cancellationFurtherInfo: "They messed it up big time",
  },
};

describe("CancellationAreYouSurePage", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  test("text is displayed correctly & user is navigated to confirmation page when application is cancelled successfully", async () => {
    renderWithProviders(<CancellationAreYouSurePage />, { preloadedState });
    const user = userEvent.setup();

    mock.onPut("/application/abc-123/cancel").reply(200);

    expect(screen.getByText("Are you sure you want to cancel this screening?")).toBeInTheDocument();
    expect(
      screen.getByText("If you cancel, you will not be able to complete this screening."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The screening details will be saved. You will be able to view them in the visa applicant's screening history.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "If the visa applicant returns for a new screening, you will need to start again.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel screening" }));

    expect(mock.history[0].url).toEqual("/application/abc-123/cancel");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-screening-cancelled");
  });

  test("user is navigated to error page when api call is unsuccessful", async () => {
    renderWithProviders(<CancellationAreYouSurePage />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/cancel").reply(500);

    await user.click(screen.getByRole("button", { name: "Cancel screening" }));

    expect(mock.history[0].url).toEqual("/application/abc-123/cancel");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });

  test("user is navigated to tracker when secondary button clicked", async () => {
    renderWithProviders(<CancellationAreYouSurePage />, { preloadedState });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Return to screening" }));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
  });

  test("back link points to the cancellation reason page", () => {
    renderWithProviders(<CancellationAreYouSurePage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/why-are-you-cancelling-this-screening");
    expect(link).toHaveClass("govuk-back-link");
  });
});
