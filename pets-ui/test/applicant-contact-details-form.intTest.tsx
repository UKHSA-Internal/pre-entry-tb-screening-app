import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import * as api from "@/api/api";
import ApplicantContactDetailsPage from "@/pages/applicant-contact-details";
import ApplicantContactDetailsForm from "@/sections/applicant-contact-details-form";
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
  applicant: {
    status: ApplicationStatus.IN_PROGRESS,
    fullName: "Sigmund Sigmundson",
    sex: "Male",
    dateOfBirth: {
      year: "1901",
      month: "1",
      day: "1",
    },
    countryOfNationality: "NOR",
    passportNumber: "1234",
    countryOfIssue: "FIN",
    passportIssueDate: {
      year: "1902",
      month: "2",
      day: "2",
    },
    passportExpiryDate: {
      year: "2053",
      month: "3",
      day: "3",
    },
    applicantHomeAddress1: "",
    applicantHomeAddress2: "",
    applicantHomeAddress3: "",
    townOrCity: "",
    provinceOrState: "",
    country: "",
    postcode: "",
    applicantPhotoFileName: "",
  },
};

describe("ApplicantContactDetailsForm", () => {
  beforeEach(() => {
    useNavigateMock.mockClear();
  });

  const user = userEvent.setup();

  it("when ApplicantContactDetailsForm is not filled then errors are displayed", async () => {
    renderWithProviders(<ApplicantContactDetailsForm />);

    const submitButton = screen.getByRole("button", { name: /continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Enter the first line of the applicant's home address",
      "Error: Enter the town or city of the applicant's home address",
      "Error: Enter the province or state of the applicant's home address",
      "Error: Enter the country of the applicant's home address",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("when ApplicantContactDetailsForm is filled correctly then state is updated and user is navigated to summary page", async () => {
    const { store } = renderWithProviders(<ApplicantContactDetailsForm />, { preloadedState });

    await user.type(screen.getByTestId("address-1"), "The Bell Tower");
    await user.type(screen.getByTestId("address-2"), "Hallgrimskirkja");
    await user.type(screen.getByTestId("address-3"), "Hallgrimstorg 1");
    await user.type(screen.getByTestId("town-or-city"), "Reykjavik");
    await user.type(screen.getByTestId("province-or-state"), "Reykjavik");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "ISL" } });
    await user.type(screen.getByTestId("postcode"), "101");

    expect(screen.getByTestId("address-1")).toHaveValue("The Bell Tower");
    expect(screen.getByTestId("address-2")).toHaveValue("Hallgrimskirkja");
    expect(screen.getByTestId("address-3")).toHaveValue("Hallgrimstorg 1");
    expect(screen.getByTestId("town-or-city")).toHaveValue("Reykjavik");
    expect(screen.getByTestId("province-or-state")).toHaveValue("Reykjavik");
    expect(screen.getByRole("combobox")).toHaveValue("ISL");
    expect(screen.getByTestId("postcode")).toHaveValue("101");

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant).toEqual({
      status: "In progress",
      fullName: "Sigmund Sigmundson",
      sex: "Male",
      dateOfBirth: { day: "1", month: "1", year: "1901" },
      countryOfNationality: "NOR",
      passportNumber: "1234",
      countryOfIssue: "FIN",
      passportIssueDate: { day: "2", month: "2", year: "1902" },
      passportExpiryDate: { day: "3", month: "3", year: "2053" },
      applicantHomeAddress1: "The Bell Tower",
      applicantHomeAddress2: "Hallgrimskirkja",
      applicantHomeAddress3: "Hallgrimstorg 1",
      townOrCity: "Reykjavik",
      provinceOrState: "Reykjavik",
      country: "ISL",
      postcode: "101",
      applicantPhotoFileName: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/upload-visa-applicant-photo");
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ApplicantContactDetailsForm />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to applicant passport details page", () => {
    renderWithProviders(<ApplicantContactDetailsPage />);
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/visa-applicant-passport-information");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("back link points to TB summary when applicant status is COMPLETE", () => {
    const completeState = {
      ...preloadedState,
      applicant: {
        ...preloadedState.applicant,
        status: ApplicationStatus.COMPLETE,
      },
    };
    window.history.pushState({}, "", "/?from=tb-certificate-summary");
    renderWithProviders(<ApplicantContactDetailsPage />, { preloadedState: completeState });
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("href", "/tb-certificate-summary");
  });

  it("preserves applicantPhotoFileName when updating form data", async () => {
    const stateWithPhoto = {
      ...preloadedState,
      applicant: {
        ...preloadedState.applicant,
        applicantPhotoFileName: "test-photo.jpg",
      },
    };
    const { store } = renderWithProviders(<ApplicantContactDetailsForm />, {
      preloadedState: stateWithPhoto,
    });

    await user.type(screen.getByTestId("address-1"), "1 Street");
    await user.type(screen.getByTestId("town-or-city"), "London");
    await user.type(screen.getByTestId("province-or-state"), "London");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "GBR" } });

    await user.click(screen.getByRole("button"));

    expect(store.getState().applicant.applicantPhotoFileName).toBe("test-photo.jpg");
  });

  it("updates slice and navigates to TB summary when editing in COMPLETE status", async () => {
    vi.spyOn(api, "putApplicantDetails").mockResolvedValue({
      status: 200,
      statusText: "OK",
    });
    const completeState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "John Smith",
        sex: "Male",
        dateOfBirth: { year: "1970", month: "1", day: "1" },
        countryOfNationality: "GBR",
        passportNumber: "12345",
        countryOfIssue: "GBR",
        passportIssueDate: { year: "2020", month: "1", day: "1" },
        passportExpiryDate: { year: "2030", month: "1", day: "1" },
        applicantHomeAddress1: "1 Street",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "London",
        provinceOrState: "London",
        country: "GBR",
        postcode: "0000 111",
        applicantPhotoFileName: "photo.jpg",
      },
    };
    window.history.pushState(
      {},
      "",
      "/visa-applicant-passport-information?from=tb-certificate-summary#name",
    );
    const { store } = renderWithProviders(<ApplicantContactDetailsForm />, {
      preloadedState: completeState,
    });

    await user.clear(screen.getByTestId("address-1"));
    await user.type(screen.getByTestId("address-1"), "New Road");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(store.getState().applicant.applicantHomeAddress1).toBe("New Road");
      expect(store.getState().applicant.status).toBe(ApplicationStatus.COMPLETE);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-summary");
    });
  });
});
