import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ReduxChestXrayDetailsType } from "@/applicant";
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

const chestXrayTakenState: ReduxChestXrayDetailsType = {
  chestXrayTaken: true,
  posteroAnteriorXray: true,
  posteroAnteriorXrayFile: "PA Example FileName",
  apicalLordoticXray: true,
  apicalLordoticXrayFile: "AL Example FileName",
  lateralDecubitusXray: true,
  lateralDecubitusXrayFile: "LD Example FileName",
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
  xrayResult: "Chest X-ray normal",
  xrayResultDetail: "Extra Details on Chest X-ray",
  xrayMinorFindings: ["Single fibrous streak or band or scar", "Bony Islets"],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
};

const chestXrayNotTakenState: ReduxChestXrayDetailsType = {
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
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
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
    it("renders the page titles and data ", () => {
      expect(screen.getByText("Postero anterior X-ray")).toBeInTheDocument();
      expect(screen.getByText("PA Example FileName")).toBeInTheDocument();
      expect(screen.getByText("Apical lordotic X-ray")).toBeInTheDocument();
      expect(screen.getByText("AL Example FileName")).toBeInTheDocument();
      expect(screen.getByText("Lateral decubitus X-ray")).toBeInTheDocument();
      expect(screen.getByText("LD Example FileName")).toBeInTheDocument();
      expect(screen.getByText("Chest X-ray Result")).toBeInTheDocument();
      expect(screen.getByText("Chest X-ray normal")).toBeInTheDocument();
      //Array Data
      expect(screen.getByText("Minor Findings")).toBeInTheDocument();
      expect(screen.getByText("Single fibrous streak or band or scar")).toBeInTheDocument();
      expect(screen.getByText("Bony Islets")).toBeInTheDocument();
    });
    it("does not render title when provided with an empty array", () => {
      expect(
        screen.queryByText("Findings Sometimes Seen in Active TB (or Other Conditions)"),
      ).not.toBeInTheDocument();
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
