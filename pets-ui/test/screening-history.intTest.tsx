import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Mock } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";
import type { AppDispatch } from "@/redux/store";
import ScreeningHistory from "@/sections/screening-history";
import { ApplicationStatus, TaskStatus } from "@/utils/enums";
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
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
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

const applicationInProgress = {
  applicationStatus: ApplicationStatus.IN_PROGRESS,
  applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
  clinicId: "my-clinic",
  dateCreated: {
    year: "2000",
    month: "01",
    day: "01",
  },
};
const applicationAtOtherClinic = { ...applicationInProgress, clinicId: "a-different-clinic" };
const applicationCertIssued = {
  applicationStatus: ApplicationStatus.CERTIFICATE_AVAILABLE,
  applicationId: "app-02",
  clinicId: "my-clinic",
  dateCreated: {
    year: "2000",
    month: "05",
    day: "05",
  },
  expiryDate: {
    year: "2050",
    month: "19",
    day: "02",
  },
};
const applicationCancelled = {
  applicationStatus: ApplicationStatus.CANCELLED,
  applicationId: "app-02",
  clinicId: "my-clinic",
  dateCreated: {
    year: "2000",
    month: "12",
    day: "12",
  },
};
const populatedApplicantSlice = {
  applicantHomeAddress1: "Co-op City",
  applicantHomeAddress2: "The Bronx",
  applicantHomeAddress3: "New York City",
  country: "USA",
  countryOfIssue: "USA",
  countryOfNationality: "USA",
  dateOfBirth: {
    day: "07",
    month: "07",
    year: "1990",
  },
  fullName: "Ben Richards",
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
  passportNumber: "B3NJ4M1N",
  postcode: "",
  applicantPhotoFileName: "",
  provinceOrState: "",
  sex: "",
  status: TaskStatus.IN_PROGRESS,
  townOrCity: "",
};

describe("ScreeningHistory", () => {
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

  it("all applicantDataHeader fields & table column labels display correctly", () => {
    const preloadedState = {
      applicant: populatedApplicantSlice,
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    expect(screen.getByRole("rowheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Ben Richards" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Date of birth" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "7 July 1990" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Passport number" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "B3NJ4M1N" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Country of issue" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "United States of America (the)" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("TB screening")).not.toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Start date" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Expiry date" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Action" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start a new screening" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start now" })).toBeInTheDocument();
    expect(
      screen.queryByText("Help with screening details that are not available"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("You cannot view details of screenings started at another clinic."),
    ).not.toBeInTheDocument();
  });

  it("button to start a new application is not shown if an application is in progress", () => {
    const preloadedState = {
      applicant: populatedApplicantSlice,
      applicationsList: [applicationInProgress],
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    expect(screen.queryByRole("button", { name: "Start now" })).not.toBeInTheDocument();
  });

  it("details on apps at other clinics shown is shown if an application is at another clinic", () => {
    const preloadedState = {
      applicant: populatedApplicantSlice,
      applicationsList: [applicationAtOtherClinic],
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    expect(
      screen.getByText("Help with screening details that are not available"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You cannot view details of screenings started at another clinic."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "uktbscreeningsupport@ukhsa.gov.uk" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "uktbscreeningsupport@ukhsa.gov.uk" })).toHaveAttribute(
      "href",
      "mailto:uktbscreeningsupport@ukhsa.gov.uk",
    );
  });

  it("table data displays correctly", () => {
    const preloadedState = {
      applicant: populatedApplicantSlice,
      applicationsList: [
        applicationInProgress,
        applicationAtOtherClinic,
        applicationCertIssued,
        applicationCancelled,
      ],
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    expect(
      screen.getByRole("row", { name: "1 January 2000 No data In progress Continue screening" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "1 January 2000 No data In progress Not available: screening at another clinic",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "5 May 2000 2 July 2051 Certificate issued View screening" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "12 December 2000 Not applicable Screening cancelled View screening",
      }),
    ).toBeInTheDocument();
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
      applicant: populatedApplicantSlice,
      applicationsList: [applicationInProgress],
      clinic: { clinicId: "my-clinic" },
    };

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ContextChecker />
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    const user = userEvent.setup();

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

    await user.click(screen.getByRole("link", { name: "Continue screening" }));

    expect(mock.history[0].url).toEqual("/application/271554de-f2a9-4660-8ddf-7f070f1b8a62");
    expect(mock.history).toHaveLength(1);

    expect(store.getState().application).toMatchObject({
      applicationId: "271554de-f2a9-4660-8ddf-7f070f1b8a62",
    });
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

  it("user navigated to error page on 500 response", async () => {
    const preloadedState = {
      applicant: populatedApplicantSlice,
      applicationsList: [applicationInProgress],
      clinic: { clinicId: "my-clinic" },
    };

    renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    const user = userEvent.setup();

    mock.onGet("/application/271554de-f2a9-4660-8ddf-7f070f1b8a62").reply(500);

    await user.click(screen.getByRole("link", { name: "Continue screening" }));

    expect(mock.history[0].url).toEqual("/application/271554de-f2a9-4660-8ddf-7f070f1b8a62");
    expect(mock.history).toHaveLength(1);

    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });
  });

  it("should redirect to /sorry-there-is-problem-with-service when fetching applicant photo fails", async () => {
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

    const preloadedState = {
      applicant: populatedApplicantSlice,
      applicationsList: [applicationInProgress],
      clinic: { clinicId: "my-clinic" },
    };

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );
    const user = userEvent.setup();

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

    await user.click(screen.getByRole("link", { name: "Continue screening" }));
    await new Promise((resolve) => process.nextTick(resolve));

    expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
    consoleErrorSpy.mockRestore();
  });

  it("should update store & redirect to consent question page when start now button clicked", async () => {
    const preloadedState = {
      applicant: { ...populatedApplicantSlice, status: TaskStatus.COMPLETE },
      applicationsList: [applicationCancelled],
      clinic: { clinicId: "my-clinic" },
    };

    const { store } = renderWithProviders(
      <ApplicantPhotoProvider>
        <ScreeningHistory />
      </ApplicantPhotoProvider>,
      { preloadedState },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Start now" }));

    expect(store.getState().applicant.status).toBe(TaskStatus.IN_PROGRESS);
    expect(useNavigateMock).toHaveBeenLastCalledWith(
      "/do-you-have-visa-applicant-written-consent-for-tb-screening",
    );
  });
});
