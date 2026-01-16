import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock } from "vitest";

import MedicalScreeningFemalePage from "@/pages/medical-screening-female";
import MedicalScreeningFormFemaleQs from "@/sections/medical-screening-form-female-qs";
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
  sex: "Female",
  dateOfBirth: { year: "1979", month: "10", day: "20" },
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
  dateOfBirth: { year: "2015", month: "1", day: "1" },
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

const femaleU11MedicalScreeningState = {
  ...medicalScreeningState,
  underElevenConditions: ["None of these"],
};

const preloadedState = {
  applicant: { ...applicantState },
  medicalScreening: { ...medicalScreeningState },
};

describe("MedicalScreeningFormFemaleQs", () => {
  beforeEach(() => {
    vi.setSystemTime("2025-01-31T00:00:00Z");
    useNavigateMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  const user = userEvent.setup();

  it("when MedicalScreeningFormFemaleQs is filled correctly then state is updated and user is navigated to xray question page", async () => {
    const { store } = renderWithProviders(<MedicalScreeningFormFemaleQs />, { preloadedState });

    await user.click(screen.getAllByTestId("pregnant")[2]);
    await user.click(screen.getAllByTestId("menstrual-periods")[1]);

    expect(screen.getAllByTestId("pregnant")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[1]).not.toBeChecked();
    expect(screen.getAllByTestId("pregnant")[2]).toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[0]).not.toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[1]).toBeChecked();
    expect(screen.getAllByTestId("menstrual-periods")[2]).not.toBeChecked();

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
      menstrualPeriods: "No",
      otherSymptomsDetail: "",
      physicalExamNotes: "Details of physical examination.",
      pregnant: "Do not know",
      previousTb: "Yes",
      previousTbDetail: "Details of previous pulmonary TB.",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: "In progress",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough", "Night sweats"],
      underElevenConditions: [],
      underElevenConditionsDetail: "",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/is-an-x-ray-required");
  });

  it("errors for mandatory fields are rendered as expected", async () => {
    renderWithProviders(<MedicalScreeningFormFemaleQs />);

    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await user.click(submitButton);

    const errorMessages = [
      "Error: Select whether the visa applicant is pregnant",
      "Error: Select whether the visa applicant has menstrual periods",
    ];

    await waitFor(() => {
      errorMessages.forEach((error) => {
        expect(screen.getAllByText(error.slice(7))).toHaveLength(2);
        expect(screen.getAllByText(error.slice(7))[0]).toHaveAttribute("aria-label", error);
      });
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<MedicalScreeningFormFemaleQs />);
    await user.click(screen.getByRole("button"));
    const errorSummaryDiv = screen.getByTestId("error-summary");
    await waitFor(() => {
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("back link points to initial medical history page when applicant is over 11", () => {
    renderWithProviders(<MedicalScreeningFemalePage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/record-medical-history-tb-symptoms");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("back link points to under 11 medical history page when applicant is under 11", () => {
    const femaleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...femaleU11ApplicantState },
      medicalScreening: { ...femaleU11MedicalScreeningState },
    };
    renderWithProviders(<MedicalScreeningFemalePage />, {
      preloadedState: femaleU11PreloadedState,
    });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/medical-history-under-11-years-old");
    expect(link).toHaveClass("govuk-back-link");
  });
});
