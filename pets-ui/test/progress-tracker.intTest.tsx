import { screen, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import React from "react";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import ProgressTrackerPage from "@/pages/progress-tracker";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();

let originalCreateObjectURL: typeof URL.createObjectURL;

beforeAll(() => {
  originalCreateObjectURL = global.URL.createObjectURL?.bind(global.URL);
  global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test-photo.jpg");
});
afterAll(() => {
  global.URL.createObjectURL = originalCreateObjectURL;
});
vi.mock("@/context/applicantPhotoContext", async () => {
  const actual = await import("@/context/applicantPhotoContext");
  return {
    ...actual,
  };
});

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

export const handlers = [];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

const travelSlice = {
  applicantUkAddress1: "address-1",
  applicantUkAddress2: "address-2",
  postcode: "P0 STC0DE",
  townOrCity: "Town",
  ukEmail: "email.email@com",
  ukMobileNumber: "07321900900",
  visaCategory: "Government Sponsored",
};

const medicalScreeningSlice = {
  age: "99",
  closeContactWithTb: "No",
  closeContactWithTbDetail: "",
  menstrualPeriods: "No",
  otherSymptomsDetail: "",
  physicalExamNotes: "Details of physical examination.",
  pregnant: "Don't know",
  previousTb: "Yes",
  previousTbDetail: "Details of previous TB.",
  tbSymptoms: "Yes",
  tbSymptomsList: ["Cough", "Night sweats"],
  underElevenConditions: ["Not applicable - applicant is aged 11 or over"],
  underElevenConditionsDetail: "",
  chestXrayTaken: YesOrNo.YES,
  reasonXrayNotRequired: "",
  completionDate: { year: "", month: "", day: "" },
};

const chestXraySlice = {
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  dateXrayTaken: { year: "", month: "", day: "" },
  lateralDecubitusXrayFile: "",
  completionDate: { year: "", month: "", day: "" },
};

const radiologicalOutcomeSlice = {
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  completionDate: { year: "", month: "", day: "" },
};

const tbCertSlice = {
  isIssued: YesOrNo.YES,
  comments: "Extra Details",
  certificateDate: {
    year: "2025",
    month: "3",
    day: "25",
  },
  certificateNumber: "12345",
  declaringPhysicianName: "Test Testov",
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

const incompleteState = {
  applicant: {
    status: ApplicationStatus.NOT_YET_STARTED,
    fullName: "Reginald Backwaters",
    sex: "",
    dateOfBirth: {
      year: "1970",
      month: "12",
      day: "31",
    },
    countryOfNationality: "",
    passportNumber: "12345",
    countryOfIssue: "",
    passportIssueDate: {
      year: "",
      month: "",
      day: "",
    },
    passportExpiryDate: {
      year: "",
      month: "",
      day: "",
    },
    applicantHomeAddress1: "",
    applicantHomeAddress2: "",
    applicantHomeAddress3: "",
    townOrCity: "",
    provinceOrState: "",
    country: "",
    postcode: "",
  },
  travel: { status: ApplicationStatus.NOT_YET_STARTED, ...travelSlice },
  medicalScreening: { status: ApplicationStatus.NOT_YET_STARTED, ...medicalScreeningSlice },
  chestXray: { status: ApplicationStatus.IN_PROGRESS, ...chestXraySlice },
  radiologicalOutcome: { status: ApplicationStatus.NOT_YET_STARTED, ...radiologicalOutcomeSlice },
  sputumDecision: {
    status: ApplicationStatus.NOT_YET_STARTED,
    isSputumRequired: YesOrNo.NULL,
    completionDate: { year: "", month: "", day: "" },
  },
  tbCertificate: { status: ApplicationStatus.NOT_YET_STARTED, ...tbCertSlice },
};

const completeState = {
  applicant: {
    status: ApplicationStatus.COMPLETE,
    fullName: "Chelsea Cummerbund",
    sex: "",
    dateOfBirth: {
      year: "1971",
      month: "11",
      day: "30",
    },
    countryOfNationality: "",
    passportNumber: "54321",
    countryOfIssue: "",
    passportIssueDate: {
      year: "",
      month: "",
      day: "",
    },
    passportExpiryDate: {
      year: "",
      month: "",
      day: "",
    },
    applicantHomeAddress1: "",
    applicantHomeAddress2: "",
    applicantHomeAddress3: "",
    townOrCity: "",
    provinceOrState: "",
    country: "",
    postcode: "",
  },
  travel: { status: ApplicationStatus.COMPLETE, ...travelSlice },
  medicalScreening: { status: ApplicationStatus.COMPLETE, ...medicalScreeningSlice },
  chestXray: { status: ApplicationStatus.COMPLETE, ...chestXraySlice },
  radiologicalOutcome: {
    status: ApplicationStatus.COMPLETE,
    ...radiologicalOutcomeSlice,
  },
  sputumDecision: {
    status: ApplicationStatus.COMPLETE,
    isSputumRequired: YesOrNo.NO,
    completionDate: { year: "2025", month: "01", day: "15" },
  },
  tbCertificate: { status: ApplicationStatus.COMPLETE, ...tbCertSlice },
};

test("Progress tracker page displays incomplete application sections correctly & links to applicant details form", () => {
  renderWithProviders(
    <ApplicantPhotoProvider>
      <ProgressTrackerPage />
    </ApplicantPhotoProvider>,
    { preloadedState: incompleteState },
  );

  expect(screen.getAllByText("Complete UK pre-entry health screening")).toHaveLength(2);

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Reginald Backwaters");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of birth");
  expect(screen.getAllByRole("definition")[1]).toHaveTextContent("31/12/1970");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("Passport number");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("12345");

  const applicantDetailsLink = screen.getByRole("link", { name: /Visa applicant details/i });
  expect(applicantDetailsLink).toHaveAttribute("href", "/enter-applicant-information");
  const applicantDetailsListItem = applicantDetailsLink.closest("li");
  expect(applicantDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(applicantDetailsListItem as HTMLElement).getByText("Not yet started"));

  const travelDetailsText = screen.getByText(/Travel information/i);
  const travelDetailsListItem = travelDetailsText.closest("li");
  expect(travelDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(travelDetailsListItem as HTMLElement).getByText("Not yet started"));

  const medicalScreeningText = screen.getByText(/Medical history and TB symptoms/i);
  const medicalScreeningListItem = medicalScreeningText.closest("li");
  expect(medicalScreeningListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(medicalScreeningListItem as HTMLElement).getByText("Not yet started"));

  const chestXrayText = screen.getByText(/Upload chest X-ray images/i);
  const chestXrayListItem = chestXrayText.closest("li");
  expect(chestXrayListItem).toHaveClass("govuk-task-list__item govuk-task-list__item--with-link");
  expect(within(medicalScreeningListItem as HTMLElement).getByText("Not yet started"));

  const radiologicalOutcomeText = screen.getByText(/Radiological outcome/i);
  const radiologicalOutcomeListItem = radiologicalOutcomeText.closest("li");
  expect(radiologicalOutcomeListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(radiologicalOutcomeListItem as HTMLElement).getByText("Not yet started"));

  const tbCertificateText = screen.getByText(/TB certificate outcome/i);
  const tbCertificateListItem = tbCertificateText.closest("li");
  expect(tbCertificateListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(tbCertificateListItem as HTMLElement).getByText("Not yet started"));

  const searchLink = screen.getByRole("link", { name: /Search for another visa applicant/i });
  expect(searchLink).toHaveAttribute("href", "/search-for-visa-applicant");
});

test("Progress tracker page displays complete application sections correctly, links to summary page, and displays applicant photo from context", async () => {
  const mockPhotoUrl = "http://localhost/test-photo.jpg";
  const SetPhoto: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setApplicantPhotoUrl } = useApplicantPhoto();
    React.useEffect(() => {
      setApplicantPhotoUrl(mockPhotoUrl);
    }, [setApplicantPhotoUrl]);
    return <>{children}</>;
  };

  renderWithProviders(
    <ApplicantPhotoProvider>
      <SetPhoto>
        <ProgressTrackerPage />
      </SetPhoto>
    </ApplicantPhotoProvider>,
    { preloadedState: completeState },
  );

  expect(screen.getAllByText("Complete UK pre-entry health screening")).toHaveLength(2);

  expect(screen.getAllByRole("term")[0]).toHaveTextContent("Name");
  expect(screen.getAllByRole("definition")[0]).toHaveTextContent("Chelsea Cummerbund");
  expect(screen.getAllByRole("term")[1]).toHaveTextContent("Date of birth");
  expect(screen.getAllByRole("definition")[1]).toHaveTextContent("30/11/1971");
  expect(screen.getAllByRole("term")[2]).toHaveTextContent("Passport number");
  expect(screen.getAllByRole("definition")[2]).toHaveTextContent("54321");

  const applicantDetailsLink = screen.getByRole("link", { name: /Visa applicant details/i });
  expect(applicantDetailsLink).toHaveAttribute("href", "/check-applicant-details");
  const applicantDetailsListItem = applicantDetailsLink.closest("li");
  expect(applicantDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(applicantDetailsListItem as HTMLElement).getByText("Completed"));

  const travelDetailsLink = screen.getByRole("link", { name: /Travel information/i });
  expect(travelDetailsLink).toHaveAttribute("href", "/check-travel-information");
  const travelDetailsListItem = travelDetailsLink.closest("li");
  expect(travelDetailsListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(travelDetailsListItem as HTMLElement).getByText("Completed"));

  const medicalScreeningLink = screen.getByRole("link", {
    name: /Medical history and TB symptoms/i,
  });
  expect(medicalScreeningLink).toHaveAttribute("href", "/check-medical-screening");
  const medicalScreeningListItem = medicalScreeningLink.closest("li");
  expect(medicalScreeningListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(medicalScreeningListItem as HTMLElement).getByText("Completed"));

  const chestXrayLink = screen.getByRole("link", { name: /Upload chest X-ray images/i });
  expect(chestXrayLink).toHaveAttribute("href", "/check-chest-x-ray-images");
  const chestXrayListItem = chestXrayLink.closest("li");
  expect(chestXrayListItem).toHaveClass("govuk-task-list__item govuk-task-list__item--with-link");
  expect(within(chestXrayListItem as HTMLElement).getByText("Completed"));

  const radiologicalOutcomeLink = screen.getByRole("link", { name: /Radiological outcome/i });
  expect(radiologicalOutcomeLink).toHaveAttribute("href", "/check-chest-x-ray-results-findings");
  const radiologicalOutcomeListItem = radiologicalOutcomeLink.closest("li");
  expect(radiologicalOutcomeListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(radiologicalOutcomeListItem as HTMLElement).getByText("Completed"));

  const tbCertificateLink = screen.getByRole("link", { name: /TB certificate outcome/i });
  expect(tbCertificateLink).toHaveAttribute("href", "/tb-screening-complete");
  const tbCertificateListItem = tbCertificateLink.closest("li");
  expect(tbCertificateListItem).toHaveClass(
    "govuk-task-list__item govuk-task-list__item--with-link",
  );
  expect(within(tbCertificateListItem as HTMLElement).getByText("Certificate issued"));
  const img = await screen.findByAltText(/applicant/i);
  expect(img).toBeInTheDocument();

  const searchLink = screen.getByRole("link", { name: /Search for another visa applicant/i });
  expect(searchLink).toHaveAttribute("href", "/search-for-visa-applicant");
});
