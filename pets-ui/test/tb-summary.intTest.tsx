import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ReduxTbCertificateDeclarationType } from "@/applicant";
import TbSummaryPage from "@/pages/tb-summary";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const TbState: ReduxTbCertificateDeclarationType = {
  tbClearanceIssued: "Yes",
  physicianComments: "Extra Details",
  tbCertificateDate: {
    year: "2025",
    month: "03",
    day: "25",
  },
  tbCertificateNumber: "12345",
};

describe("TBSummaryPage", () => {
  const user = userEvent.setup();
  describe("General UI Tests", () => {
    beforeEach(() => {
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <TbSummaryPage />
          </HelmetProvider>
        </Router>,
      );
    });
    it("shows the breadcrumbs", () => {
      const breadcrumbItems = [{ text: "Application progress tracker", href: "/tracker" }];

      breadcrumbItems.forEach((item) => {
        const breadcrumbElement = screen.getByText(item.text);
        expect(breadcrumbElement).toBeInTheDocument();
        expect(breadcrumbElement.closest("a")).toHaveAttribute("href", item.href);
      });
    });
    it("renders the applicantDataHeader component ", () => {
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Date of Birth")).toBeInTheDocument();
      expect(screen.getByText("Passport Number")).toBeInTheDocument();
    });
    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Check TB clearance certificate declaration")).toBeInTheDocument();
    });
    it("when continue pressed, it navigates to /chest-xray-confirmation", async () => {
      await user.click(screen.getByRole("button"));
      expect(useNavigateMock).toHaveBeenLastCalledWith("/tb-confirmation");
    });
  });
  describe("TB Summary Data", () => {
    const preloadedState = {
      tbCertificate: { ...TbState },
    };
    beforeEach(() => {
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <TbSummaryPage />
          </HelmetProvider>
        </Router>,
        { preloadedState },
      );
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
  });
});
