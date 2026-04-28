import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import Dashboard from "@/sections/dashboard";
import { ApplicationStatus, PositiveOrNegative, TaskStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

import { petsApi } from "../src/api/api";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const emptyApplicantSlice = {
  applicantHomeAddress1: "",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  country: "",
  countryOfIssue: "",
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
  passportNumber: "",
  postcode: "",
  applicantPhotoFileName: "",
  provinceOrState: "",
  sex: "",
  status: TaskStatus.NOT_YET_STARTED,
  townOrCity: "",
};
const populatedApplicantSlice = {
  applicantHomeAddress1: "1 Ayres Rock Way",
  applicantHomeAddress2: "",
  applicantHomeAddress3: "",
  applicantPhotoFileName: "photo.jpg",
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
  provinceOrState: "New South Wales",
  sex: "Male",
  status: TaskStatus.COMPLETE,
  townOrCity: "Sydney",
};

const applicationsInProgressSlice = [
  {
    applicationId: "9189a071-945b-4834-a6cb-8748c4746eba",
    applicantId: "COUNTRY#AFG#PASSPORT#abc1",
    applicantName: "Name One",
    passportNumber: "abc1",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2021-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.IN_PROGRESS,
  },
  {
    applicationId: "b1a2f682-9281-4b92-b4ef-878edfd06d23",
    applicantId: "COUNTRY#AFG#PASSPORT#abc2",
    applicantName: "Name Two",
    passportNumber: "abc2",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fe6f393",
    applicantId: "COUNTRY#AFG#PASSPORT#abc3",
    applicantName: "Name Three",
    passportNumber: "abc3",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2023-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-9951-94ae-67692fe6f393",
    applicantId: "COUNTRY#AFG#PASSPORT#abc4",
    applicantName: "Name Four",
    passportNumber: "abc4",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2022-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.SPUTUM_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fe6f363",
    applicantId: "COUNTRY#AFG#PASSPORT#abc4",
    applicantName: "Should not see - different clinic",
    passportNumber: "abc4",
    countryOfIssue: "AFG",
    clinicId: "another-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.TRAVEL_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.MEDICAL_SCREENING_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.CHEST_XRAY_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.RADIOLOGICAL_OUTCOME_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.SPUTUM_DECISION_IN_PROGRESS,
  },
  {
    applicationId: "17811cbc-501d-4051-94ae-67692fefff00",
    applicantId: "COUNTRY#AFG#PASSPORT#abc9",
    applicantName: "Name Five",
    passportNumber: "abc9",
    countryOfIssue: "AFG",
    clinicId: "my-clinic",
    dateCreated: "2026-04-07T15:32:34.470Z",
    applicationStatus: ApplicationStatus.CERTIFICATE_IN_PROGRESS,
  },
];

describe("Dashboard", () => {
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

  it("all table column labels display correctly", () => {
    renderWithProviders(
      <ApplicantPhotoProvider>
        <Dashboard />
      </ApplicantPhotoProvider>,
    );

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Passport number" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Country of issue" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Screening start date" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Next task" })).toBeInTheDocument();
  });

  it("table data displays correctly", () => {
    const preloadedState = {
      applicationsInProgress: applicationsInProgressSlice,
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <Dashboard />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    expect(
      screen.getByRole("row", {
        name: "Name One abc1 Afghanistan 7 April 2021 Continue with screening",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Two abc2 Afghanistan 7 April 2026 Continue with screening",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Three abc3 Afghanistan 7 April 2023 Continue with screening",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Four abc4 Afghanistan 7 April 2022 Continue: sputum results",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: travel information",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: TB symptoms and medical history",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: upload chest X-ray",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: radiological outcome",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: make a sputum decision",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "Name Five abc9 Afghanistan 7 April 2026 Continue: TB certificate outcome",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByText("Should not see - different clinic")).not.toBeInTheDocument();
    expect(screen.queryByText("Should not see - different status")).not.toBeInTheDocument();
  });

  it("store correctly populated and user navigated to tracker when app successfully retrieved (200 response)", async () => {
    let contextUrl: string | null = null;
    const ContextChecker: React.FC = () => {
      const { applicantPhotoDataUrl } = useApplicantPhoto();
      React.useEffect(() => {
        contextUrl = applicantPhotoDataUrl;
      }, [applicantPhotoDataUrl]);
      return null;
    };

    const preloadedState = {
      applicant: emptyApplicantSlice,
      application: {
        applicationStatus: ApplicationStatus.NULL,
        applicationId: "",
        clinicId: "",
        dateCreated: {
          year: "",
          month: "",
          day: "",
        },
        dateUpdated: {
          year: "",
          month: "",
          day: "",
        },
        expiryDate: {
          year: "",
          month: "",
          day: "",
        },
        cancellationReason: "",
        cancellationFurtherInfo: "",
      },
      travel: {
        status: TaskStatus.NOT_YET_STARTED,
        visaCategory: "",
        applicantUkAddress1: "",
        applicantUkAddress2: "",
        applicantUkAddress3: "",
        townOrCity: "",
        postcode: "",
        ukMobileNumber: "",
        ukEmail: "",
      },
      medicalScreening: {
        status: TaskStatus.NOT_YET_STARTED,
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
        reasonXrayNotRequiredFurtherDetails: "",
        completionDate: {
          year: "",
          month: "",
          day: "",
        },
      },
      chestXray: {
        status: TaskStatus.NOT_YET_STARTED,
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
      },
      radiologicalOutcome: {
        status: TaskStatus.NOT_YET_STARTED,
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
      },
      sputumDecision: {
        status: TaskStatus.NOT_YET_STARTED,
        isSputumRequired: YesOrNo.NULL,
        completionDate: {
          year: "",
          month: "",
          day: "",
        },
      },
      sputum: {
        status: TaskStatus.NOT_YET_STARTED,
        version: undefined,
        sample1: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample2: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
        sample3: {
          collection: {
            submittedToDatabase: false,
            dateOfSample: {
              year: "",
              month: "",
              day: "",
            },
            collectionMethod: "",
          },
          smearResults: {
            submittedToDatabase: false,
            smearResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          cultureResults: {
            submittedToDatabase: false,
            cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
          },
          lastUpdatedDate: {
            year: "",
            month: "",
            day: "",
          },
        },
      },
      tbCertificate: {
        status: TaskStatus.NOT_YET_STARTED,
        isIssued: YesOrNo.NULL,
        comments: "",
        certificateDate: {
          year: "",
          month: "",
          day: "",
        },
        certificateNumber: "",
        reasonNotIssued: "",
        declaringPhysicianName: "",
        clinic: {
          clinicId: "",
          name: "",
          country: "",
          city: "",
          startDate: "",
          createdBy: "",
        },
      },
      applicationsInProgress: [
        {
          applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
          applicantId: "COUNTRY#AUS#PASSPORT#12345",
          applicantName: "Maxwell Spiffington",
          passportNumber: "12345",
          countryOfIssue: "AUS",
          clinicId: "my-clinic",
          dateCreated: "2021-04-07T15:32:34.470Z",
          applicationStatus: ApplicationStatus.IN_PROGRESS,
        },
      ],
      clinic: { clinicId: "my-clinic" },
    };

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ContextChecker />
        <Dashboard />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    const user = userEvent.setup();

    mock.onGet("/applicant/search").reply(200, {
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
      applications: [
        {
          applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
          applicationStatus: "In progress",
          clinicId: "my-clinic",
        },
      ],
      dateCreated: "2025-01-01",
    });

    mock.onGet("/application/271554de-f2a9-4660-8ddf-7f070f1b8a62").reply(200, {
      applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
      applicantPhotoUrl: "http://localhost:4566/photos/photo.jpg",
      travelInformation: {
        ukAddressLine1: "99 Downing Street",
        ukAddressPostcode: "W1 1AS",
        status: "completed",
        ukAddressTownOrCity: "London",
        ukEmailAddress: "Maxwell@Spiffington.com",
        ukMobileNumber: "071234567890",
        visaCategory: "Visitor",
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
      },
      medicalScreening: {
        dateOfMedicalScreening: "2026-04-17",
        age: 0,
        symptomsOfTb: "Yes",
        symptoms: ["Cough"],
        symptomsOther: "other symptoms",
        historyOfConditionsUnder11: [],
        historyOfConditionsUnder11Details: "",
        historyOfPreviousTb: "Yes",
        previousTbDetails: "",
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "",
        pregnant: "Yes",
        haveMenstralPeriod: "Yes",
        physicalExaminationNotes: "",
        isXrayRequired: "Yes",
        reasonXrayNotRequired: "",
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
        status: "completed",
      },
      chestXray: {
        dateXrayTaken: "2026-04-01",
        posteroAnteriorXrayFileName: "pa file name",
        posteroAnteriorXray: "pa-file.dcm",
        apicalLordoticXrayFileName: "",
        apicalLordoticXray: "",
        lateralDecubitusXrayFileName: "",
        lateralDecubitusXray: "",
        dateCreated: "2026-04-17",
        status: "completed",
      },
      radiologicalOutcome: {
        xrayResult: "normal",
        xrayResultDetail: "detail",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
        status: "completed",
      },
      sputumRequirement: {
        sputumRequired: "Yes",
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
        status: "completed",
      },
      sputumDetails: {
        sputumSamples: {
          sample1: {
            dateOfSample: "2026-04-01",
            collectionMethod: "Coughed up",
            smearResult: "Positive",
            cultureResult: "Positive",
            dateUpdated: "2026-04-17",
          },
          sample2: {
            dateOfSample: "2026-04-02",
            collectionMethod: "Coughed up",
            smearResult: "Positive",
            cultureResult: "Positive",
            dateUpdated: "2026-04-17",
          },
          sample3: {
            dateOfSample: "2026-04-03",
            collectionMethod: "Coughed up",
            smearResult: "Positive",
            cultureResult: "Positive",
            dateUpdated: "2026-04-17",
          },
        },
        version: 0,
        applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
        dateUpdated: "2026-04-17",
        status: "completed",
      },
      tbCertificate: {
        isIssued: "Yes",
        clinicName: "clinic 1",
        physicianName: "Dr. No",
        comments: "",
        issueDate: "2026-04-17",
        expiryDate: "2026-10-17",
        certificateNumber: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
        dateCreated: "2026-04-17",
        status: "completed",
      },
    });

    await user.click(screen.getByRole("link", { name: "Continue with screening" }));

    expect(mock.history[0].url).toEqual("/applicant/search");
    expect(mock.history[1].url).toEqual("/application/271554de-f2a9-4660-8ddf-7f070f1b8a62");
    expect(mock.history).toHaveLength(2);

    expect(store.getState().application).toMatchObject({
      applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
    });
    expect(store.getState().applicant).toMatchObject(populatedApplicantSlice);
    expect(store.getState().travel).toMatchObject({
      applicantUkAddress1: "99 Downing Street",
      applicantUkAddress2: "",
      applicantUkAddress3: "",
      postcode: "W1 1AS",
      status: TaskStatus.COMPLETE,
      townOrCity: "London",
      ukEmail: "Maxwell@Spiffington.com",
      ukMobileNumber: "071234567890",
      visaCategory: "Visitor",
    });
    expect(store.getState().medicalScreening).toMatchObject({
      chestXrayTaken: "Yes",
      closeContactWithTb: "Yes",
      closeContactWithTbDetail: "",
      completionDate: {
        day: "17",
        month: "04",
        year: "2026",
      },
      menstrualPeriods: "Yes",
      otherSymptomsDetail: "other symptoms",
      physicalExamNotes: "",
      pregnant: "Yes",
      previousTb: "Yes",
      previousTbDetail: "",
      reasonXrayNotRequired: "",
      reasonXrayNotRequiredFurtherDetails: "",
      status: "Complete",
      tbSymptoms: "Yes",
      tbSymptomsList: ["Cough"],
      underElevenConditions: [],
      underElevenConditionsDetail: "",
    });
    expect(store.getState().chestXray).toMatchObject({
      apicalLordoticXrayFile: "",
      apicalLordoticXrayFileName: "",
      dateXrayTaken: {
        day: "01",
        month: "04",
        year: "2026",
      },
      lateralDecubitusXrayFile: "",
      lateralDecubitusXrayFileName: "",
      posteroAnteriorXrayFile: "pa-file.dcm",
      posteroAnteriorXrayFileName: "pa file name",
      status: "Complete",
    });
    expect(store.getState().radiologicalOutcome).toMatchObject({
      completionDate: {
        day: "17",
        month: "04",
        year: "2026",
      },
      reasonXrayWasNotTaken: "",
      status: "Complete",
      xrayActiveTbFindings: [],
      xrayAssociatedMinorFindings: [],
      xrayMinorFindings: [],
      xrayResult: "normal",
      xrayResultDetail: "detail",
      xrayWasNotTakenFurtherDetails: "",
    });
    expect(store.getState().sputumDecision).toMatchObject({
      completionDate: {
        day: "",
        month: "",
        year: "",
      },
      isSputumRequired: "Yes",
      status: "Complete",
    });
    expect(store.getState().sputum).toMatchObject({
      sample1: {
        collection: {
          collectionMethod: "Coughed up",
          dateOfSample: {
            day: "01",
            month: "04",
            year: "2026",
          },
          submittedToDatabase: true,
        },
        cultureResults: {
          cultureResult: "Positive",
          submittedToDatabase: true,
        },
        lastUpdatedDate: {
          day: "17",
          month: "04",
          year: "2026",
        },
        smearResults: {
          smearResult: "Positive",
          submittedToDatabase: true,
        },
      },
      sample2: {
        collection: {
          collectionMethod: "Coughed up",
          dateOfSample: {
            day: "02",
            month: "04",
            year: "2026",
          },
          submittedToDatabase: true,
        },
        cultureResults: {
          cultureResult: "Positive",
          submittedToDatabase: true,
        },
        lastUpdatedDate: {
          day: "17",
          month: "04",
          year: "2026",
        },
        smearResults: {
          smearResult: "Positive",
          submittedToDatabase: true,
        },
      },
      sample3: {
        collection: {
          collectionMethod: "Coughed up",
          dateOfSample: {
            day: "03",
            month: "04",
            year: "2026",
          },
          submittedToDatabase: true,
        },
        cultureResults: {
          cultureResult: "Positive",
          submittedToDatabase: true,
        },
        lastUpdatedDate: {
          day: "17",
          month: "04",
          year: "2026",
        },
        smearResults: {
          smearResult: "Positive",
          submittedToDatabase: true,
        },
      },
      status: "Complete",
      version: 0,
    });
    expect(store.getState().tbCertificate).toMatchObject({
      certificateDate: {
        day: "17",
        month: "04",
        year: "2026",
      },
      certificateNumber: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
      clinic: {
        city: "",
        clinicId: "",
        country: "",
        createdBy: "",
        name: "",
        startDate: "",
      },
      comments: "",
      declaringPhysicianName: "Dr. No",
      isIssued: "Yes",
      reasonNotIssued: "",
      status: "Complete",
    });

    await waitFor(() => {
      expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
      expect(contextUrl).toBe("http://localhost:4566/photos/photo.jpg");
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
    });
  });
});
