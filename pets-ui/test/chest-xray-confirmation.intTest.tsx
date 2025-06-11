import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ChestXrayConfirmation from "@/pages/chest-xray-confirmation";
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
vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

export const handlers = [];
const server = setupServer(...handlers);

const mockChestXrayState: ReduxChestXrayDetailsType = {
  status: ApplicationStatus.NOT_YET_STARTED,
  chestXrayTaken: YesOrNo.NULL,
  posteroAnteriorXrayFileName: "",
  posteroAnteriorXrayFile: "",
  apicalLordoticXrayFileName: "",
  apicalLordoticXrayFile: "",
  lateralDecubitusXrayFileName: "",
  lateralDecubitusXrayFile: "",
  reasonXrayWasNotTaken: "",
  xrayWasNotTakenFurtherDetails: "",
  xrayResult: "",
  xrayResultDetail: "",
  xrayMinorFindings: [],
  xrayAssociatedMinorFindings: [],
  xrayActiveTbFindings: [],
  isSputumRequired: YesOrNo.NULL,
};

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => server.close());

describe("ChestXrayConfirmation", () => {
  test("Renders correctly when sputum collection is not required", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayConfirmation />
      </Router>,
      {
        preloadedState: {
          chestXray: {
            ...mockChestXrayState,
            isSputumRequired: YesOrNo.NO,
          },
        },
      },
    );

    const button = screen.getByRole("button", { name: /Continue/i });
    const user = userEvent.setup();

    expect(screen.getByText("Radiological outcome confirmed")).toBeTruthy();
    expect(screen.getByText(/Continue to/i)).toBeTruthy();
    expect(screen.getByText(/TB certificate declaration/i)).toBeTruthy();
    expect(button).toHaveTextContent("Continue");
    await user.click(button);
    expect(useNavigateMock).toHaveBeenCalledWith("/tb-certificate-declaration");
  });

  test("Renders correctly when sputum collection is required", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayConfirmation />
      </Router>,
      {
        preloadedState: {
          chestXray: {
            ...mockChestXrayState,
            isSputumRequired: YesOrNo.YES,
          },
        },
      },
    );

    const button = screen.getByRole("button", { name: /Continue/i });
    const user = userEvent.setup();

    expect(screen.getByText("Radiological outcome confirmed")).toBeTruthy();
    expect(screen.getByText(/Continue to sputum collection/i)).toBeTruthy();
    expect(button).toHaveTextContent("Continue");
    await user.click(button);
    expect(useNavigateMock).toHaveBeenCalledWith("/sputum-collection");
  });
});
