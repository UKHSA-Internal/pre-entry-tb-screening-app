import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import ApplicantSearchForm from "@/sections/applicant-search-form";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";

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
  postcode: "",
  status: "Not yet started",
  townOrCity: "",
  ukEmail: "",
  ukMobileNumber: "",
  visaType: "",
};
const emptyMedicalSlice = {
  age: "",
  closeContactWithTb: "",
  closeContactWithTbDetail: "",
  menstrualPeriods: "",
  otherSymptomsDetail: "",
  physicalExamNotes: "",
  pregnant: "",
  previousTb: "",
  previousTbDetail: "",
  status: "Not yet started",
  tbSymptoms: "",
  tbSymptomsList: [],
  underElevenConditions: [],
  underElevenConditionsDetail: "",
};
const emptyChestXraySlice = {
  status: ApplicationStatus.NOT_YET_STARTED,
  chestXrayTaken: YesOrNo.NULL,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  isSputumRequired: YesOrNo.NULL,
};

describe("ApplicantSearchForm", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
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
      <Router>
        <ApplicantPhotoProvider>
          <ContextChecker />
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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
      visaType: "Visitor",
    });
    expect(store.getState().medicalScreening).toEqual({
      age: "43",
      closeContactWithTb: "Yes",
      closeContactWithTbDetail: "details1",
      completionDate: "2025-01-01",
      menstrualPeriods: "No",
      otherSymptomsDetail: "Other symptoms",
      physicalExamNotes: "Exam notes",
      pregnant: "N/A",
      previousTb: "No",
      previousTbDetail: "details3",
      status: ApplicationStatus.COMPLETE,
      tbSymptoms: "Yes",
      tbSymptomsList: ["symptom1", "symptom2"],
      underElevenConditions: ["history1", "history2"],
      underElevenConditionsDetail: "details2",
    });
    expect(store.getState().chestXray).toEqual({
      status: ApplicationStatus.COMPLETE,
      chestXrayTaken: YesOrNo.YES,
      posteroAnteriorXrayFileName: "pa-file-name",
      posteroAnteriorXrayFile: "pa-bucket",
      apicalLordoticXrayFileName: "al-file-name",
      apicalLordoticXrayFile: "al-bucket",
      lateralDecubitusXrayFileName: "ld-file-name",
      lateralDecubitusXrayFile: "ld-bucket",
      reasonXrayWasNotTaken: "",
      xrayWasNotTakenFurtherDetails: "",
      xrayResult: "normal",
      xrayResultDetail: "",
      xrayMinorFindings: [],
      xrayAssociatedMinorFindings: [],
      xrayActiveTbFindings: [],
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
    });
    expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
    expect(contextUrl).toBe("http://localhost:4566/photos/photo.jpg");
    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
  });

  test("store is correctly populated and user is navigated to error page when applicant search is successful & application search returns a non-200 response", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantPhotoProvider>
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("store is correctly populated and user is navigated to error page when applicant search is successful & application search returns 500", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantPhotoProvider>
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("user is navigated to applicant results page when applicant search returns an empty array", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantPhotoProvider>
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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

    expect(useNavigateMock).toHaveBeenLastCalledWith("/applicant-results");
  });

  test("user is navigated to applicant results page when applicant search returns 500", async () => {
    const { store } = renderWithProviders(
      <Router>
        <ApplicantPhotoProvider>
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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

    expect(useNavigateMock).toHaveBeenLastCalledWith("/error");
  });

  test("should call console.error when fetching applicant photo fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { store } = renderWithProviders(
      <Router>
        <ApplicantPhotoProvider>
          <ApplicantSearchForm />
        </ApplicantPhotoProvider>
      </Router>,
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

    expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
    expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
    consoleErrorSpy.mockRestore();
  });
});
