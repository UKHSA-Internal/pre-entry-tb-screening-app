import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it, Mock } from "vitest";

import { petsApi } from "@/api/api";
import ChestXrayUploadPage from "@/pages/chest-xray-upload";
import ChestXrayForm from "@/sections/chest-xray-form";
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
  useNavigateMock.mockClear();
});

const user = userEvent.setup({ applyAccept: false });

describe("ChestXrayUploadPage", () => {
  it("displays breadcrumb correctly", () => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <ChestXrayUploadPage />
        </HelmetProvider>
      </Router>,
    );

    const breadcrumbElement = screen.getByText("Application progress tracker");
    expect(breadcrumbElement).toBeInTheDocument();
    expect(breadcrumbElement.closest("a")).toHaveAttribute("href", "/tracker");
  });
});
describe("ChestXrayForm Section", () => {
  const applicationState = { applicationId: "abc-123", dateCreated: "" };

  const preloadedState = {
    application: { ...applicationState },
  };

  let petsApiMock: MockAdapter;
  let defaultAxiosMock: MockAdapter;
  beforeEach(() => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
      { preloadedState },
    );
    petsApiMock = new MockAdapter(petsApi);
    defaultAxiosMock = new MockAdapter(axios);
  });
  it("renders components correctly", () => {
    expect(screen.getByText("Postero-anterior X-ray")).toBeInTheDocument();
    expect(screen.getByText("Apical lordotic X-ray (optional)")).toBeInTheDocument();
    expect(screen.getByText("Lateral decubitus X-ray (optional)")).toBeInTheDocument();
    expect(screen.getAllByText("Type of X-ray")).toHaveLength(3);
    expect(screen.getAllByText("File uploaded")).toHaveLength(3);
    expect(screen.getAllByRole("group")).toHaveLength(3);
  });

  it.only("uploads three X-ray files", async () => {
    const uploadUrl = "localhost:4567";

    petsApiMock.onPut("/application/abc-123/generate-dicom-upload-url").reply(200, {
      uploadUrl,
      bucketPath: "test/bucket/path",
      fields: { example: "fields" },
    });

    defaultAxiosMock.onPost(uploadUrl).reply(204);

    const posteroAnteriorInput: HTMLInputElement = screen.getByTestId("postero-anterior-xray");
    const apicalLordoticInput: HTMLInputElement = screen.getByTestId("apical-lordotic-xray");
    const lateralDecubitusInput: HTMLInputElement = screen.getByTestId("lateral-decubitus-xray");

    const file = new File(["Dummy Content"], "example.jpg", { type: "image/jpeg" });

    expect(posteroAnteriorInput).toBeInTheDocument();
    expect(apicalLordoticInput).toBeInTheDocument();
    expect(lateralDecubitusInput).toBeInTheDocument();
    expect(posteroAnteriorInput.files).toHaveLength(0);
    expect(apicalLordoticInput.files).toHaveLength(0);
    expect(lateralDecubitusInput.files).toHaveLength(0);

    await userEvent.upload(posteroAnteriorInput, file);
    await userEvent.upload(apicalLordoticInput, file);
    await userEvent.upload(lateralDecubitusInput, file);

    expect(posteroAnteriorInput.files).toHaveLength(1);
    expect(apicalLordoticInput.files).toHaveLength(1);
    expect(lateralDecubitusInput.files).toHaveLength(1);

    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Quick Hack Because Memory Router isn't used
    expect(useNavigateMock).toHaveBeenCalled();
    expect(petsApiMock.history.put.length).toBe(3);
    expect(petsApiMock.history.put[0].data).toBe(
      JSON.stringify({
        fileName: "postero-anterior.dcm",
        checksum: "pZzpJIWoY5Ma8hNwtQguuKDCWMHNdK4GjbCtR66sE0Q=",
      }),
    );

    expect(petsApiMock.history.put[1].data).toBe(
      JSON.stringify({
        fileName: "apical-lordotic.dcm",
        checksum: "pZzpJIWoY5Ma8hNwtQguuKDCWMHNdK4GjbCtR66sE0Q=",
      }),
    );

    expect(petsApiMock.history.put[2].data).toBe(
      JSON.stringify({
        fileName: "lateral-decubitus.dcm",
        checksum: "pZzpJIWoY5Ma8hNwtQguuKDCWMHNdK4GjbCtR66sE0Q=",
      }),
    );

    expect(defaultAxiosMock.history.post.length).toBe(3);
  });

  it("errors when postero anterior xray is missing", async () => {
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
    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);
    const errorSummaryDiv = screen.getByTestId("error-summary");
    expect(errorSummaryDiv).toHaveFocus();
  });
});
