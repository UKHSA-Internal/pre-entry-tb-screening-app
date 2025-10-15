/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { screen } from "@testing-library/react";
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

    expect(screen.getByText("Give further details (optional)")).toBeInTheDocument;
    expect(screen.getByText("Enter X-ray findings")).toBeInTheDocument;
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

  it("renders page elements correctly", () => {
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayFindingsPage />
      </HelmetProvider>,
    );

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/chest-x-ray-results");
    expect(link).toHaveClass("govuk-back-link");
  });

  it("navigates to cxr summary when form is complete and submit button is clicked", async () => {
    const preloadedState = {
      radiologicalOutcome: {
        status: ApplicationStatus.NOT_YET_STARTED,
        chestXrayTaken: YesOrNo.YES,
        reasonXrayWasNotTaken: "",
        xrayWasNotTakenFurtherDetails: "",
        xrayResult: "",
        xrayResultDetail: "",
        xrayMinorFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayActiveTbFindings: [],
        completionDate: { year: "", month: "", day: "" },
      },
    };
    renderWithProviders(
      <HelmetProvider>
        <ChestXrayFindingsPage />
      </HelmetProvider>,
      { preloadedState },
    );
    await user.click(screen.getByRole("button"));
    expect(useNavigateMock).toHaveBeenLastCalledWith("/check-chest-x-ray-results-findings");
  });
});
