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
  underElevenConditions: ["Not applicable - applicant is aged 11 or over"],
  underElevenConditionsDetail: "",
  chestXrayTaken: YesOrNo.YES,
  reasonXrayNotRequired: "",
  completionDate: { year: "2025", month: "5", day: "31" },
};

const applicationState = { applicationId: "abc-123", dateCreated: "" };

const applicantState = {
  status: ApplicationStatus.COMPLETE,
  fullName: "Full Name",
  sex: "",
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
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("state is displayed correctly & user is navigated to confirmation page when medical details are posted successfully", async () => {
    vi.setSystemTime("2030-01-31T00:00:00Z");
    renderWithProviders(<MedicalScreeningReview />, { preloadedState });
    const user = userEvent.setup();

    mock.onPost("/application/abc-123/medical-screening").reply(200);

    expect(screen.getAllByRole("term")[0]).toHaveTextContent("Age");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("50");
    expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of medical screening");
    expect(screen.getAllByRole("definition")[1]).toHaveTextContent("31 May 2025");
    expect(screen.getAllByRole("term")[2]).toHaveTextContent(
      "Does the visa applicant have pulmonary TB symptoms?",
    );
    expect(screen.getAllByRole("definition")[3]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[3]).toHaveTextContent("If yes, which pulmonary TB symptoms");
    expect(screen.getAllByRole("definition")[5]).toHaveTextContent("Cough, Night sweats");
    expect(screen.getAllByRole("term")[4]).toHaveTextContent("Give further details (optional)");
    expect(screen.getAllByRole("definition")[7]).toHaveTextContent("Not provided");
    expect(screen.getAllByRole("term")[5]).toHaveTextContent("Medical history for under 11");
    expect(screen.getAllByRole("definition")[9]).toHaveTextContent(
      "Not applicable - applicant is aged 11 or over",
    );
    expect(screen.getAllByRole("term")[6]).toHaveTextContent("Give further details (optional)");
    expect(screen.getAllByRole("definition")[11]).toHaveTextContent("Not provided");
    expect(screen.getAllByRole("term")[7]).toHaveTextContent(
      "Has the visa applicant had pulmonary TB?",
    );
    expect(screen.getAllByRole("definition")[13]).toHaveTextContent("Yes");
    expect(screen.getAllByRole("term")[8]).toHaveTextContent("If yes, give details (optional)");
    expect(screen.getAllByRole("definition")[15]).toHaveTextContent(
      "Details of previous pulmonary TB.",
    );
    expect(screen.getAllByRole("term")[9]).toHaveTextContent(
      "Has the visa applicant had close contact with a person with active pulmonary TB in the past year?",
    );
    expect(screen.getAllByRole("definition")[19]).toHaveTextContent("Not provided");
    expect(screen.getAllByRole("term")[10]).toHaveTextContent("If yes, give details");
    expect(screen.getAllByRole("term")[11]).toHaveTextContent("Is the visa applicant pregnant?");
    expect(screen.getAllByRole("definition")[21]).toHaveTextContent("Do not know");
    expect(screen.getAllByRole("term")[12]).toHaveTextContent(
      "Does the visa applicant have menstrual periods?",
    );
    expect(screen.getAllByRole("definition")[23]).toHaveTextContent("No");
    expect(screen.getAllByRole("term")[13]).toHaveTextContent("Physical examination notes");
    expect(screen.getAllByRole("definition")[25]).toHaveTextContent(
      "Details of physical examination.",
    );

    await user.click(screen.getByRole("button"));

    expect(mock.history[0].url).toEqual("/application/abc-123/medical-screening");
    expect(mock.history).toHaveLength(1);
    expect(useNavigateMock).toHaveBeenLastCalledWith("/medical-history-tb-symptoms-confirmed");
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

  test("back link points to medical screening form page status is not complete", () => {
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
