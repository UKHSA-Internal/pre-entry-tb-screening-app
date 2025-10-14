import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import TbCertificateDeclarationPage from "@/pages/tb-certificate-declaration";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";
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

beforeEach(() => useNavigateMock.mockClear());

describe("TB Certificate Declaration Page", () => {
  test("renders form correctly", () => {
    renderWithProviders(<TbCertificateDeclarationForm />);

    expect(screen.getByText("Enter clinic and certificate information")).toBeInTheDocument();
    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue expiry")).toBeInTheDocument();
    expect(screen.getByText("Declaring Physician's name")).toBeInTheDocument();
    expect(screen.getByText("Physician's notes (optional)")).toBeInTheDocument();
  });

  test("errors when tb certificate issued selection is missing", async () => {
    renderWithProviders(<TbCertificateDeclarationForm />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Enter the declaring physician's name")).toBeInTheDocument();
    });
  });

  test("errors for tb clearance certificate date and tb clearance certificate number show when those fields are empty and 'Yes' is selected", () => {
    renderWithProviders(<TbCertificateDeclarationForm />, {
      preloadedState: {
        tbCertificate: {
          status: ApplicationStatus.NOT_YET_STARTED,
          isIssued: YesOrNo.NULL,
          comments: "",
          certificateDate: { year: "", month: "", day: "" },
          certificateNumber: "",
          reasonNotIssued: "",
          declaringPhysicianName: "",
          clinic: {
            clinicId: "UK/LHR/00",
            name: "PETS Test Clinic",
            city: "London",
            country: "GBR",
            startDate: "2025-04-01",
            endDate: null,
            createdBy: "tmp@email.com",
          },
        },
      },
    });

    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("PETS Test Clinic")).toBeInTheDocument();
    expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue expiry")).toBeInTheDocument();

    expect(screen.getByTestId("declaring-physician-name")).toBeInTheDocument();
    expect(screen.getByTestId("physician-comments")).toBeInTheDocument();
  });

  test("renders page elements correctly", () => {
    renderWithProviders(
      <HelmetProvider>
        <TbCertificateDeclarationPage />
      </HelmetProvider>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/will-you-issue-tb-clearance-certificate");
    expect(link).toHaveClass("govuk-back-link");

    expect(screen.getByText("Enter clinic and certificate information")).toBeInTheDocument();
  });
});
