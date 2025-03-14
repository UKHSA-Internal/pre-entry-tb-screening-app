import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

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

describe("ApplicantTravelForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantTravelForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantTravelForm />
      </Router>,
    );

    const user = userEvent.setup();

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "Government Sponsored" },
    });
    await user.type(screen.getByTestId("address-1"), "Edinburgh Castle, Castlehill");
    await user.type(screen.getByTestId("town-or-city"), "Edinburgh");
    await user.type(screen.getByTestId("postcode"), "EH1 2NG");
    await user.type(screen.getByTestId("mobile-number"), "07321900900");
    await user.type(screen.getByTestId("email"), "sigmund.sigmundson@asgard.gov");

    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Government Sponsored");
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
      status: "Incomplete",
      townOrCity: "Edinburgh",
      ukEmail: "sigmund.sigmundson@asgard.gov",
      ukMobileNumber: "07321900900",
      visaType: "Government Sponsored",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/travel-summary");
  });

  it("errors when travel details are missing", async () => {
    renderWithProviders(
      <Router>
        <ApplicantTravelForm />
      </Router>,
    );

    const submitButton = screen.getByRole("button", { name: /Save and Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Select a visa type",
      "Error: Enter address line 1, typically the building and street",
      "Error: Enter town or city",
      "Error: Enter full UK postcode",
      "Error: Enter UK mobile number",
      "Error: Enter UK email address",
    ];

    errorMessages.forEach((error) => {
      expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
      expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
    });
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(
      <Router>
        <ApplicantTravelForm />
      </Router>,
    );
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveFocus();
  });
});
