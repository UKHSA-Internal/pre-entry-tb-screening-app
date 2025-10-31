import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import { ApplicantPhotoProvider } from "@/context/applicantPhotoContext";
import TbSummaryPage from "@/pages/tb-summary";
import { ReduxTbCertificateType } from "@/types";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

beforeEach(() => {
  localStorage.setItem("cookie-consent", "rejected");
});

afterEach(() => {
  localStorage.clear();
});

const tbState: ReduxTbCertificateType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  isIssued: YesOrNo.YES,
  comments: "Extra Details",
  certificateDate: {
    year: "2025",
    month: "03",
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

describe("TBSummaryPage", () => {
  let mock: MockAdapter;
  const user = userEvent.setup();

  describe("General UI Tests", () => {
    beforeEach(() => {
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
      );
    });

    it("displays the back link", () => {
      const link = screen.getByRole("link", { name: "Back" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/enter-clinic-certificate-information");
      expect(link).toHaveClass("govuk-back-link");
    });

    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Check certificate information")).toBeInTheDocument();
    });
  });

  describe("TB Summary Data & post request", () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
      tbCertificate: { ...tbState },
    };

    beforeEach(() => {
      renderWithProviders(
        <HelmetProvider>
          <ApplicantPhotoProvider>
            <TbSummaryPage />
          </ApplicantPhotoProvider>
        </HelmetProvider>,
        { preloadedState },
      );
      mock = new MockAdapter(petsApi);
      useNavigateMock.mockClear();
    });

    it("renders the page titles and data ", () => {
      expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
      expect(screen.getAllByText("Physician's comments")[0]).toBeInTheDocument();
      expect(screen.getByText("Extra Details")).toBeInTheDocument();
      expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
      expect(screen.getByText("25 March 2025")).toBeInTheDocument();
    });

    it("when post request returns client-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(400);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });

    it("when post request returns server-side error then user is navigated to /sorry-there-is-problem-with-service", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(500);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/sorry-there-is-problem-with-service");
    });

    it("when continue pressed, it navigates to /tb-screening-complete", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(200);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-screening-complete");
    });
  });
});
