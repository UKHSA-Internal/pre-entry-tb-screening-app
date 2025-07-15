import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import TbCertificateNotIssuedForm from "@/sections/tb-certificate-not-issued-form";
import { renderWithProviders } from "@/utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TbCertificateNotIssuedForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with all required fields", () => {
    renderWithProviders(
      <HelmetProvider>
        <BrowserRouter>
          <TbCertificateNotIssuedForm />
        </BrowserRouter>
      </HelmetProvider>,
    );

    expect(screen.getByText("Why are you not issuing a certificate?")).toBeInTheDocument();
    expect(screen.getByText("Why are you not issuing a certificate")).toBeInTheDocument();
    expect(screen.getByText("Declaring Physician name")).toBeInTheDocument();
    expect(screen.getByText("Physician comments (Optional)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("displays all radio button options for reason not issued", () => {
    renderWithProviders(
      <HelmetProvider>
        <BrowserRouter>
          <TbCertificateNotIssuedForm />
        </BrowserRouter>
      </HelmetProvider>,
    );

    expect(screen.getByText("Confirmed or suspected TB")).toBeInTheDocument();
    expect(screen.getByText("Testing postponed")).toBeInTheDocument();
    expect(
      screen.getByText("Visa applicant has withdrawn their TB application"),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderWithProviders(
      <HelmetProvider>
        <BrowserRouter>
          <TbCertificateNotIssuedForm />
        </BrowserRouter>
      </HelmetProvider>,
    );

    const continueButton = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText("Select why you are not issuing a certificate")).toBeInTheDocument();
      expect(screen.getByText("Enter the declaring physician name")).toBeInTheDocument();
    });
  });

  it("allows form submission with valid data", async () => {
    renderWithProviders(
      <HelmetProvider>
        <BrowserRouter>
          <TbCertificateNotIssuedForm />
        </BrowserRouter>
      </HelmetProvider>,
    );

    const reasonRadio = screen.getByDisplayValue("Confirmed or suspected TB");
    fireEvent.click(reasonRadio);

    const physicianNameInput = screen.getByLabelText("Declaring Physician name");
    fireEvent.change(physicianNameInput, { target: { value: "Dr. Smith" } });

    const commentsTextarea = screen.getByLabelText("Physician comments (Optional)");
    fireEvent.change(commentsTextarea, { target: { value: "Test comments" } });

    const continueButton = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/tb-certificate-summary");
    });
  });

  it("validates physician name field pattern", async () => {
    renderWithProviders(
      <HelmetProvider>
        <BrowserRouter>
          <TbCertificateNotIssuedForm />
        </BrowserRouter>
      </HelmetProvider>,
    );

    const reasonRadio = screen.getByDisplayValue("Testing postponed");
    fireEvent.click(reasonRadio);

    const physicianNameInput = screen.getByLabelText("Declaring Physician name");
    fireEvent.change(physicianNameInput, { target: { value: "Dr. Smith123" } });

    const continueButton = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(
        screen.getByText("Physician name must contain only letters, spaces and punctuation"),
      ).toBeInTheDocument();
    });
  });
});
