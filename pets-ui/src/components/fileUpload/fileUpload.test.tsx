import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import FileUpload, { FileUploadProps } from "./fileUpload";

const renderWithFormProvider = (ui: React.ReactElement) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };
  return render(ui, { wrapper: Wrapper });
};

const defaultProps: FileUploadProps = {
  id: "test-file-upload",
  legend: "Upload a file",
  hint: "Please upload a file",
  errorMessage: "",
  formValue: "testFile",
  required: "File is required",
  accept: "jpg,jpeg,png,pdf",
  maxSize: 5, // 5 MB
  setFileState: vi.fn(),
};

describe("FileUpload Component", () => {
  it("renders the component", () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    expect(screen.getByText("Upload a file")).toBeInTheDocument();
    expect(screen.getByText("Please upload a file")).toBeInTheDocument();
  });

  it("validates the file type", async () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId("test-file-upload");
    const file = new File(["dummy content"], "example.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText("File type should be jpg, jpeg, png, pdf")).toBeInTheDocument();
  });

  it("validates the file size", async () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId("test-file-upload");
    const file = new File(["a".repeat(6 * 1024 * 1024)], "example.jpg", { type: "image/jpeg" }); // 6 MB file
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText("File size should be less than 5 MB")).toBeInTheDocument();
  });

  it("displays an error message when file is not uploaded", async () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId("test-file-upload");
    fireEvent.change(input, { target: { files: [] } });
    expect(await screen.findByText("File is required")).toBeInTheDocument();
  });

  it("accepts a valid file", () => {
    renderWithFormProvider(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId("test-file-upload");
    const file = new File(["dummy content"], "example.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.queryByText("File type should be jpg, jpeg, png, pdf")).not.toBeInTheDocument();
    expect(screen.queryByText("File size should be less than 5 MB")).not.toBeInTheDocument();
  });
});
