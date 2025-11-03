import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import TravelAddressAndContactDetailsPage from "@/pages/travel-uk-address";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";
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

describe("ApplicantTravelAddressAndContactDetails", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when form is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantTravelAddressAndContactDetails />);

    const user = userEvent.setup();

    await user.type(screen.getByTestId("address-1"), "Edinburgh Castle, Castlehill");
    await user.type(screen.getByTestId("town-or-city"), "Edinburgh");
    await user.type(screen.getByTestId("postcode"), "EH1 2NG");
    await user.type(screen.getByTestId("mobile-number"), "07321900900");
    await user.type(screen.getByTestId("email"), "sigmund.sigmundson@asgard.gov");

    expect(screen.getByTestId("address-1")).toHaveValue("Edinburgh Castle, Castlehill");
    expect(screen.getByTestId("town-or-city")).toHaveValue("Edinburgh");
    expect(screen.getByTestId("postcode")).toHaveValue("EH1 2NG");
    expect(screen.getByTestId("mobile-number")).toHaveValue("07321900900");
    expect(screen.getByTestId("email")).toHaveValue("sigmund.sigmundson@asgard.gov");

    await user.click(screen.getAllByRole("button")[0]);

    expect(store.getState().travel).toEqual({
      applicantUkAddress1: "Edinburgh Castle, Castlehill",
      applicantUkAddress2: "",
      applicantUkAddress3: "",
      postcode: "EH1 2NG",
      status: "In progress",
      townOrCity: "Edinburgh",
      ukEmail: "sigmund.sigmundson@asgard.gov",
      ukMobileNumber: "07321900900",
      visaCategory: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-travel-information");
  });

  it("when form is left blank then user is navigated to summary page", async () => {
    renderWithProviders(<ApplicantTravelAddressAndContactDetails />);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-travel-information");
  });

  it("back link points to visa category page", () => {
    renderWithProviders(<TravelAddressAndContactDetailsPage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/proposed-visa-category");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("back link points to TB summary when travel status is COMPLETE", () => {
    const completeState = {
      travel: {
        status: ApplicationStatus.COMPLETE,
        visaCategory: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
        townOrCity: "",
        postcode: "",
        ukEmail: "",
        ukMobileNumber: "",
      },
    };
    renderWithProviders(<TravelAddressAndContactDetailsPage />, { preloadedState: completeState });
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/tb-certificate-summary");
  });

  it("updates slice and navigates to TB summary when editing in COMPLETE status", async () => {
    vi.spyOn(api, "putTravelDetails").mockResolvedValue({ status: 200, statusText: "OK" });
    const user = userEvent.setup();
    const completeState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      travel: {
        status: ApplicationStatus.COMPLETE,
        visaCategory: "Work",
        applicantUkAddress1: "1 Street",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
        townOrCity: "London",
        postcode: "0000 111",
        ukEmail: "test@example.co.uk",
        ukMobileNumber: "07123456789",
      },
    };
    const { store } = renderWithProviders(<ApplicantTravelAddressAndContactDetails />, {
      preloadedState: completeState,
    });

    await user.clear(screen.getByTestId("address-1"));
    await user.type(screen.getByTestId("address-1"), "2 Street");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().travel.applicantUkAddress1).toBe("2 Street");
      expect(store.getState().travel.status).toBe(ApplicationStatus.COMPLETE);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-summary");
    });
  });
});
