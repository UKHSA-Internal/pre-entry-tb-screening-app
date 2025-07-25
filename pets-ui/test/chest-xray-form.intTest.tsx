import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it, Mock } from "vitest";

import ChestXrayUploadPage from "@/pages/chest-xray-upload";
import ChestXrayForm from "@/sections/chest-xray-form";
import { ApplicationStatus, ImageType, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";
import uploadFile from "@/utils/uploadFile";
import validateFiles from "@/utils/validateFiles";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});
vi.mock("@/utils/uploadFile", () => ({
  __esModule: true,
  default: vi.fn(),
  computeBase64SHA256: vi.fn(),
}));
vi.mock("@/utils/validateFiles", () => ({
  default: vi.fn(),
}));

beforeEach(() => {
  useNavigateMock.mockClear();
  global.URL.createObjectURL = vi.fn(() => "mock-url");
});

afterEach(() => {
  vi.restoreAllMocks();
});

const user = userEvent.setup();

describe("ChestXrayUploadPage", () => {
  it("displays breadcrumb correctly", () => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <ChestXrayUploadPage />
        </HelmetProvider>
      </Router>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/chest-xray-question");
    expect(link).toHaveClass("govuk-back-link");
  });
});

describe("ChestXrayForm Section", () => {
  it("renders components correctly when state is empty", () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
    );
    expect(screen.getByText("Postero-anterior X-ray")).toBeInTheDocument();
    expect(screen.getByText("Apical lordotic X-ray (optional)")).toBeInTheDocument();
    expect(screen.getByText("Lateral decubitus X-ray (optional)")).toBeInTheDocument();
    expect(screen.getAllByText("Type of X-ray")).toHaveLength(3);
    expect(screen.getAllByText("File uploaded")).toHaveLength(3);
    expect(screen.getAllByRole("group")).toHaveLength(3);
  });

  it("renders components correctly when state is populated", () => {
    const preloadedState = {
      chestXray: {
        status: ApplicationStatus.NOT_YET_STARTED,
        chestXrayTaken: YesOrNo.YES,
        posteroAnteriorXrayFileName: "pa-file-name.jpg",
        posteroAnteriorXrayFile: "examplejpgexamplejpgexamplejpg",
        apicalLordoticXrayFileName: "",
        apicalLordoticXrayFile: "",
        lateralDecubitusXrayFileName: "",
        lateralDecubitusXrayFile: "",
        reasonXrayWasNotTaken: "",
        xrayWasNotTakenFurtherDetails: "",
        xrayResult: "normal",
        xrayResultDetail: "",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        isSputumRequired: YesOrNo.NULL,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
      { preloadedState },
    );

    expect(screen.getByText("Postero-anterior X-ray")).toBeInTheDocument();
    expect(screen.getByText("Apical lordotic X-ray (optional)")).toBeInTheDocument();
    expect(screen.getByText("Lateral decubitus X-ray (optional)")).toBeInTheDocument();
    expect(screen.getAllByText("Type of X-ray")).toHaveLength(3);
    expect(screen.getAllByText("File uploaded")).toHaveLength(3);
    expect(screen.getAllByRole("group")).toHaveLength(3);
    expect(screen.getByText("pa-file-name.jpg")).toBeInTheDocument();
  });

  it("uploads three X-ray files", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);
    vi.mocked(uploadFile).mockResolvedValue("test/bucket/path");

    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
      { preloadedState },
    );

    const posteroAnteriorInput: HTMLInputElement = screen.getByTestId("postero-anterior-xray");
    const apicalLordoticInput: HTMLInputElement = screen.getByTestId("apical-lordotic-xray");
    const lateralDecubitusInput: HTMLInputElement = screen.getByTestId("lateral-decubitus-xray");

    const lateralDecubitusFile = new File(["dummy"], "lateral-decubitus.dcm", {
      type: "image/dicom",
    });
    const apicalLordoticFile = new File(["dummy"], "apical-lordotic.dcm", { type: "image/dicom" });
    const posteroAnteriorFile = new File(["dummy"], "postero-anterior.dcm", {
      type: "image/dicom",
    });

    expect(posteroAnteriorInput).toBeInTheDocument();
    expect(apicalLordoticInput).toBeInTheDocument();
    expect(lateralDecubitusInput).toBeInTheDocument();
    expect(posteroAnteriorInput.files).toHaveLength(0);
    expect(apicalLordoticInput.files).toHaveLength(0);
    expect(lateralDecubitusInput.files).toHaveLength(0);

    await userEvent.upload(posteroAnteriorInput, posteroAnteriorFile);
    await userEvent.upload(apicalLordoticInput, apicalLordoticFile);
    await userEvent.upload(lateralDecubitusInput, lateralDecubitusFile);

    expect(posteroAnteriorInput.files).toHaveLength(1);
    expect(apicalLordoticInput.files).toHaveLength(1);
    expect(lateralDecubitusInput.files).toHaveLength(1);

    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledTimes(3);
      expect(useNavigateMock).toHaveBeenCalled();
      expect(uploadFile).toHaveBeenCalledWith(
        posteroAnteriorFile,
        "postero-anterior.dcm",
        "abc-123",
        "Dicom",
      );

      expect(uploadFile).toHaveBeenCalledWith(
        apicalLordoticFile,
        "apical-lordotic.dcm",
        "abc-123",
        ImageType.Dicom,
      );

      expect(uploadFile).toHaveBeenCalledWith(
        lateralDecubitusFile,
        "lateral-decubitus.dcm",
        "abc-123",
        ImageType.Dicom,
      );
    });
  });

  it("errors when postero anterior xray is missing", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
    );

    const posteroAnteriorInput: HTMLInputElement = screen.getByTestId("postero-anterior-xray");
    const submitButton = screen.getByRole("button", { name: /continue/i });

    expect(posteroAnteriorInput).toBeInTheDocument();
    expect(posteroAnteriorInput.files).toHaveLength(0);

    await user.click(submitButton);
    expect(useNavigateMock).not.toHaveBeenCalled();
    expect(screen.getAllByText("Select a postero-anterior X-ray image file")).toHaveLength(2);
    expect(screen.getAllByText("Select a postero-anterior X-ray image file")[0]).toHaveAttribute(
      "aria-label",
      "Error: Select a postero-anterior X-ray image file",
    );
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
    );

    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveFocus();
  });
});
