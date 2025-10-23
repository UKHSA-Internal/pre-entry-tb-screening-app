import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import TravelAddressAndContactDetailsPage from "@/pages/travel-uk-address";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";
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
});
