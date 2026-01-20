import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock, vi } from "vitest";

import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import CheckApplicantPhotoPage from "@/pages/check-applicant-photo";
import CheckApplicantPhoto from "@/sections/check-applicant-photo";
import { ApplicationStatus, ImageType } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";
import uploadFile from "@/utils/uploadFile";

vi.mock("@/context/applicantPhotoContext", () => ({
  useApplicantPhoto: vi.fn(),
}));

vi.mock("@/utils/uploadFile", () => ({
  default: vi.fn(),
}));

const useNavigateMock: Mock = vi.fn();
const useLocationMock: Mock = vi.fn();

vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
    useLocation: () => useLocationMock() as unknown,
  };
});

const setApplicantPhotoFile = vi.fn();
const user = userEvent.setup();

const mockFileReader = {
  readAsDataURL: vi.fn(),
  result: "data:image/jpeg;base64,dummycontent",
  onload: null as (() => void) | null,
};

vi.stubGlobal(
  "FileReader",
  vi.fn(function () {
    return mockFileReader;
  }),
);

describe("CheckApplicantPhoto", () => {
  const mockFile = new File(["dummy content"], "photo.jpg", { type: "image/jpeg" });

  beforeEach(() => {
    (useApplicantPhoto as Mock).mockReturnValue({
      setApplicantPhotoFile,
    });
    useLocationMock.mockReturnValue({
      state: { applicantPhoto: mockFile },
    });
    vi.clearAllMocks();

    mockFileReader.readAsDataURL.mockImplementation(() => {
      if (mockFileReader.onload) {
        mockFileReader.onload();
      }
    });
  });

  it("displays page correctly", async () => {
    renderWithProviders(
      <HelmetProvider>
        <CheckApplicantPhotoPage />
      </HelmetProvider>,
    );

    expect(screen.getByText("Check visa applicant photo")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByAltText("Applicant preview")).toBeInTheDocument();
    });
    expect(screen.getByText(/photo.jpg/)).toBeInTheDocument();
    expect(screen.getByText("Yes, add this photo")).toBeInTheDocument();
    expect(screen.getByText("No, choose a different photo")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("navigates to check details when 'Yes' is selected", async () => {
    const { store } = renderWithProviders(<CheckApplicantPhoto />);

    const yesRadio = screen.getByLabelText("Yes, add this photo");
    await user.click(yesRadio);

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(store.getState().applicant.applicantPhotoFileName).toBe("photo.jpg");
      expect(setApplicantPhotoFile).toHaveBeenCalledWith(mockFile);
      expect(useNavigateMock).toHaveBeenCalledWith("/check-visa-applicant-details");
    });
  });

  it("returns to upload page when 'No' is selected without clearing context", async () => {
    renderWithProviders(<CheckApplicantPhoto />);

    const noRadio = screen.getByLabelText("No, choose a different photo");
    await user.click(noRadio);

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(setApplicantPhotoFile).not.toHaveBeenCalled();
      expect(useNavigateMock).toHaveBeenCalledWith("/upload-visa-applicant-photo");
    });
  });

  it("uploads file and navigates to summary when application status is COMPLETE", async () => {
    vi.mocked(uploadFile).mockResolvedValue("success");

    const preloadedState = {
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "",
        sex: "",
        dateOfBirth: { year: "", month: "", day: "" },
        countryOfNationality: "",
        passportNumber: "",
        countryOfIssue: "",
        passportIssueDate: { year: "", month: "", day: "" },
        passportExpiryDate: { year: "", month: "", day: "" },
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        country: "",
        postcode: "",
        applicantPhotoFileName: "",
      },
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(<CheckApplicantPhoto />, { preloadedState });

    const yesRadio = screen.getByLabelText("Yes, add this photo");
    await user.click(yesRadio);

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalledWith(
        mockFile,
        "applicant-photo.jpg",
        "abc-123",
        ImageType.Photo,
      );
      expect(useNavigateMock).toHaveBeenCalledWith("/check-visa-applicant-details");
    });
  });

  it("navigates to error page when upload fails and application status is COMPLETE", async () => {
    vi.mocked(uploadFile).mockRejectedValue(new Error("Upload failed"));

    const preloadedState = {
      applicant: {
        status: ApplicationStatus.COMPLETE,
        fullName: "",
        sex: "",
        dateOfBirth: { year: "", month: "", day: "" },
        countryOfNationality: "",
        passportNumber: "",
        countryOfIssue: "",
        passportIssueDate: { year: "", month: "", day: "" },
        passportExpiryDate: { year: "", month: "", day: "" },
        applicantHomeAddress1: "",
        applicantHomeAddress2: "",
        applicantHomeAddress3: "",
        townOrCity: "",
        provinceOrState: "",
        country: "",
        postcode: "",
        applicantPhotoFileName: "",
      },
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(<CheckApplicantPhoto />, { preloadedState });

    const yesRadio = screen.getByLabelText("Yes, add this photo");
    await user.click(yesRadio);

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(uploadFile).toHaveBeenCalled();
      expect(useNavigateMock).toHaveBeenCalledWith("/sorry-there-is-problem-with-service");
    });
  });
});
