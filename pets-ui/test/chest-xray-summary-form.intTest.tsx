import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import { ReduxChestXrayDetailsType } from "@/applicant";
import ChestXraySummaryPage from "@/pages/chest-xray-summary";
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

const applicationState = { applicationId: "abc-123", dateCreated: "" };

const chestXrayTakenState: ReduxChestXrayDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  chestXrayTaken: YesOrNo.YES,
  posteroAnteriorXrayFileName: "PA Example FileName",
  posteroAnteriorXrayFile: "PA Example File",
  apicalLordoticXrayFileName: "AL Example FileName",
  apicalLordoticXrayFile: "AL Example File",
  lateralDecubitusXrayFileName: "LD Example FileName",
  lateralDecubitusXrayFile: "LD Example File",
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "Chest X-ray normal",
  xrayResultDetail: "Extra Details on Chest X-ray",
  xrayMinorFindings: ["Single fibrous streak or band or scar", "Bony Islets"],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  isSputumRequired: YesOrNo.YES,
};

const chestXrayNotTakenState: ReduxChestXrayDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  chestXrayTaken: YesOrNo.NO,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: "Pregnant",
  xrayWasNotTakenFurtherDetails: "Further details",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  isSputumRequired: YesOrNo.YES,
};

describe("ChestXraySummaryPage", () => {
  const user = userEvent.setup();
  const preloadedState = {
    chestXray: { ...chestXrayTakenState },
    application: { ...applicationState },
  };
  describe("General UI Tests", () => {
    let mock: MockAdapter;
    beforeEach(() => {
      mock = new MockAdapter(petsApi);
      useNavigateMock.mockClear();
      renderWithProviders(
        <Router>
          <HelmetProvider>
            <ChestXraySummaryPage />
          </HelmetProvider>
        </Router>,
        { preloadedState },
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
      expect(screen.getByText("Date of birth")).toBeInTheDocument();
      expect(screen.getByText("Passport number")).toBeInTheDocument();
    });
    it("renders the page titles and descriptions ", () => {
      expect(screen.getByText("Check chest X-ray information")).toBeInTheDocument();
      expect(screen.getByText("Select X-ray status")).toBeInTheDocument();
    });
    it("when continue pressed, data is posted & user is navigated to /chest-xray-confirmation", async () => {
      mock.onPost("/application/abc-123/chest-xray").reply(200);
      await user.click(screen.getByRole("button"));
      expect(mock.history[0].url).toEqual("/application/abc-123/chest-xray");
      expect(mock.history).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data as string)).toMatchObject({
        chestXrayTaken: "Yes",
        posteroAnteriorXray: "PA Example File",
        apicalLordoticXray: "AL Example File",
        lateralDecubitusXray: "LD Example File",
        xrayResult: "Chest X-ray normal",
        xrayResultDetail: "Extra Details on Chest X-ray",
        xrayMinorFindings: ["Single fibrous streak or band or scar", "Bony Islets"],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
      });
      expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-confirmation");
    });
  });
  describe("Chest X-ray Taken", () => {
    const preloadedState = {
      chestXray: { ...chestXrayTakenState },
      application: { ...applicationState },
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
      expect(screen.getByText("Enter radiological outcome")).toBeInTheDocument();
      expect(screen.getByText("Chest X-ray normal")).toBeInTheDocument();
      //Array Data
      expect(screen.getByText("Enter radiographic findings")).toBeInTheDocument();
      expect(screen.getByText("Single fibrous streak or band or scar")).toBeInTheDocument();
      expect(screen.getByText("Bony Islets")).toBeInTheDocument();
    });
    it("does not render title when provided with an empty array", () => {
      expect(
        screen.queryByText("Findings sometimes seen in active TB (or other conditions)"),
      ).not.toBeInTheDocument();
    });
  });
  describe("Chest Not X-ray Taken", () => {
    const preloadedState = {
      chestXray: { ...chestXrayNotTakenState },
      application: { ...applicationState },
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
