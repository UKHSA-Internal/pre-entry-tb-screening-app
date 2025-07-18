import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import { ReduxTbCertificateType } from "@/applicant";
import TbSummaryPage from "@/pages/tb-summary";
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
};

describe("TBSummaryPage", () => {
  let mock: MockAdapter;
  const user = userEvent.setup();
  describe("General UI Tests", () => {
    beforeEach(() => {
      renderWithProviders(
        <HelmetProvider>
          <TbSummaryPage />
        </HelmetProvider>,
      );
    });
    it("displays the back link", () => {
      const link = screen.getByRole("link", { name: "Back" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/tb-certificate-declaration");
      expect(link).toHaveClass("govuk-back-link");
    });
    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Check TB clearance certificate declaration")).toBeInTheDocument();
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
          <TbSummaryPage />
        </HelmetProvider>,
        { preloadedState },
      );
      mock = new MockAdapter(petsApi);
      useNavigateMock.mockClear();
    });
    it("renders the page titles and data ", () => {
      expect(screen.getByText("TB clearance certificate issued?")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("Physician comments")).toBeInTheDocument();
      expect(screen.getByText("Extra Details")).toBeInTheDocument();
      expect(screen.getByText("Date of TB clearance certificate")).toBeInTheDocument();
      expect(screen.getByText("25/03/2025")).toBeInTheDocument();
      expect(screen.getByText("TB clearance certificate number")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
    });
    it("when continue pressed, it navigates to /tb-certificate-confirmation", async () => {
      mock.onPost("/application/abc-123/tb-certificate").reply(200);
      await user.click(screen.getByRole("button"));

      expect(mock.history[0].url).toEqual("/application/abc-123/tb-certificate");
      expect(mock.history).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-certificate-confirmation");
    });
  });
});
