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

  test("when ApplicantTravelForm is not filled then errors are displayed", async () => {
    renderWithProviders(
      <Router>
        <ApplicantTravelForm />
      </Router>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(screen.getAllByText("Select a visa type.")).toHaveLength(2);
    expect(
      screen.getAllByText("Enter address line 1, typically the building and street."),
    ).toHaveLength(2);
    expect(screen.getAllByText("Enter town or city.")).toHaveLength(2);
    expect(screen.getAllByText("Enter full UK postcode.")).toHaveLength(2);
    expect(screen.getAllByText("Enter UK mobile number.")).toHaveLength(2);
    expect(screen.getAllByText("Enter UK email address.")).toHaveLength(2);
  });

  test("when ApplicantTravelForm is filled correctly then state is updated and user is navigated to summary page", async () => {
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
});
