import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import TravelVisaCategoryPage from "@/pages/travel-visa-category";
import ApplicantTravelVisaCategory from "@/sections/applicant-travel-visa-category";
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

describe("ApplicantTravelForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantTravelForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantTravelVisaCategory />);

    const user = userEvent.setup();

    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "Family reunion" },
    });

    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Family reunion");

    await user.click(screen.getAllByRole("button")[0]);

    expect(store.getState().travel).toEqual({
      applicantUkAddress1: "",
      applicantUkAddress2: "",
      applicantUkAddress3: "",
      postcode: "",
      status: "In progress",
      townOrCity: "",
      ukEmail: "",
      ukMobileNumber: "",
      visaCategory: "Family reunion",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/visa-applicant-proposed-uk-address");
  });

  it("errors when travel details are missing", async () => {
    renderWithProviders(<ApplicantTravelVisaCategory />);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("Error: Select visa category".slice(7))).toHaveLength(3);
      expect(screen.getAllByText("Error: Select visa category".slice(7))[0]).toHaveAttribute(
        "aria-label",
        "Error: Select visa category",
      );
    });
  });

  it("renders an in focus error summary when continue button pressed but field not filled in", async () => {
    renderWithProviders(<ApplicantTravelVisaCategory />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to tracker", () => {
    renderWithProviders(<TravelVisaCategoryPage />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
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
    renderWithProviders(<TravelVisaCategoryPage />, { preloadedState: completeState });
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
    const { store } = renderWithProviders(<ApplicantTravelVisaCategory />, {
      preloadedState: completeState,
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Family reunion" } });
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().travel.visaCategory).toBe("Family reunion");
      expect(store.getState().travel.status).toBe(ApplicationStatus.COMPLETE);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-summary");
    });
  });
});
