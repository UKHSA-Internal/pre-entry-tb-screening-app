/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
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
    renderWithProviders(<TbCertificateDeclarationForm />);

    expect(screen.getByText("Has a TB clearance certificate been issued?")).toBeInTheDocument;
    expect(screen.getByText("Yes")).toBeInTheDocument;
    expect(screen.getByText("Give further details (optional)")).toBeInTheDocument;
    expect(screen.getByText("If a clearance certificate has been issued, give:")).toBeInTheDocument;
    expect(screen.getByText("Date of TB clearance certificate")).toBeInTheDocument;
    expect(screen.getByText("For example, 30 3 2024")).toBeInTheDocument;
    expect(screen.getByText("Month")).toBeInTheDocument;
    expect(screen.getByText("TB clearance certificate number")).toBeInTheDocument;
  });

  test("errors when tb certificate issued selection is missing", async () => {
    renderWithProviders(<TbCertificateDeclarationForm />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Select yes if a TB clearance certificate has been issued or no if it has not",
        ),
      ).toBeInTheDocument();
    });
  });

  test("errors for tb clearance certificate date and tb clearance certificate number show when those fields are empty and 'Yes' is selected", async () => {
    renderWithProviders(<TbCertificateDeclarationForm />);

    const radioButtons = screen.getAllByTestId("tb-clearance-issued");
    fireEvent.click(radioButtons[0]);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(
        screen.getByText("TB clearance certificate date must include a day, month and year"),
      ).toBeInTheDocument();
      expect(screen.getByText("Enter the TB clearance certificate number")).toBeInTheDocument();
    });
  });

  test("renders page elements correctly", () => {
    renderWithProviders(
      <HelmetProvider>
        <TbCertificateDeclarationPage />
      </HelmetProvider>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tracker");
    expect(link).toHaveClass("govuk-back-link");

    expect(screen.getByText("Enter TB clearance certificate declaration")).toBeInTheDocument();
  });
});
