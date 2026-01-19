import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import MedicalScreeningU11Page from "@/pages/medical-screening-u11";
import MedicalScreeningFormU11Qs from "@/sections/medical-screening-form-u11-qs";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
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

const applicantState = {
  status: ApplicationStatus.COMPLETE,
  fullName: "Full Name",
  sex: "Male",
  dateOfBirth: { year: "2015", month: "1", day: "1" },
  countryOfNationality: "",
  passportNumber: "0987",
  countryOfIssue: "",
  passportIssueDate: { year: "", month: "", day: "" },
  passportExpiryDate: { year: "", month: "", day: "" },
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  townOrCity: "",
  provinceOrState: "",
  country: "",
  postcode: "",
};

const femaleU11ApplicantState = {
  ...applicantState,
  sex: "Female",
};

const medicalScreeningState = {
  age: "",
  chestXrayTaken: YesOrNo.NULL,
  closeContactWithTb: "No",
  closeContactWithTbDetail: "",
  completionDate: {
    day: "31",
    month: "01",
    year: "2025",
  },
  menstrualPeriods: "",
  otherSymptomsDetail: "",
  physicalExamNotes: "Details of physical examination.",
  pregnant: "",
  previousTb: "Yes",
  previousTbDetail: "Details of previous pulmonary TB.",
  reasonXrayNotRequired: "",
  reasonXrayNotRequiredFurtherDetails: "",
  status: ApplicationStatus.IN_PROGRESS,
  tbSymptoms: "Yes",
  tbSymptomsList: ["Cough", "Night sweats"],
  underElevenConditions: [],
  underElevenConditionsDetail: "",
};

const preloadedState = {
  applicant: { ...applicantState },
  medicalScreening: { ...medicalScreeningState },
};

describe("MedicalScreeningFormU11Qs", () => {
  beforeEach(() => {
    vi.setSystemTime("2025-01-31T00:00:00Z");
    useNavigateMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  const user = userEvent.setup();

  it("when MedicalScreeningFormU11Qs is filled correctly then state is updated and user is navigated to xray question page", async () => {
    const { store } = renderWithProviders(<MedicalScreeningFormU11Qs />, { preloadedState });

    const user = userEvent.setup();

    await user.click(screen.getAllByTestId("under-eleven-conditions")[4]);

    expect(screen.getAllByTestId("under-eleven-conditions")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[2]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[3]).not.toBeChecked();
    expect(screen.getAllByTestId("under-eleven-conditions")[4]).toBeChecked();
    expect(screen.getByTestId("under-eleven-conditions-detail")).toHaveValue("");

    await user.click(screen.getByRole("button"));

    expect(store.getState().medicalScreening).toEqual({
      age: "",
      chestXrayTaken: "",
      closeContactWithTb: "No",
      closeContactWithTbDetail: "",
      completionDate: {
        day: "31",
        month: "01",
        year: "2025",
      },
      menstrualPeriods: "",
      otherSymptomsDetail: "",
      physicalExamNotes: "Details of physical examination.",
      pregnant: "",
      previousTb: "Yes",
      previousTbDetail: "Details of previous pulmonary TB.",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: "In progress",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough", "Night sweats"],
      underElevenConditions: ["None of these"],
      underElevenConditionsDetail: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/is-an-x-ray-required");
  });

  it("when MedicalScreeningFormU11Qs is submitted then user is navigated to female page when applicant is an under 11 female", async () => {
    const femaleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...femaleU11ApplicantState },
    };
    renderWithProviders(<MedicalScreeningFormU11Qs />, { preloadedState: femaleU11PreloadedState });

    const user = userEvent.setup();

    await user.click(screen.getAllByTestId("under-eleven-conditions")[4]);

    await user.click(screen.getByRole("button"));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-history-female");
  });

  it("errors for mandatory fields are rendered as expected", async () => {
    renderWithProviders(<MedicalScreeningFormU11Qs />);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    expect(screen.getAllByText(`Select all that apply, or select "None of these"`)).toHaveLength(2);
    expect(
      screen.getAllByText(`Select all that apply, or select "None of these"`)[0],
    ).toHaveAttribute("aria-label", `Error: Select all that apply, or select "None of these"`);
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<MedicalScreeningFormU11Qs />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to initial medical history page", () => {
    renderWithProviders(<MedicalScreeningU11Page />);

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/record-medical-history-tb-symptoms");
    expect(link).toHaveClass("govuk-back-link");
  });
});
