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

const travelState = {
  applicantUkAddress1: "Edinburgh Castle, Castlehill",
  applicantUkAddress2: "",
  applicantUkAddress3: "",
  postcode: "EH1 2NG",
  status: ApplicationStatus.NOT_YET_STARTED,
  townOrCity: "Edinburgh",
  ukEmail: "sigmund.sigmundson@asgard.gov",
  ukMobileNumber: "07321900900",
  visaCategory: "Government Sponsored",
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

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Visa category");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Government Sponsored");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("Address line 1 (optional)");
    expect(screen.getAllByRole("definition")[2]).toHaveTextContent("Edinburgh Castle, Castlehill");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent("Address line 2 (optional)");
    expect(screen.getAllByRole("definition")[4]).toHaveTextContent("Not provided");
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("Address line 3 (optional)");
    expect(screen.getAllByRole("definition")[6]).toHaveTextContent("Not provided");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("Town or city (optional)");
    expect(screen.getAllByRole("definition")[8]).toHaveTextContent("Edinburgh");
    expect(screen.getAllByRole("term")[5]).toHaveTextContent("Postcode (optional)");
    expect(screen.getAllByRole("definition")[10]).toHaveTextContent("EH1 2NG");
    expect(screen.getAllByRole("term")[6]).toHaveTextContent("UK phone number");
    expect(screen.getAllByRole("definition")[12]).toHaveTextContent("07321900900");
    expect(screen.getAllByRole("term")[7]).toHaveTextContent("UK email address");
    expect(screen.getAllByRole("definition")[14]).toHaveTextContent(
      "sigmund.sigmundson@asgard.gov",
    );

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application/abc-123/travel-information");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/travel-information-confirmed");
  });

  test("user is navigated to error page when api call is unsuccessful", async () => {
    renderWithProviders(<TravelReview />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/travel-information").reply(500);

    await user.click(screen.getAllByRole("button")[0]);

    expect(mock.history[0].url).toEqual("/application/abc-123/travel-information");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      travel: {
        status: ApplicationStatus.COMPLETE,
        visaCategory: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
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

  test("back link points to UK address & contact info page when status is not complete", () => {
    const preloadedState = {
      travel: {
        status: ApplicationStatus.IN_PROGRESS,
        visaCategory: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
        townOrCity: "",
        postcode: "",
        ukMobileNumber: "",
        ukEmail: "",
      },
    };

    renderWithProviders(<TravelSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/visa-applicant-proposed-uk-address");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("shows change links with from query when task is COMPLETE", () => {
    const completeState = {
      travel: {
        status: ApplicationStatus.COMPLETE,
        visaCategory: "Work",
        applicantUkAddress1: "1 Street",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
        townOrCity: "London",
        postcode: "0000 111",
        ukMobileNumber: "07123456789",
        ukEmail: "test@test.com",
      },
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(<TravelReview />, { preloadedState: completeState });

    const changeLinks = screen.getAllByRole("link", { name: /Change/i });
    expect(changeLinks.length).toBeGreaterThan(0);

    expect(changeLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining(
        "/proposed-visa-category?from=/check-travel-information#visa-category",
      ),
    );

    const anyAddressChangeLinkHasFrom = changeLinks.some((a) =>
      (a.getAttribute("href") || "").includes(
        "/visa-applicant-proposed-uk-address?from=/check-travel-information#",
      ),
    );
    expect(anyAddressChangeLinkHasFrom).toBe(true);
  });
});
