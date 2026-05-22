import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import { petsApi } from "@/api/api";
import TbCertificateDeclarationPage from "@/pages/tb-certificate-declaration";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";
import { ApplicationStatus, TaskStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

let mock: MockAdapter;
beforeEach(() => {
  mock = new MockAdapter(petsApi);
  useNavigateMock.mockClear();
});

const preloadedState = {
  user: {
    jobTitle: "",
    clinicId: "my-clinic",
    name: "Bilb O'Baggins",
    isSuperUser: false,
  },
  application: {
    applicationId: "528db370-1325-43a3-81f2-e60a4f015afe",
    applicationStatus: ApplicationStatus.IN_PROGRESS,
    clinicId: "my-clinic",
    dateCreated: { year: "", month: "", day: "" },
  },
  tbCertificate: {
    status: TaskStatus.NOT_YET_STARTED,
    isIssued: YesOrNo.NULL,
    comments: "",
    certificateDate: { year: "", month: "", day: "" },
    certificateNumber: "",
    reasonNotIssued: "",
    declaringPhysicianName: "",
    clinic: {
      clinicId: "my-clinic",
      name: "Test Clinic",
      city: "London",
      country: "GBR",
      startDate: "2025-04-01",
      endDate: null,
      createdBy: "tmp@email.com",
    },
  },
};
const superUserPreloadedState = {
  ...preloadedState,
  user: { ...preloadedState.user, isSuperUser: true },
  tbCertificate: { ...preloadedState.tbCertificate, status: TaskStatus.COMPLETE },
};

describe("TB Certificate Declaration Page", () => {
  test("renders form correctly", () => {
    renderWithProviders(<TbCertificateDeclarationForm />);
    expect(screen.getByText("You have 150 words remaining")).toBeInTheDocument();

    expect(screen.getByText("Clinic and certificate information")).toBeInTheDocument();
    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("Certificate reference number")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue date")).toBeInTheDocument();
    expect(screen.getByText("Certificate issue expiry")).toBeInTheDocument();
    expect(screen.getByText("Declaring Physician's name")).toBeInTheDocument();
    expect(
      screen.getByText(
        "For example, include your name if you are completing the information for the declaring physician",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Physician's notes (optional)")).toBeInTheDocument();
  });

  test("errors when tb certificate issued selection is missing", async () => {
    renderWithProviders(<TbCertificateDeclarationForm />);
    expect(screen.getByText("You have 150 words remaining")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Enter the declaring physician's name")).toBeInTheDocument();
    });
  });

  test("errors for tb clearance certificate date and tb clearance certificate number show when those fields are empty and 'Yes' is selected", () => {
    renderWithProviders(<TbCertificateDeclarationForm />, { preloadedState });
    expect(screen.getByText("You have 150 words remaining")).toBeInTheDocument();

    expect(screen.getByText("Clinic name")).toBeInTheDocument();
    expect(screen.getByText("Test Clinic")).toBeInTheDocument();
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
    expect(screen.getByText("You have 150 words remaining")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/will-you-issue-tb-clearance-certificate");
    expect(link).toHaveClass("govuk-back-link");

    expect(screen.getByText("Clinic and certificate information")).toBeInTheDocument();
  });

  test("correct error message is displayed when word count is exceeded in textarea field", async () => {
    const tooLongInput =
      "This string is 151 words long a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a";
    const user = userEvent.setup();
    renderWithProviders(
      <HelmetProvider>
        <TbCertificateDeclarationPage />
      </HelmetProvider>,
    );
    expect(screen.getByText("You have 150 words remaining")).toBeInTheDocument();

    await user.type(screen.getByTestId("physician-comments"), tooLongInput);
    expect(screen.getByText("You have 1 word too many")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(
        screen.getAllByText(`"Physician's notes (optional)" must be 150 words or fewer`),
      ).toHaveLength(2);
    });
  });

  test("correctly updates store on submit when user is non-super user", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<TbCertificateDeclarationForm />, { preloadedState });

    await user.type(screen.getByTestId("declaring-physician-name"), "Dr. Gan Dalf");
    await user.type(screen.getByTestId("physician-comments"), "Keep it secret, keep it safe.");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(store.getState().tbCertificate.status).toEqual(TaskStatus.IN_PROGRESS);
      expect(useNavigateMock).toHaveBeenCalledWith("/tb-certificate-summary");
    });
  });

  test("calls put endpoint & on success navigates to summary page (when superuser submits and task is already complete)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TbCertificateDeclarationForm />, {
      preloadedState: superUserPreloadedState,
    });
    mock.onPut("/application/528db370-1325-43a3-81f2-e60a4f015afe/tb-certificate").reply(200);

    await user.type(screen.getByTestId("declaring-physician-name"), "Dr. Gan Dalf");
    await user.type(screen.getByTestId("physician-comments"), "Keep it secret, keep it safe.");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenCalledWith("/tb-certificate-summary");
    });
  });

  test("calls put endpoint & on failure navigates to error page (when superuser submits and task is already complete)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TbCertificateDeclarationForm />, {
      preloadedState: superUserPreloadedState,
    });
    mock.onPut("/application/528db370-1325-43a3-81f2-e60a4f015afe/tb-certificate").reply(500);

    await user.type(screen.getByTestId("declaring-physician-name"), "Dr. Gan Dalf");
    await user.type(screen.getByTestId("physician-comments"), "Keep it secret, keep it safe.");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(mock.history.put).toHaveLength(1);
      expect(useNavigateMock).toHaveBeenCalledWith("/sorry-there-is-problem-with-service");
    });
  });
});
