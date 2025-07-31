/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import ChestXrayFindingsPage from "@/pages/chest-xray-findings";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

beforeEach(() => useNavigateMock.mockClear());

const user = userEvent.setup();

describe("ChestXrayFindings Form", () => {
  it("renders form correctly", () => {
    renderWithProviders(<ChestXrayFindingsForm />);

    expect(screen.getByText("Chest X-ray normal")).toBeInTheDocument;
    expect(screen.getByText("Give further details (optional)")).toBeInTheDocument;
    expect(screen.getByText("Radiographic findings")).toBeInTheDocument;
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
    renderWithProviders(<ChestXrayFindingsForm />);

    fireEvent.click(screen.getByText("Save and continue"));

    await waitFor(() => {
      expect(screen.getAllByText("Select radiological outcome")).toHaveLength(2);
      expect(screen.getAllByText("Select radiological outcome")[0]).toHaveAttribute(
        "aria-label",
        "Error: Select radiological outcome",
      );
    });
  });

  it("renders an in focus error summary when continue button pressed but required questions not answered", async () => {
    renderWithProviders(<ChestXrayFindingsForm />);
    fireEvent.click(screen.getByText("Save and continue"));
    await waitFor(() => {
      const errorSummaryDiv = screen.getByTestId("error-summary");
      expect(errorSummaryDiv).toHaveFocus();
    });
  });

  it("renders page elements correctly", () => {
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayFindingsPage />
      </HelmetProvider>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/chest-xray-upload");
    expect(link).toHaveClass("govuk-back-link");

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If a visa applicant's chest X-rays indicate that they have pulmonary TB, give them a referral letter and copies of the:",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter radiological outcome and findings")).toBeInTheDocument;
  });

  it("navigates to cxr summary when form is complete and submit button is clicked", async () => {
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
        xrayResult: "",
        xrayResultDetail: "",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        isSputumRequired: YesOrNo.NULL,
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayFindingsPage />
      </HelmetProvider>,
      { preloadedState },
    );
    await user.click(screen.getAllByTestId("xray-result")[0]);
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/sputum-question");
  });
});
