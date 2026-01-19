import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import MedicalSummaryPage from "@/pages/medical-screening-summary";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
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

const medicalScreeningState = {
  status: ApplicationStatus.NOT_YET_STARTED,
  age: "99",
  closeContactWithTb: "No",
  closeContactWithTbDetail: "",
  menstrualPeriods: "No",
  otherSymptomsDetail: "",
  physicalExamNotes: "Details of physical examination.",
  pregnant: "Do not know",
  previousTb: "Yes",
  previousTbDetail: "Details of previous pulmonary TB.",
  tbSymptoms: "Yes",
  tbSymptomsList: ["Cough", "Night sweats"],
  underElevenConditions: ["U11 condition 1", "U11 condition 2"],
  underElevenConditionsDetail: "U11 medical history details",
  chestXrayTaken: YesOrNo.YES,
  reasonXrayNotRequired: "",
  completionDate: { year: "2025", month: "1", day: "1" },
};

const applicationState = { applicationId: "abc-123", dateCreated: "" };

const applicantState = {
  status: ApplicationStatus.COMPLETE,
  fullName: "Full Name",
  sex: "Male",
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

const femaleApplicantState = { ...applicantState, sex: "Female" };
const maleU11ApplicantState = {
  ...applicantState,
  dateOfBirth: { year: "2015", month: "1", day: "1" },
};
const femaleU11ApplicantState = {
  ...applicantState,
  sex: "Female",
  dateOfBirth: { year: "2015", month: "1", day: "1" },
};

const tbCertificateState = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isIssued: YesOrNo.NO,
  comments: "",
  certificateDate: {
    year: "",
    month: "",
    day: "",
  },
  certificateNumber: "",
  declaringPhysicianName: "",
  clinic: {
    clinicId: "UK/LHR/00",
    name: "PETS Test Clinic",
    city: "London",
    country: "GBR",
    startDate: "2025-04-01",
    endDate: null,
    createdBy: "tmp@email.com",
  },
};

const preloadedState = {
  medicalScreening: { ...medicalScreeningState },
  application: { ...applicationState },
  applicant: { ...applicantState },
  tbCertificate: { ...tbCertificateState },
};

describe("MedicalScreeningReview", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
    vi.setSystemTime("2025-01-31T00:00:00Z");
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("state is displayed correctly with all u11/female fields & user is navigated to confirmation page when medical details are posted successfully", async () => {
    const femaleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...femaleU11ApplicantState },
    };

    renderWithProviders(<MedicalScreeningReview />, { preloadedState: femaleU11PreloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/medical-screening").reply(200);

    const terms = screen.getAllByRole("term");
    const termTexts = [...terms].map((term) => term.textContent?.trim() ?? "");

    expect(termTexts).toEqual([
      "Age",
      "Date of medical screening",
      "Does the visa applicant have pulmonary TB symptoms?",
      "If yes, which pulmonary TB symptoms",
      "Give further details (optional)",
      "Has the visa applicant had pulmonary TB?",
      "If yes, give details (optional)",
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
      "If yes, give details",
      "Physical examination notes (optional)",
      "Medical history for under 11",
      "Give further details (optional)",
      "Is the visa applicant pregnant?",
      "Does the visa applicant have menstrual periods?",
      "Is an X-ray required?",
    ]);

    const definitions = screen.getAllByRole("definition");
    const definitionTexts = [...definitions].map((term) => term.textContent?.trim() ?? "");

    expect(definitionTexts).toEqual([
      "10 years old",
      "1 January 2025",
      "Change date of medical screening",
      "Yes",
      "Change whether the visa applicant has pulmonary TB symptoms",
      "Cough, Night sweats",
      "Change pulmonary TB symptoms",
      "Not provided",
      "Change further details of pulmonary TB symptoms (optional)",
      "Yes",
      "Change whether the visa applicant has had pulmonary TB",
      "Details of previous pulmonary TB.",
      "Change details of visa applicant's previous pulmonary TB",
      "No",
      "Change whether the visa applicant has had close contact with active pulmonary TB in the past year",
      "Not provided",
      "Change details of visa applicant's close contact with a person with pulmonary TB in the past year",
      "Details of physical examination.",
      "Change physical examination notes (optional)",
      "U11 condition 1, U11 condition 2",
      "Change medical history for under 11",
      "U11 medical history details",
      "Change further details of medical history for under 11 (optional)",
      "Do not know",
      "Change whether the visa applicant is pregnant",
      "No",
      "Change whether the visa applicant has menstrual periods",
      "Yes",
      "Change whether an X-ray is required",
    ]);

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application/abc-123/medical-screening");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-symptoms-medical-history-confirmed");
  });

  test("only relevant fields are shown for under 11 male applicant", () => {
    const maleU11PreloadedState = {
      ...preloadedState,
      applicant: { ...maleU11ApplicantState },
    };

    renderWithProviders(<MedicalScreeningReview />, { preloadedState: maleU11PreloadedState });

    expect(screen.queryByText("Medical history for under 11")).toBeTruthy();
    expect(screen.queryByText("Is the visa applicant pregnant?")).toBeNull();
    expect(screen.queryByText("Does the visa applicant have menstrual periods?")).toBeNull();
  });

  test("only relevant fields are shown for over 11 female applicant", () => {
    const femalePreloadedState = {
      ...preloadedState,
      applicant: { ...femaleApplicantState },
    };

    renderWithProviders(<MedicalScreeningReview />, { preloadedState: femalePreloadedState });

    expect(screen.queryByText("Medical history for under 11")).toBeNull();
    expect(screen.queryByText("Is the visa applicant pregnant?")).toBeTruthy();
    expect(screen.queryByText("Does the visa applicant have menstrual periods?")).toBeTruthy();
  });

  test("only relevant fields are shown for over 11 male applicant", () => {
    renderWithProviders(<MedicalScreeningReview />, { preloadedState });

    expect(screen.queryByText("Medical history for under 11")).toBeNull();
    expect(screen.queryByText("Is the visa applicant pregnant?")).toBeNull();
    expect(screen.queryByText("Does the visa applicant have menstrual periods?")).toBeNull();
  });

  test("user is navigated to error page when api call is unsuccessful", async () => {
    renderWithProviders(<MedicalScreeningReview />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/medical-screening").reply(500);

    await user.click(screen.getAllByRole("button")[0]);

    expect(mock.history[0].url).toEqual("/application/abc-123/medical-screening");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      medicalScreening: {
        status: ApplicationStatus.COMPLETE,
        age: "",
        tbSymptoms: "",
        tbSymptomsList: [],
        otherSymptomsDetail: "",
        underElevenConditions: [],
        underElevenConditionsDetail: "",
        previousTb: "",
        previousTbDetail: "",
        closeContactWithTb: "",
        closeContactWithTbDetail: "",
        pregnant: "",
        menstrualPeriods: "",
        physicalExamNotes: "",
        chestXrayTaken: YesOrNo.YES,
        reasonXrayNotRequired: "",
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(<MedicalSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to cxr question page when status is not complete", () => {
    const preloadedState = {
      medicalScreening: {
        status: ApplicationStatus.IN_PROGRESS,
        age: "",
        tbSymptoms: "",
        tbSymptomsList: [],
        otherSymptomsDetail: "",
        underElevenConditions: [],
        underElevenConditionsDetail: "",
        previousTb: "",
        previousTbDetail: "",
        closeContactWithTb: "",
        closeContactWithTbDetail: "",
        pregnant: "",
        menstrualPeriods: "",
        physicalExamNotes: "",
        chestXrayTaken: YesOrNo.NULL,
        reasonXrayNotRequired: "",
        completionDate: { year: "", month: "", day: "" },
      },
    };

    renderWithProviders(<MedicalSummaryPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/is-an-x-ray-required");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("displays reason X-ray is not required when X-ray is not taken", () => {
    const preloadedState = {
      medicalScreening: {
        ...medicalScreeningState,
        chestXrayTaken: YesOrNo.NO,
        reasonXrayNotRequired: "Child",
      },
      application: { ...applicationState },
      applicant: { ...applicantState },
      tbCertificate: { ...tbCertificateState },
    };

    renderWithProviders(<MedicalScreeningReview />, { preloadedState });

    expect(screen.getByText("Reason X-ray is not required")).toBeInTheDocument();
    expect(screen.getByText("Child (under 11 years)")).toBeInTheDocument();
  });

  test("displays other reason X-ray is not required when reason is 'Other' with further details", () => {
    const preloadedState = {
      medicalScreening: {
        ...medicalScreeningState,
        chestXrayTaken: YesOrNo.NO,
        reasonXrayNotRequired: "Other",
        reasonXrayNotRequiredFurtherDetails: "Test reason for not taking X-ray",
      },
      application: { ...applicationState },
      applicant: { ...applicantState },
      tbCertificate: { ...tbCertificateState },
    };

    renderWithProviders(<MedicalScreeningReview />, { preloadedState });

    expect(screen.getByText("Reason X-ray is not required")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
    expect(screen.getByText("Other reason X-ray is not required")).toBeInTheDocument();
    expect(screen.getByText("Test reason for not taking X-ray")).toBeInTheDocument();
  });
});
