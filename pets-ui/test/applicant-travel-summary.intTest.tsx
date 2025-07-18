import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import TravelSummaryPage from "@/pages/travel-summary";
import TravelReview from "@/sections/applicant-travel-summary";
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

const travelState = {
  applicantUkAddress1: "Edinburgh Castle, Castlehill",
  applicantUkAddress2: "",
  postcode: "EH1 2NG",
  status: ApplicationStatus.NOT_YET_STARTED,
  townOrCity: "Edinburgh",
  ukEmail: "sigmund.sigmundson@asgard.gov",
  ukMobileNumber: "07321900900",
  visaType: "Government Sponsored",
};

const applicationState = { applicationId: "abc-123", dateCreated: "" };

const preloadedState = {
  travel: { ...travelState },
  application: { ...applicationState },
};

describe("TravelReview", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
  });

  test("state is displayed correctly & user is navigated to confirmation page when travel details are posted successfully", async () => {
    renderWithProviders(<TravelReview />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/travel-information").reply(200);

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Visa type");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Government Sponsored");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("UK address line 1");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("Edinburgh Castle, Castlehill");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("UK address line 2");
    expect(screen.getAllByRole("definition")[4]).toHaveTextContent(
      "Enter UK address line 2 (optional)",
    );
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("UK town or city");
    expect(screen.getAllByRole("definition")[5]).toHaveTextContent("Edinburgh");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("UK postcode");
    expect(screen.getAllByRole("definition")[7]).toHaveTextContent("EH1 2NG");
    expect(screen.getAllByRole("term")[5]).toHaveTextContent("UK mobile number");
    expect(screen.getAllByRole("definition")[9]).toHaveTextContent("07321900900");
    expect(screen.getAllByRole("term")[6]).toHaveTextContent("UK email address");
    expect(screen.getAllByRole("definition")[11]).toHaveTextContent(
      "sigmund.sigmundson@asgard.gov",
    );

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application/abc-123/travel-information");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/travel-confirmation");
  });

  test("user is navigated to error page when api call is unsuccessful", async () => {
    renderWithProviders(<TravelReview />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/travel-information").reply(500);

    await user.click(screen.getAllByRole("button")[0]);

    expect(mock.history[0].url).toEqual("/application/abc-123/travel-information");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      travel: {
        status: ApplicationStatus.COMPLETE,
        visaType: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        townOrCity: "",
        postcode: "",
        ukMobileNumber: "",
        ukEmail: "",
      },
    };

    renderWithProviders(<TravelSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to travel details form page status is not complete", () => {
    const preloadedState = {
      travel: {
        status: ApplicationStatus.IN_PROGRESS,
        visaType: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        townOrCity: "",
        postcode: "",
        ukMobileNumber: "",
        ukEmail: "",
      },
    };

    renderWithProviders(<TravelSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/travel-details");
    expect(link).toHaveClass("govuk-back-link");
  });
});
