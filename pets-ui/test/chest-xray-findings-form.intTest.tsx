/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import ChestXrayFindingsPage from "@/pages/chest-xray-findings";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";
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

describe("ChestXrayFindings Form", () => {
  it("renders form correctly", () => {
    renderWithProviders(
      <Router>
        <ChestXrayFindingsForm />
      </Router>,
    );

    expect(screen.getByText("Name")).toBeInTheDocument;
    expect(screen.getByText("Chest X-ray normal")).toBeInTheDocument;
    expect(screen.getByText("Add details if X-ray results are abnormal")).toBeInTheDocument;
    expect(screen.getByText("X-ray findings")).toBeInTheDocument;
    expect(screen.getByText("Minor findings")).toBeInTheDocument;
    expect(screen.getByText("1.1 Single fibrous streak or band or scar")).toBeInTheDocument;
    expect(screen.getByText("Minor findings (occasionally associated with TB infection)"))
      .toBeInTheDocument;
    expect(
      screen.getByText(
        "3.1 Solitary granuloma (less than 1cm and of any lobe) with an unremarkable hilum",
      ),
    ).toBeInTheDocument;
    expect(screen.getByText("Findings sometimes seen in active TB (or other conditions)"))
      .toBeInTheDocument;
    expect(
      screen.getByText(
        "4.0 Notable apical pleural capping (rough or ragged inferior border an/or equal or greater than 1cm thick at any point)",
      ),
    ).toBeInTheDocument;
  });

  it("errors when x-ray result selection is missing", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayFindingsForm />
      </Router>,
    );

    fireEvent.click(screen.getByText("Save and continue"));

    await waitFor(() => {
      expect(screen.getAllByText("Select an X-ray result")).toHaveLength(2);
      expect(screen.getAllByText("Select an X-ray result")[0]).toHaveAttribute(
        "aria-label",
        "Select an X-ray result",
      );
    });
  });
  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(
      <Router>
        <ChestXrayFindingsForm />
      </Router>,
    );
    fireEvent.click(screen.getByText("Save and continue"));
    await waitFor(() => {
      const errorSummaryDiv = screen.getByTestId("error-summary");
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("renders page elements correctly", () => {
    renderWithProviders(
      <Router>
        <HelmetProvider>
          <ChestXrayFindingsPage />
        </HelmetProvider>
      </Router>,
    );

    const breadcrumbElement = screen.getByText("Application progress tracker");
    expect(breadcrumbElement).toBeInTheDocument();
    expect(breadcrumbElement.closest("a")).toHaveAttribute("href", "/tracker");

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If a visa applicant's chest X-rays indicate that they have pulmonary TB, give them a referral letter and copies of the:",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter radiological outcome and findings")).toBeInTheDocument;
  });
});
