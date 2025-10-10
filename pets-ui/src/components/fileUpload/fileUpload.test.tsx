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

  it("should trigger onChange when files are dropped", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);

    const dicomProps = { ...defaultProps, type: ImageType.Dicom };

    renderWithFormProvider(
      <>
        <FileUpload {...dicomProps} />
        <button type="submit">Submit</button>
      </>,
    );

    await user.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(screen.getByText("File is required")).toBeInTheDocument();
    });

    const dropArea = screen
      .getByTestId("test-file-upload")
      .closest('[data-module="govuk-file-upload"]');
    const dcmFile = new File(["dicom content"], "scan.dcm", { type: "application/dicom" });

    fireEvent.drop(dropArea!, {
      dataTransfer: {
        files: [dcmFile],
      },
    });

    await waitFor(() => {
      expect(screen.getByText("scan.dcm")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.queryByText("File is required")).toBeNull();
    });
  });

  it("updates file input when dropping a file", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);

    let branchExecuted = false;

    class MockDataTransfer {
      files = [] as unknown as FileList;
      items = {
        add: () => {
          branchExecuted = true;
        },
      };
    }

    const original = globalThis.DataTransfer;
    globalThis.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer;

    try {
      renderWithFormProvider(<FileUpload {...defaultProps} />);

      const dropArea = screen
        .getByTestId("test-file-upload")
        .closest('[data-module="govuk-file-upload"]');
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      const input = screen.getByTestId("test-file-upload");

      Object.defineProperty(input, "files", {
        set: vi.fn(),
        get: () => null,
        configurable: true,
      });

      fireEvent.drop(dropArea!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(branchExecuted).toBe(true);
        expect(screen.getByText("test.jpg")).toBeInTheDocument();
      });
    } finally {
      globalThis.DataTransfer = original;
    }
  });

  it("should restore lastFile when user cancels file selection", async () => {
    vi.mocked(validateFiles).mockResolvedValue(true);

    renderWithFormProvider(<FileUpload {...defaultProps} />);

    const input: HTMLInputElement = screen.getByTestId("test-file-upload");
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });

    await userEvent.upload(input, file);

    const mockDataTransfer = {
      files: null as unknown as FileList,
      items: { add: vi.fn() },
    };
    const original = globalThis.DataTransfer;
    globalThis.DataTransfer = vi.fn(() => mockDataTransfer) as unknown as typeof DataTransfer;

    fireEvent.change(input, { target: { files: [] } });

    await waitFor(() => {
      expect(mockDataTransfer.items.add).toHaveBeenCalledWith(file);
    });

    globalThis.DataTransfer = original;
  });
});
