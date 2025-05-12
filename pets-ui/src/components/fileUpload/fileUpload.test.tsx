import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BrowserRouter as Router } from "react-router-dom";
import { Mock } from "vitest";

import { ImageType } from "@/utils/enums";
import validateFiles from "@/utils/validateFiles";

import FileUpload, { FileUploadProps } from "./fileUpload";

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

const renderWithFormProvider = (ui: React.ReactElement) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm();
    const onSubmit = vi.fn();
    return (
      <Router>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
        </FormProvider>
      </Router>
    );
  };
  return render(ui, { wrapper: Wrapper });
};

const mockSetFileState = vi.fn();
const mockSetFileName = vi.fn();

const defaultProps: FileUploadProps = {
  id: "test-file-upload",
  legend: "Upload a file",
  hint: "Please upload a file",
  formValue: "testFile",
  required: "File is required",
  type: ImageType.Photo,
  setFileState: mockSetFileState,
  setFileName: mockSetFileName,
};

describe("FileUpload Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component", () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    expect(screen.getByText("Upload a file")).toBeInTheDocument();
    expect(screen.getByText("Please upload a file")).toBeInTheDocument();
  });

  it("renders existing file name", () => {
    renderWithFormProvider(<FileUpload {...defaultProps} existingFileName="existing_file.jpg" />);
    expect(screen.getByText("existing_file.jpg")).toBeInTheDocument();
  });

  it("calls setFileState and setFileName on file change", async () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId("test-file-upload");
    const file = new File(["dummy"], "file.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(mockSetFileState).toHaveBeenCalledWith(file);
      expect(mockSetFileName).toHaveBeenCalledWith("file.jpg");
    });
  });

  it("should show required error if no file is uploaded", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);

    renderWithFormProvider(
      <>
        <FileUpload {...defaultProps} />
        <button type="submit">Submit</button>
      </>,
    );

    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("File is required")).toBeInTheDocument();
    });
  });

  it("should call validateFiles and show error if file fails validation", async () => {
    vi.mocked(validateFiles).mockResolvedValue(["File is too large"]);

    const file = new File(["a".repeat(12 * 1024 * 1024)], "example.jpg", { type: "image/jpeg" });

    renderWithFormProvider(
      <>
        <FileUpload {...defaultProps} />
        <button type="submit">Submit</button>
      </>,
    );

    const input: HTMLInputElement = screen.getByTestId("test-file-upload");
    await userEvent.upload(input, file);
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("File is too large")).toBeInTheDocument();
      expect(useNavigateMock).not.toHaveBeenCalled();
    });
  });
});
