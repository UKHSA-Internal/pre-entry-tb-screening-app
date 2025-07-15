import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import TbCertificateDeclarationPage from "@/pages/tb-certificate-declaration";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";
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

describe("TB Certificate Declaration Page", () => {
  test("renders form correctly", () => {
    renderWithProviders(
      <Router>
        <TbCertificateDeclarationForm />
      </Router>,
    );

    expect(screen.getByText("Enter clinic and certificate information")).toBeInTheDocument();
    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue expiry")).toBeInTheDocument();
    expect(screen.getByText("Declaring Physician's name")).toBeInTheDocument();
    expect(screen.getByText("Physician's notes (optional)")).toBeInTheDocument();
  });

  test("errors when required fields are missing", async () => {
    renderWithProviders(
      <Router>
        <TbCertificateDeclarationForm />
      </Router>,
    );

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Enter the declaring physician's name")).toBeInTheDocument();
    });
  });

  test("displays clinic information and form fields", () => {
    renderWithProviders(
      <Router>
        <TbCertificateDeclarationForm />
      </Router>,
    );

    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("Lakeside Medical & TB Screening Centre")).toBeInTheDocument();
    expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue expiry")).toBeInTheDocument();

    expect(screen.getByTestId("declaring-physician-name")).toBeInTheDocument();
    expect(screen.getByTestId("physician-comments")).toBeInTheDocument();
  });

  test("renders page elements correctly", () => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <TbCertificateDeclarationPage />
        </HelmetProvider>
      </Router>,
    );

    const breadcrumbElement = screen.getByText("Application progress tracker");
    expect(breadcrumbElement).toBeInTheDocument();
    expect(breadcrumbElement.closest("a")).toHaveAttribute("href", "/tracker");

    expect(screen.getByText("Enter clinic and certificate information")).toBeInTheDocument();
  });
});
