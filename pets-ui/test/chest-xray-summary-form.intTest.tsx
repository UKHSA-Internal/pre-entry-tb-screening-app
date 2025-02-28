import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ChestXrayDetailsType } from "@/applicant";
import ChestXraySummaryPage from "@/pages/chest-xray-summary";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const chestXrayTakenState: ChestXrayDetailsType = {
  chestXrayTaken: true,
  posteroAnteriorXray: true,
  posteroAnteriorXrayFile: "FileName",
  apicalLordoticXray: true,
  apicalLordoticXrayFile: "FileName",
  lateralDecubitusXray: true,
  lateralDecubitusXrayFile: "FileName",
  reasonXrayWasNotTaken: null,
  xrayWasNotTakenFurtherDetails: null,
  reasonXrayNotTakenDetail: null,
  dateOfCxr: null,
  radiologicalOutcome: "",
  radiologicalOutcomeNotes: null,
  radiologicalFinding: null,
  dateOfRadiologicalInterpretation: null,
  sputumCollected: false,
  reasonWhySputumNotRequired: null,
  xrayResult: "",
  xrayResultDetail: "",
  xrayFindingsList: [],
};

const chestXrayNotTakenState: ChestXrayDetailsType = {
  chestXrayTaken: false,
  posteroAnteriorXray: false,
  posteroAnteriorXrayFile: "",
  apicalLordoticXray: false,
  apicalLordoticXrayFile: "",
  lateralDecubitusXray: false,
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: "Pregnant",
  xrayWasNotTakenFurtherDetails: null,
  reasonXrayNotTakenDetail: null,
  dateOfCxr: null,
  radiologicalOutcome: "",
  radiologicalOutcomeNotes: null,
  radiologicalFinding: null,
  dateOfRadiologicalInterpretation: null,
  sputumCollected: false,
  reasonWhySputumNotRequired: null,
  xrayResult: "",
  xrayResultDetail: "",
  xrayFindingsList: [],
};

describe("ChestXraySummaryPage", () => {
  const user = userEvent.setup();
  describe("General UI Tests", () => {
    beforeEach(() => {
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <ChestXraySummaryPage />
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
      expect(screen.getByText("Check chest X-ray information")).toBeInTheDocument();
      expect(screen.getByText("Select X-ray Status")).toBeInTheDocument();
    });
    it("when continue pressed, it navigates to /chest-xray-confirmation", async () => {
      await user.click(screen.getByRole("button"));
      expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-confirmation");
    });
  });
  describe("Chest X-ray Taken", () => {
    const preloadedState = {
      chestXray: { ...chestXrayTakenState },
    };
    beforeEach(() => {
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <ChestXraySummaryPage />
          </HelmetProvider>
        </Router>,
        { preloadedState },
      );
    });
    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Upload chest X-ray images")).toBeInTheDocument();
      expect(screen.getByText("Enter X-ray Results and Findings")).toBeInTheDocument();
    });
  });
  describe("Chest Not X-ray Taken", () => {
    const preloadedState = {
      chestXray: { ...chestXrayNotTakenState },
    };
    beforeEach(() => {
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <ChestXraySummaryPage />
          </HelmetProvider>
        </Router>,
        { preloadedState },
      );
    });
    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Enter reason X-ray not taken")).toBeInTheDocument();
      expect(screen.getByText("Pregnant")).toBeInTheDocument();
    });
  });
});
