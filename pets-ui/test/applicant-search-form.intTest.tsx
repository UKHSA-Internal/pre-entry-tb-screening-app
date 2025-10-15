import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import type { AppDispatch } from "@/redux/store";
import ApplicantSearchForm from "@/sections/applicant-search-form";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";

vi.mock("@/utils/clinic", () => ({
  fetchClinic: (dispatch: AppDispatch) => {
    dispatch({
      type: "tbCertificateDetails/setClinic",
      payload: {
        clinicId: "UK/LHR/00",
        name: "PETS Test Clinic",
        city: "London",
        country: "GBR",
        startDate: "2025-04-01",
        endDate: null,
        createdBy: "tmp@email.com",
      },
    });
  },
}));

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

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

const emptyApplicantSlice = {
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  country: "",
  countryOfIssue: "AUS",
  countryOfNationality: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: "",
  },
  fullName: "",
  passportExpiryDate: {
    day: "",
    month: "",
    year: "",
  },
  passportIssueDate: {
    day: "",
    month: "",
    year: "",
  },
  passportNumber: "12345",
  postcode: "",
  applicantPhotoFileName: "",
  provinceOrState: "",
  sex: "",
  status: "Not yet started",
  townOrCity: "",
};
const emptyTravelSlice = {
  applicantUkAddress1: "",
  applicantUkAddress2: "",
  applicantUkAddress3: "",
  postcode: "",
  status: "Not yet started",
  townOrCity: "",
  ukEmail: "",
  ukMobileNumber: "",
  visaCategory: "",
};
const emptyMedicalSlice = {
  age: "",
  chestXrayTaken: "",
  closeContactWithTb: "",
  closeContactWithTbDetail: "",
  completionDate: {
    year: "",
    month: "",
    day: "",
  },
  menstrualPeriods: "",
  otherSymptomsDetail: "",
  physicalExamNotes: "",
  pregnant: "",
  previousTb: "",
  previousTbDetail: "",
  reasonXrayNotRequired: "",
  reasonXrayNotRequiredFurtherDetails: "",
  status: "Not yet started",
  tbSymptoms: "",
  tbSymptomsList: [],
  underElevenConditions: [],
  underElevenConditionsDetail: "",
};
const emptyChestXraySlice = {
  status: ApplicationStatus.NOT_YET_STARTED,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  dateXrayTaken: {
    year: "",
    month: "",
    day: "",
  },
};
const emptyRadiologicalOutcomeSlice = {
  status: ApplicationStatus.NOT_YET_STARTED,
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  completionDate: {
    year: "",
    month: "",
    day: "",
  },
};

describe("ApplicantSearchForm", () => {
  let mock: MockAdapter;
  const originalFetch = global.fetch;
  const successfulFetchMock = vi.fn<typeof fetch>(function _successfulFetchMock(
    _input: RequestInfo | URL,
    _init?: RequestInit,
  ) {
    void _input;
    void _init;
    const blob = new Blob(["dummy"], { type: "image/jpeg" });
    return Promise.resolve(new Response(blob, { status: 200 }));
  });
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
    global.fetch = successfulFetchMock;
  });
  afterEach(() => {
    global.fetch = originalFetch;
    successfulFetchMock.mockClear();
  });

  test("store is correctly populated, applicant photo is handled, and user is navigated to tracker page when both api calls are successful", async () => {
    let contextUrl: string | null = null;
    const ContextChecker: React.FC = () => {
      const { applicantPhotoDataUrl } = useApplicantPhoto();
      React.useEffect(() => {
        contextUrl = applicantPhotoDataUrl;
      }, [applicantPhotoDataUrl]);
      return null;
    };

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ContextChecker />
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "1991-01-01",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "1992-02-02",
        expiryDate: "2053-03-03",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(200, {
      applicationId: "abc-123",
      applicantPhotoUrl: "http://localhost:4566/photos/photo.jpg",
      travelInformation: {
        ukAddressLine1: "99 Downing Street",
        ukAddressPostcode: "W1 1AS",
        status: "completed",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "Maxwell@Spiffington.com",
        ukMobileNumber: "071234567890",
        visaCategory: "Visitor",
      },
      medicalScreening: {
        applicationId: "abc-123",
        dateCreated: "2025-01-01",
        status: "completed",
        age: 43,
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "details1",
        haveMenstralPeriod: "No",
        historyOfConditionsUnder11: ["history1", "history2"],
        historyOfConditionsUnder11Details: "details2",
        historyOfPreviousTb: "No",
        physicalExaminationNotes: "Exam notes",
        pregnant: "N/A",
        previousTbDetails: "details3",
        symptoms: ["symptom1", "symptom2"],
        symptomsOfTb: "Yes",
        symptomsOther: "Other symptoms",
      },
      chestXray: {
        status: "completed",
        posteroAnteriorXrayFileName: "pa-file-name",
        posteroAnteriorXray: "pa-bucket",
        apicalLordoticXrayFileName: "al-file-name",
        apicalLordoticXray: "al-bucket",
        lateralDecubitusXrayFileName: "ld-file-name",
        lateralDecubitusXray: "ld-bucket",
        dateCreated: "2025-01-01",
        dateXrayTaken: "2024-12-31",
      },
      radiologicalOutcome: {
        status: "completed",
        chestXrayTaken: YesOrNo.YES,
        posteroAnteriorXrayFileName: "pa-file-name",
        posteroAnteriorXray: "pa-bucket",
        apicalLordoticXrayFileName: "al-file-name",
        apicalLordoticXray: "al-bucket",
        lateralDecubitusXrayFileName: "ld-file-name",
        lateralDecubitusXray: "ld-bucket",
        xrayResult: "normal",
        xrayResultDetail: "",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        dateCreated: "2025-01-01",
        isSputumRequired: YesOrNo.YES,
      },
      tbCertificate: {
        status: "completed",
        isIssued: "Yes",
        comments: "Comments",
        issueDate: "2025-01-01",
        certificateNumber: "XYZ789",
      },
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().application).toMatchObject({
      applicationId: "abc-123",
    });

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "01",
        month: "01",
        year: "1991",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "03",
        month: "03",
        year: "2053",
      },
      passportIssueDate: {
        day: "02",
        month: "02",
        year: "1992",
      },
      passportNumber: "12345",
      postcode: "",
      applicantPhotoFileName: "photo.jpg",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: ApplicationStatus.COMPLETE,
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual({
      applicantUkAddress1: "99 Downing Street",
      applicantUkAddress2: "",
      applicantUkAddress3: "",
      postcode: "W1 1AS",
      status: ApplicationStatus.COMPLETE,
      townOrCity: "London",
      ukEmail: "Maxwell@Spiffington.com",
      ukMobileNumber: "071234567890",
      visaCategory: "Visitor",
    });
    expect(store.getState().medicalScreening).toEqual({
      age: "43",
      chestXrayTaken: "",
      closeContactWithTb: "Yes",
      closeContactWithTbDetail: "details1",
      completionDate: {
        year: "2025",
        month: "01",
        day: "01",
      },
      menstrualPeriods: "No",
      otherSymptomsDetail: "Other symptoms",
      physicalExamNotes: "Exam notes",
      pregnant: "N/A",
      previousTb: "No",
      previousTbDetail: "details3",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: ApplicationStatus.COMPLETE,
      tbSymptoms: "Yes",
      tbSymptomsList: ["symptom1", "symptom2"],
      underElevenConditions: ["history1", "history2"],
      underElevenConditionsDetail: "details2",
    });
    expect(store.getState().chestXray).toEqual({
      status: ApplicationStatus.COMPLETE,
      posteroAnteriorXrayFileName: "pa-file-name",
      posteroAnteriorXrayFile: "pa-bucket",
      apicalLordoticXrayFileName: "al-file-name",
      apicalLordoticXrayFile: "al-bucket",
      lateralDecubitusXrayFileName: "ld-file-name",
      lateralDecubitusXrayFile: "ld-bucket",
      dateXrayTaken: {
        year: "2024",
        month: "12",
        day: "31",
      },
    });
    expect(store.getState().radiologicalOutcome).toEqual({
      status: ApplicationStatus.COMPLETE,
      reasonXrayWasNotTaken: "",
      xrayWasNotTakenFurtherDetails: "",
      xrayResult: "normal",
      xrayResultDetail: "",
      xrayMinorFindings: [],
      xrayAssociatedMinorFindings: [],
      xrayActiveTbFindings: [],
      completionDate: {
        year: "2025",
        month: "01",
        day: "01",
      },
    });
    expect(store.getState().tbCertificate).toEqual({
      status: ApplicationStatus.COMPLETE,
      isIssued: YesOrNo.YES,
      comments: "Comments",
      certificateDate: {
        day: "01",
        month: "01",
        year: "2025",
      },
      certificateNumber: "XYZ789",
      declaringPhysicianName: "",
      reasonNotIssued: "",
      clinic: {
        clinicId: "UK/LHR/00",
        name: "PETS Test Clinic",
        city: "London",
        country: "GBR",
        startDate: "2025-04-01",
        endDate: null,
        createdBy: "tmp@email.com",
      },
    });
    await waitFor(() => {
      expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
      expect(contextUrl).toBe("http://localhost:4566/photos/photo.jpg");
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
    });
  });

  test("store is correctly populated and user is navigated to error page when applicant search is successful & application search returns a non-200 response", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(403);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      applicantPhotoFileName: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);
    expect(store.getState().chestXray).toEqual(emptyChestXraySlice);
    expect(store.getState().radiologicalOutcome).toEqual(emptyRadiologicalOutcomeSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("store is correctly populated and user is navigated to error page when applicant search is successful & application search returns 500", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(500);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      applicantPhotoFileName: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);
    expect(store.getState().chestXray).toEqual(emptyChestXraySlice);
    expect(store.getState().radiologicalOutcome).toEqual(emptyRadiologicalOutcomeSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("store is correctly populated when timestamps are included in api response", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991T12:30:00Z",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992T05:15:00Z",
        expiryDate: "03-03-2053T23:45:00Z",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(200, {
      applicationId: "abc-123",
      applicantPhotoUrl: "",
      travelInformation: {
        ukAddressLine1: "99 Downing Street",
        ukAddressPostcode: "W1 1AS",
        status: "completed",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "Maxwell@Spiffington.com",
        ukMobileNumber: "071234567890",
        visaCategory: "Visitor",
      },
      medicalScreening: {
        applicationId: "abc-123",
        dateCreated: "2025-01-01T12:30:00Z",
        status: "completed",
        age: 43,
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "details1",
        haveMenstralPeriod: "No",
        historyOfConditionsUnder11: ["history1", "history2"],
        historyOfConditionsUnder11Details: "details2",
        historyOfPreviousTb: "No",
        physicalExaminationNotes: "Exam notes",
        pregnant: "N/A",
        previousTbDetails: "details3",
        symptoms: ["symptom1", "symptom2"],
        symptomsOfTb: "Yes",
        symptomsOther: "Other symptoms",
      },
      chestXray: {
        status: "completed",
        posteroAnteriorXrayFileName: "pa-file-name",
        posteroAnteriorXray: "pa-bucket",
        apicalLordoticXrayFileName: "al-file-name",
        apicalLordoticXray: "al-bucket",
        lateralDecubitusXrayFileName: "ld-file-name",
        lateralDecubitusXray: "ld-bucket",
        dateCreated: "2025-01-01T05:15:00Z",
        dateXrayTaken: "2024-12-31T05:15:00Z",
      },
      radiologicalOutcome: {
        status: "completed",
        chestXrayTaken: YesOrNo.YES,
        posteroAnteriorXrayFileName: "pa-file-name",
        posteroAnteriorXray: "pa-bucket",
        apicalLordoticXrayFileName: "al-file-name",
        apicalLordoticXray: "al-bucket",
        lateralDecubitusXrayFileName: "ld-file-name",
        lateralDecubitusXray: "ld-bucket",
        xrayResult: "normal",
        xrayResultDetail: "",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        dateCreated: "2025-01-01T05:15:00Z",
        isSputumRequired: YesOrNo.YES,
      },
      tbCertificate: {
        status: "completed",
        isIssued: "Yes",
        comments: "Comments",
        issueDate: "2025-01-01T23:45:00Z",
        certificateNumber: "XYZ789",
      },
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history.get[1].url).toEqual("/application/abc-123");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().applicant).toEqual({
      applicantHomeAddress1: "1 Ayres Rock Way",
      applicantHomeAddress2: "",
      applicantHomeAddress3: "",
      country: "Australia",
      countryOfIssue: "AUS",
      countryOfNationality: "AUS",
      dateOfBirth: {
        day: "1991",
        month: "01",
        year: "01",
      },
      fullName: "Maxwell Spiffington",
      passportExpiryDate: {
        day: "2053",
        month: "03",
        year: "03",
      },
      passportIssueDate: {
        day: "1992",
        month: "02",
        year: "02",
      },
      passportNumber: "12345",
      postcode: "",
      applicantPhotoFileName: "",
      provinceOrState: "New South Wales",
      sex: "Male",
      status: "Complete",
      townOrCity: "Sydney",
    });
    expect(store.getState().medicalScreening).toEqual({
      age: "43",
      chestXrayTaken: "",
      closeContactWithTb: "Yes",
      closeContactWithTbDetail: "details1",
      completionDate: {
        year: "2025",
        month: "01",
        day: "01",
      },
      menstrualPeriods: "No",
      otherSymptomsDetail: "Other symptoms",
      physicalExamNotes: "Exam notes",
      pregnant: "N/A",
      previousTb: "No",
      previousTbDetail: "details3",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: ApplicationStatus.COMPLETE,
      tbSymptoms: "Yes",
      tbSymptomsList: ["symptom1", "symptom2"],
      underElevenConditions: ["history1", "history2"],
      underElevenConditionsDetail: "details2",
    });
    expect(store.getState().chestXray).toEqual({
      status: ApplicationStatus.COMPLETE,
      posteroAnteriorXrayFileName: "pa-file-name",
      posteroAnteriorXrayFile: "pa-bucket",
      apicalLordoticXrayFileName: "al-file-name",
      apicalLordoticXrayFile: "al-bucket",
      lateralDecubitusXrayFileName: "ld-file-name",
      lateralDecubitusXrayFile: "ld-bucket",
      dateXrayTaken: {
        year: "2024",
        month: "12",
        day: "31",
      },
    });
    expect(store.getState().radiologicalOutcome).toEqual({
      status: ApplicationStatus.COMPLETE,
      reasonXrayWasNotTaken: "",
      xrayWasNotTakenFurtherDetails: "",
      xrayResult: "normal",
      xrayResultDetail: "",
      xrayMinorFindings: [],
      xrayAssociatedMinorFindings: [],
      xrayActiveTbFindings: [],
      completionDate: {
        year: "2025",
        month: "01",
        day: "01",
      },
    });
    expect(store.getState().tbCertificate).toEqual({
      status: ApplicationStatus.COMPLETE,
      isIssued: YesOrNo.YES,
      comments: "Comments",
      certificateDate: {
        day: "01",
        month: "01",
        year: "2025",
      },
      certificateNumber: "XYZ789",
      declaringPhysicianName: "",
      reasonNotIssued: "",
      clinic: {
        clinicId: "UK/LHR/00",
        name: "PETS Test Clinic",
        city: "London",
        country: "GBR",
        startDate: "2025-04-01",
        endDate: null,
        createdBy: "tmp@email.com",
      },
    });
  });

  test("user is navigated to applicant results page when applicant search returns an empty array", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(204, []);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);

    expect(store.getState().applicant).toEqual(emptyApplicantSlice);
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);
    expect(store.getState().chestXray).toEqual(emptyChestXraySlice);
    expect(store.getState().radiologicalOutcome).toEqual(emptyRadiologicalOutcomeSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/no-matching-record-found");
  });

  test("user is navigated to applicant results page when applicant search returns 500", async () => {
    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(500);

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    expect(screen.getByTestId("passport-number")).toHaveValue("12345");
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("AUS");

    await user.click(screen.getByRole("button"));
    expect(mock.history.get[0].url).toEqual("/applicant/search");
    expect(mock.history).toHaveLength(1);

    expect(store.getState().applicant).toEqual(emptyApplicantSlice);
    expect(store.getState().travel).toEqual(emptyTravelSlice);
    expect(store.getState().medicalScreening).toEqual(emptyMedicalSlice);
    expect(store.getState().chestXray).toEqual(emptyChestXraySlice);
    expect(store.getState().radiologicalOutcome).toEqual(emptyRadiologicalOutcomeSlice);

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("should redirect to /error when fetching applicant photo fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const failingFetchMock = vi.fn<typeof fetch>(function _failingFetchMock(
      _input: RequestInfo | URL,
      _init?: RequestInit,
    ) {
      void _input;
      void _init;
      return Promise.reject(new Error("fetch failed"));
    });
    global.fetch = failingFetchMock;

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ApplicantSearchForm />
      </ApplicantPhotoProvider>,
    );
    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, [
      {
        applicationId: "abc-123",
        status: "completed",
        fullName: "Maxwell Spiffington",
        sex: "Male",
        dateOfBirth: "01-01-1991",
        countryOfNationality: "AUS",
        passportNumber: "12345",
        countryOfIssue: "AUS",
        issueDate: "02-02-1992",
        expiryDate: "03-03-2053",
        applicantHomeAddress1: "1 Ayres Rock Way",
        townOrCity: "Sydney",
        provinceOrState: "New South Wales",
        country: "Australia",
      },
    ]);

    mock.onGet("/application/abc-123").reply(200, {
      applicationId: "abc-123",
      applicantPhotoUrl: "http://localhost:4566/photos/photo.jpg",
      travelInformation: {
        ukAddressLine1: "99 Downing Street",
        ukAddressPostcode: "W1 1AS",
        status: "completed",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "Maxwell@Spiffington.com",
        ukMobileNumber: "071234567890",
        visaCategory: "Visitor",
      },
    });

    await user.type(screen.getByTestId("passport-number"), "12345");
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "AUS" } });

    await user.click(screen.getByRole("button"));
    await new Promise((resolve) => process.nextTick(resolve));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
    expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
    consoleErrorSpy.mockRestore();
  });
});
