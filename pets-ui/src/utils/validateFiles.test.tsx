import dicomParser, { DataSet } from "dicom-parser";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ImageType } from "@/utils/enums";
import validateFiles, { getImageType } from "@/utils/validateFiles";

vi.mock("dicom-parser", () => ({
  default: {
    parseDicom: vi.fn(),
  },
}));

describe("getImageType", () => {
  it("returns 'Photo' for JPG/PNG files", () => {
    expect(getImageType(new File([], "test.jpg"))).toBe("Photo");
    expect(getImageType(new File([], "test.jpeg"))).toBe("Photo");
    expect(getImageType(new File([], "test.png"))).toBe("Photo");
  });

  it("returns 'Dicom' for DCM files", () => {
    expect(getImageType(new File([], "test.dcm"))).toBe("Dicom");
  });

  it("returns undefined for unsupported extensions", () => {
    expect(getImageType(new File([], "test.pdf"))).toBeUndefined();
  });
});

describe("validateFiles", () => {
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalImage: typeof global.Image;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn(() => "blob:test");

    originalImage = global.Image;
    vi.clearAllMocks();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    global.Image = originalImage;
    vi.restoreAllMocks();
  });

  it("rejects unsupported file type for photo", async () => {
    const file = new File([""], "test.dcm", { type: "application/dicom" });
    const result = await validateFiles([file], ImageType.Photo);
    expect(result).toContain("The selected file must be a JPG, JPEG or PNG");
  });

  it("rejects unsupported file type for dicom", async () => {
    const file = new File([""], "test.jpg", { type: "application/jpeg" });
    const result = await validateFiles([file], ImageType.Dicom);
    expect(result).toContain("The selected file must be a DICOM file");
  });

  it("rejects invalid DICOM files", async () => {
    const file = new File(["invalid"], "scan.dcm", { type: "application/dicom" });
    Object.defineProperty(file, "size", { value: 1024 });
    vi.mocked(dicomParser.parseDicom).mockImplementation(() => {
      throw new Error("Invalid DICOM");
    });
    const result = await validateFiles([file], ImageType.Dicom);
    expect(result).toContain("The selected file is password protected or is an invalid DICOM file");
  });

  it("rejects invalid photo files (img.onerror)", async () => {
    const file = new File(["invalid"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });

    const originalImage = global.Image;
    const originalFileReader = global.FileReader;

    // Mock Image
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onerror());
      }
    } as unknown as typeof Image;

    // Mock FileReader
    global.FileReader = class {
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onerror: (() => void) | null = null;
      result: string | ArrayBuffer | null = "data:image/jpeg;base64,invalid";

      readAsDataURL() {
        setTimeout(() => {
          this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
        });
      }
    } as unknown as typeof FileReader;

    const result = await validateFiles([file], ImageType.Photo);
    expect(result).toContain("The selected file is an invalid JPG, JPEG or PNG file");

    global.Image = originalImage;
    global.FileReader = originalFileReader;
  });

  it("returns true for valid photo file", async () => {
    const file = new File(["valid"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });

    const originalImage = global.Image;
    const originalFileReader = global.FileReader;

    // Mock Image
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onload());
      }
    } as unknown as typeof Image;

    // Mock FileReader
    global.FileReader = class {
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
      onerror: (() => void) | null = null;
      result: string | ArrayBuffer | null = "data:image/jpeg;base64,valid";

      readAsDataURL() {
        setTimeout(() => {
          this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
        });
      }
    } as unknown as typeof FileReader;

    const result = await validateFiles([file], ImageType.Photo);
    expect(result).toBe(true);

    global.Image = originalImage;
    global.FileReader = originalFileReader;
  });

  it("returns true for valid dicom file", async () => {
    const file = new File(["valid"], "test.dcm", { type: "application/dicom" });
    Object.defineProperty(file, "size", { value: 1024 });

    const mockDataSet: Partial<DataSet> = {};
    vi.mocked(dicomParser.parseDicom).mockImplementation(() => mockDataSet as DataSet);
    const result = await validateFiles([file], ImageType.Dicom);

    expect(result).toBe(true);
  });
});
