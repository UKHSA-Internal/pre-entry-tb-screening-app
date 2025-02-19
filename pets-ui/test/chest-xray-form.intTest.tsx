import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it, Mock } from "vitest";

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

beforeEach(() => useNavigateMock.mockClear());

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
  it("renders components correctly", () => {
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

  it("uploads three X-ray files", () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
    );

    const posteroAnteriorInput: HTMLInputElement = screen.getByTestId("postero-anterior-xray");
    const apicalLordoticInput: HTMLInputElement = screen.getByTestId("apical-lordotic-xray");
    const lateralDecubitusInput: HTMLInputElement = screen.getByTestId("lateral-decubitus-xray");
    const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });

    expect(posteroAnteriorInput).toBeInTheDocument();
    expect(apicalLordoticInput).toBeInTheDocument();
    expect(lateralDecubitusInput).toBeInTheDocument();
    expect(posteroAnteriorInput.files).toHaveLength(0);
    expect(apicalLordoticInput.files).toHaveLength(0);
    expect(lateralDecubitusInput.files).toHaveLength(0);

    fireEvent.change(posteroAnteriorInput, { target: { files: [file] } });
    fireEvent.change(apicalLordoticInput, { target: { files: [file] } });
    fireEvent.change(lateralDecubitusInput, { target: { files: [file] } });

    expect(posteroAnteriorInput.files).toHaveLength(1);
    expect(apicalLordoticInput.files).toHaveLength(1);
    expect(lateralDecubitusInput.files).toHaveLength(1);
  });

  it("errors when postero anterior xray is missing", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayForm />
      </Router>,
    );

    const user = userEvent.setup({ applyAccept: false });
    const posteroAnteriorInput: HTMLInputElement = screen.getByTestId("postero-anterior-xray");
    const submitButton = screen.getByRole("button", { name: /continue/i });

    expect(posteroAnteriorInput).toBeInTheDocument();
    expect(posteroAnteriorInput.files).toHaveLength(0);

    await user.click(submitButton);
    expect(useNavigateMock).not.toHaveBeenCalled();
    expect(screen.getByText("Please upload postero-anterior X-ray")).toBeInTheDocument();
  });
});
