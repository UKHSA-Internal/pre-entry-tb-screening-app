import { fireEvent, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { ApplicantPhotoProvider } from "@/context/applicantPhotoContext";
import TbCertificatePrintPage from "@/pages/tb-certificate-print";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

vi.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: ({ children, fileName }: { children: React.ReactNode; fileName: string }) => (
    <a href="#" download={fileName} data-testid="pdf-download-link">
      {children}
    </a>
  ),
  PDFViewer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-viewer" className="pdf-viewer-mock">
      {children}
    </div>
  ),
  usePDF: () => [
    {
      url: "mock-pdf-url",
      loading: false,
      error: null,
    },
    vi.fn(),
  ],
}));

vi.mock("@/components/certificateTemplate/certificateTemplate", () => ({
  CertificateTemplate: ({ applicantData }: { applicantData: { fullName?: string } }) => (
    <div data-testid="certificate-template">
      Certificate for {applicantData?.fullName || "Unknown"}
    </div>
  ),
}));

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const mockPrint = vi.fn();
const mockAddEventListener = vi.fn();
const mockOpen = vi.fn(() => ({
  print: mockPrint,
  addEventListener: mockAddEventListener,
}));

Object.defineProperty(window, "open", {
  writable: true,
  value: mockOpen,
});

beforeEach(() => {
  useNavigateMock.mockClear();
  mockPrint.mockClear();
  mockAddEventListener.mockClear();
  mockOpen.mockClear();
});

const mockPreloadedState = {
  applicant: {
    status: ApplicationStatus.COMPLETE,
    fullName: "John Smith",
    sex: "Male",
    dateOfBirth: { year: "1970", month: "01", day: "01" },
    countryOfNationality: "UK",
    passportNumber: "1111",
    countryOfIssue: "UK",
    passportIssueDate: { year: "2020", month: "01", day: "01" },
    passportExpiryDate: { year: "2030", month: "01", day: "01" },
    applicantHomeAddress1: "Test",
    applicantHomeAddress2: "",
    applicantHomeAddress3: "",
    townOrCity: "Test",
    provinceOrState: "Test",
    country: "UK",
    postcode: "0011 000",
  },
  application: {
    applicationId: "123",
    dateCreated: "2025-01-01",
  },
  tbCertificate: {
    status: ApplicationStatus.COMPLETE,
    isIssued: YesOrNo.YES,
    certificateNumber: "1111",
    certificateDate: { year: "2025", month: "01", day: "01" },
    declaringPhysicianName: "Test Testov",
    comments: "Test comments",
    reasonNotIssued: "",
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
};

const renderTbCertificatePrintPage = (preloadedState = mockPreloadedState) => {
  return renderWithProviders(
    <HelmetProvider>
      <ApplicantPhotoProvider>
        <TbCertificatePrintPage />
      </ApplicantPhotoProvider>
    </HelmetProvider>,
    { preloadedState },
  );
};

describe("TB Certificate Print Page", () => {
  test("renders page elements correctly", () => {
    renderTbCertificatePrintPage();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("TB clearance certificate");

    const backLink = screen.getByRole("link", { name: "Back" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/tb-screening-complete");
    expect(backLink).toHaveClass("govuk-back-link");

    const printLink = screen.getByText("Print the certificate").closest("a");
    expect(printLink).toBeInTheDocument();
    expect(printLink).toHaveClass("print-trigger", "govuk-link");

    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();

    expect(screen.getByTestId("certificate-template")).toBeInTheDocument();
  });

  test("displays correct print icon and text", () => {
    renderTbCertificatePrintPage();

    const printImage = screen.getByAltText("Print Certificate");
    expect(printImage).toBeInTheDocument();
    expect(printImage).toHaveAttribute("src", "/assets/images/printer.svg");
    expect(printImage).toHaveAttribute("height", "32");
    expect(printImage).toHaveClass("govuk-!-margin-right-2");

    expect(screen.getByText("Print the certificate")).toBeInTheDocument();
  });

  test("handles print functionality when print link is clicked", () => {
    renderTbCertificatePrintPage();

    const printLink = screen.getByText("Print the certificate").closest("a");
    expect(printLink).toHaveAttribute("href", "mock-pdf-url");

    fireEvent.click(printLink!);

    expect(mockOpen).toHaveBeenCalledWith("mock-pdf-url");
  });

  test("renders certificate with correct application data", () => {
    renderTbCertificatePrintPage();

    const certificateTemplate = screen.getByTestId("certificate-template");
    expect(certificateTemplate).toHaveTextContent("Certificate for John Smith");

    const pdfViewer = screen.getByTestId("pdf-viewer");
    expect(pdfViewer).toBeInTheDocument();
  });
});
