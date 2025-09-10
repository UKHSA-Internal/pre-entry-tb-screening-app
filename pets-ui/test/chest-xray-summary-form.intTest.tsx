import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import ChestXraySummaryPage from "@/pages/chest-xray-summary";
import { ReduxChestXrayDetailsType } from "@/types";
import { ApplicationStatus } from "@/utils/enums";
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

const chestXrayState: ReduxChestXrayDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  posteroAnteriorXrayFileName: "PA Example FileName",
  posteroAnteriorXrayFile: "PA Example File",
  apicalLordoticXrayFileName: "AL Example FileName",
  apicalLordoticXrayFile: "AL Example File",
  lateralDecubitusXrayFileName: "LD Example FileName",
  lateralDecubitusXrayFile: "LD Example File",
  dateXrayTaken: { year: "31", month: "12", day: "2001" },
};

describe("ChestXraySummaryPage", () => {
  const user = userEvent.setup();
  const preloadedState = {
    chestXray: { ...chestXrayState },
    application: { ...applicationState },
  };
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(petsApi);
    useNavigateMock.mockClear();
    renderWithProviders(
      <HelmetProvider>
        <ChestXraySummaryPage />
      </HelmetProvider>,
      { preloadedState },
    );
  });

  it("displays the back link", () => {
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/upload-chest-xray");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("renders the page titles and descriptions ", () => {
    expect(screen.getByText("Check chest X-ray images")).toBeInTheDocument();
    expect(screen.getByText("Date of X-ray")).toBeInTheDocument();
    expect(screen.getByText("Chest X-ray images")).toBeInTheDocument();
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
      dateXrayTaken: "31-12-2001",
    });
    expect(useNavigateMock).toHaveBeenLastCalledWith("/chest-xray-confirmation");
  });

  it("renders the page titles and data", () => {
    expect(screen.getByText("Date of X-ray")).toBeInTheDocument();
    expect(screen.getByText("Chest X-ray images")).toBeInTheDocument();
    expect(screen.getByText("PA Example FileName")).toBeInTheDocument();
    expect(screen.getByText("AL Example FileName")).toBeInTheDocument();
    expect(screen.getByText("LD Example FileName")).toBeInTheDocument();
  });
});
