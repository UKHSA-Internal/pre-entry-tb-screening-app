import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import Dashboard from "@/sections/dashboard";
import { ApplicationStatus, TaskStatus } from "@/utils/enums";
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

const applicationsInProgressSlice = {
  applications: [
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
  ],
  cursor: null,
};

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
      applicationsInProgress: {
        applications: [
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
        cursor: null,
      },
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

    await waitFor(() => {
      expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
      expect(contextUrl).toBe("http://localhost:4566/photos/photo.jpg");
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tracker");
    });
  });
});
