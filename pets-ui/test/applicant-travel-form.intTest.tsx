import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import TravelDetailsPage from "@/pages/travel-details";
import ApplicantTravelForm from "@/sections/applicant-travel-form";
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

describe("ApplicantTravelForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantTravelForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantTravelForm />);

    const user = userEvent.setup();

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "Family reunion" },
    });
    await user.type(screen.getByTestId("address-1"), "Edinburgh Castle, Castlehill");
    await user.type(screen.getByTestId("town-or-city"), "Edinburgh");
    await user.type(screen.getByTestId("postcode"), "EH1 2NG");
    await user.type(screen.getByTestId("mobile-number"), "07321900900");
    await user.type(screen.getByTestId("email"), "sigmund.sigmundson@asgard.gov");

    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Family reunion");
    expect(screen.getByTestId("address-1")).toHaveValue("Edinburgh Castle, Castlehill");
    expect(screen.getByTestId("town-or-city")).toHaveValue("Edinburgh");
    expect(screen.getByTestId("postcode")).toHaveValue("EH1 2NG");
    expect(screen.getByTestId("mobile-number")).toHaveValue("07321900900");
    expect(screen.getByTestId("email")).toHaveValue("sigmund.sigmundson@asgard.gov");

    await user.click(screen.getAllByRole("button")[0]);

    expect(store.getState().travel).toEqual({
      applicantUkAddress1: "Edinburgh Castle, Castlehill",
      applicantUkAddress2: "",
      postcode: "EH1 2NG",
      status: "In progress",
      townOrCity: "Edinburgh",
      ukEmail: "sigmund.sigmundson@asgard.gov",
      ukMobileNumber: "07321900900",
      visaCategory: "Family reunion",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/travel-summary");
  });

  it("errors when travel details are missing", async () => {
    renderWithProviders(<ApplicantTravelForm />);

    const submitButton = screen.getByRole("button", { name: /Save and Continue/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("Error: Select a visa category".slice(7))).toHaveLength(2);
      expect(screen.getAllByText("Error: Select a visa category".slice(7))[0]).toHaveAttribute(
        "aria-label",
        "Error: Select a visa category",
      );
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ApplicantTravelForm />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to tracker", () => {
    renderWithProviders(<TravelDetailsPage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });
});
