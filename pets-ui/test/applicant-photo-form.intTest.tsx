import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { Mock, vi } from "vitest";

import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import ApplicantPhotoForm from "@/sections/applicant-photo-form";
import { renderWithProviders } from "@/utils/test-utils";
import validateFiles from "@/utils/validateFiles";

vi.mock("@/context/applicantPhotoContext", () => ({
  useApplicantPhoto: vi.fn(),
}));

vi.mock("@/utils/validateFiles", () => ({
  default: vi.fn(),
}));

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

const setApplicantPhotoFile = vi.fn();
const user = userEvent.setup();

describe("ApplicantPhotoForm", () => {
  beforeEach(() => {
    (useApplicantPhoto as Mock).mockReturnValue({
      setApplicantPhotoFile,
    });
    vi.clearAllMocks();
  });

  it("displays page content correctly", () => {
    const preloadedState = {
      application: { applicationId: "abc-123", dateCreated: "" },
    };

    renderWithProviders(
      <HelmetProvider>
        <ApplicantPhotoForm />
      </HelmetProvider>,
      { preloadedState },
    );

    expect(screen.getByText("Upload visa applicant photo (optional)")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select a file to upload. File type must be JPG, JPEG or PNG. Images must be less than 10MB.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("submits form without a file and navigates", async () => {
    renderWithProviders(<ApplicantPhotoForm />);

    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => {
      expect(useNavigateMock).toHaveBeenCalledWith("/check-applicant-details");
    });
  });

  it("uploads a valid image and submits", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);

    renderWithProviders(<ApplicantPhotoForm />);

    const file = new File(["dummy content"], "photo.jpg", { type: "image/jpeg" });
    const input: HTMLInputElement = screen.getByTestId("applicant-photo");

    await userEvent.upload(input, file);
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(setApplicantPhotoFile).toHaveBeenCalledWith(file);
      expect(useNavigateMock).toHaveBeenCalledWith("/check-applicant-details");
    });
  });

  it("shows error and disallow continue button if validation fails", async () => {
    vi.mocked(validateFiles).mockResolvedValue(["The selected file must be a JPG, JPEG or PNG"]);

    renderWithProviders(<ApplicantPhotoForm />);

    const file = new File(["dummy content"], "photo.pdf", { type: "image/pdf" });
    const input: HTMLInputElement = screen.getByTestId("applicant-photo");

    await userEvent.upload(input, file);
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getAllByText("The selected file must be a JPG, JPEG or PNG")).toHaveLength(2);
      expect(setApplicantPhotoFile).not.toHaveBeenCalled();
      expect(useNavigateMock).not.toHaveBeenCalled();
    });
  });

  it("removes validation error on file change", async () => {
    vi.mocked(validateFiles).mockResolvedValue(["The selected file must be a JPG, JPEG or PNG"]);

    renderWithProviders(<ApplicantPhotoForm />);

    const invalidFile = new File(["dummy content"], "photo.pdf", { type: "image/pdf" });
    const input: HTMLInputElement = screen.getByTestId("applicant-photo");

    await userEvent.upload(input, invalidFile);
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getAllByText("The selected file must be a JPG, JPEG or PNG")).toHaveLength(2);
    });

    // simulate change of file
    const anotherFile = new File(["dummy content"], "photo.jpg", { type: "image/jpeg" });
    await userEvent.upload(input, anotherFile);

    await waitFor(() => {
      expect(
        screen.queryByText("The selected file must be a JPG, JPEG or PNG"),
      ).not.toBeInTheDocument();
    });
  });
});
