import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";

import { postSputumDetails } from "@/api/api";
import {
  DateType,
  ReduxApplicantDetailsType,
  ReduxSputumSampleType,
  ReduxSputumType,
} from "@/applicant";
import CheckSputumSampleInformationPage from "@/pages/check-sputum-sample-information";
import SputumSummary from "@/sections/sputum-summary";
import { ApplicationStatus, PositiveOrNegative, SputumCollectionMethod } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

vi.mock("@/api/api", () => ({
  postSputumDetails: vi.fn().mockResolvedValue({
    data: {
      version: 1,
    },
  }),
}));

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

const mockPostSputumDetails = postSputumDetails as Mock;

const emptyDate: DateType = { day: "", month: "", year: "" };

const initialSputumSampleEmpty: ReduxSputumSampleType = {
  collection: {
    dateOfSample: { ...emptyDate },
    collectionMethod: "",
    submittedToDatabase: false,
  },
  smearResults: {
    smearResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  cultureResults: {
    cultureResult: PositiveOrNegative.NOT_YET_ENTERED,
    submittedToDatabase: false,
  },
  lastUpdatedDate: { ...emptyDate },
};

const initialSputumDataEmpty: ReduxSputumType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  version: undefined,
  sample1: { ...initialSputumSampleEmpty },
  sample2: { ...initialSputumSampleEmpty },
  sample3: { ...initialSputumSampleEmpty },
};

const sampleWithData: ReduxSputumSampleType = {
  collection: {
    dateOfSample: { day: "15", month: "06", year: "2025" },
    collectionMethod: SputumCollectionMethod.COUGHED_UP,
    submittedToDatabase: false,
  },
  smearResults: {
    smearResult: PositiveOrNegative.POSITIVE,
    submittedToDatabase: false,
  },
  cultureResults: {
    cultureResult: PositiveOrNegative.NEGATIVE,
    submittedToDatabase: false,
  },
  lastUpdatedDate: { day: "15", month: "06", year: "2025" },
};

const initialApplicantData: ReduxApplicantDetailsType & { applicationId: string } = {
  status: ApplicationStatus.NOT_YET_STARTED,
  applicationId: "test-123",
  fullName: "John Doe",
  sex: "Male",
  dateOfBirth: {
    day: "01",
    month: "01",
    year: "1990",
  },
  countryOfNationality: "United Kingdom",
  passportNumber: "123456789",
  countryOfIssue: "United Kingdom",
  passportIssueDate: {
    day: "01",
    month: "01",
    year: "2020",
  },
  passportExpiryDate: {
    day: "01",
    month: "01",
    year: "2030",
  },
  applicantHomeAddress1: "123 Test Street",
  townOrCity: "Test City",
  provinceOrState: "Test Province",
  country: "United Kingdom",
};

describe("SputumSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render page title", () => {
    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: initialSputumDataEmpty,
      },
    });

    expect(screen.getByText("Check sputum sample information and results")).toBeInTheDocument();
  });
  it("should not show Change links when there is no data", () => {
    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: initialSputumDataEmpty,
      },
    });

    const noDataTexts = screen.getAllByText("No data");
    expect(noDataTexts).toHaveLength(12);

    const changeLinks = screen.queryAllByRole("link", { name: /Change/ });
    expect(changeLinks).toHaveLength(0);

    const noDataLinks = screen.queryAllByRole("link", { name: "No data" });
    expect(noDataLinks).toHaveLength(0);
  });

  it("should display sample data when available", () => {
    const sputumDataWithSample1: ReduxSputumType = {
      ...initialSputumDataEmpty,
      sample1: sampleWithData,
    };

    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: sputumDataWithSample1,
      },
    });
    expect(screen.getByText("15/06/2025")).toBeInTheDocument();
    expect(screen.getByText(SputumCollectionMethod.COUGHED_UP)).toBeInTheDocument();
    expect(screen.getByText(PositiveOrNegative.POSITIVE)).toBeInTheDocument();
    expect(screen.getByText(PositiveOrNegative.NEGATIVE)).toBeInTheDocument();

    const changeLinks = screen.getAllByRole("link", { name: /Change/ });
    expect(changeLinks).toHaveLength(4);

    const noDataTexts = screen.getAllByText("No data");
    expect(noDataTexts).toHaveLength(8);
  });

  it("should navigate to partial confirmation when not all samples are complete", async () => {
    const user = userEvent.setup();
    const sputumDataPartial: ReduxSputumType = {
      ...initialSputumDataEmpty,
      sample1: sampleWithData,
      status: ApplicationStatus.IN_PROGRESS,
    };

    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: sputumDataPartial,
      },
    });

    const saveButton = screen.getByText("Save and continue");
    await user.click(saveButton);

    expect(useNavigateMock).toHaveBeenCalledWith("/sputum-confirmation");
    expect(mockPostSputumDetails).toHaveBeenCalledTimes(1);
  });

  it("should not call API when no sample data entered", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: { ...initialSputumDataEmpty, status: ApplicationStatus.NOT_YET_STARTED },
      },
    });

    await user.click(screen.getByText("Save and continue"));
    expect(mockPostSputumDetails).not.toHaveBeenCalled();
    expect(useNavigateMock).toHaveBeenCalledWith("/sputum-confirmation");
  });

  it("should not show Change links when data has been submitted to database", () => {
    const sampleSubmittedToDb: ReduxSputumSampleType = {
      ...sampleWithData,
      collection: {
        ...sampleWithData.collection,
        submittedToDatabase: true,
      },
      smearResults: {
        ...sampleWithData.smearResults,
        submittedToDatabase: true,
      },
      cultureResults: {
        ...sampleWithData.cultureResults,
        submittedToDatabase: true,
      },
    };

    const sputumDataSubmitted: ReduxSputumType = {
      ...initialSputumDataEmpty,
      sample1: sampleSubmittedToDb,
    };

    renderWithProviders(<SputumSummary />, {
      preloadedState: {
        applicant: initialApplicantData,
        sputum: sputumDataSubmitted,
      },
    });

    expect(screen.getByText("15/06/2025")).toBeInTheDocument();
    expect(screen.getByText(SputumCollectionMethod.COUGHED_UP)).toBeInTheDocument();
    expect(screen.getByText(PositiveOrNegative.POSITIVE)).toBeInTheDocument();
    expect(screen.getByText(PositiveOrNegative.NEGATIVE)).toBeInTheDocument();

    const changeLinks = screen.queryAllByRole("link", { name: /Change/ });
    expect(changeLinks).toHaveLength(0);

    const noDataTexts = screen.getAllByText("No data");
    expect(noDataTexts).toHaveLength(8);
  });

  test("back link points to tracker when status is complete", () => {
    const preloadedState = {
      sputum: {
        status: ApplicationStatus.COMPLETE,
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
      navigation: {
        checkSputumPreviousPage: "/prev-page",
        accessibilityStatementPreviousPage: "",
        privacyNoticePreviousPage: "",
      },
    };

    renderWithProviders(<CheckSputumSampleInformationPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");
  });

  test("back link points to previous page when status is not complete", () => {
    const preloadedState = {
      sputum: {
        status: ApplicationStatus.IN_PROGRESS,
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
      navigation: {
        checkSputumPreviousPage: "/prev-page",
        accessibilityStatementPreviousPage: "",
        privacyNoticePreviousPage: "",
      },
    };

    renderWithProviders(<CheckSputumSampleInformationPage />, { preloadedState });

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/prev-page");
    expect(link).toHaveClass("govuk-back-link");
  });
});
