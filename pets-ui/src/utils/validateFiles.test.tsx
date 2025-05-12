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
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onerror());
      }
    } as unknown as typeof Image;

    const result = await validateFiles([file], ImageType.Photo);
    expect(result).toContain("The selected file is an invalid JPG, JPEG or PNG file");

    global.Image = originalImage;
  });

  it("returns true for valid photo file", async () => {
    const file = new File(["valid"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });

    const originalImage = global.Image;
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_: string) {
        setTimeout(() => this.onload());
      }
    } as unknown as typeof Image;

    const result = await validateFiles([file], ImageType.Photo);
    expect(result).toBe(true);

    global.Image = originalImage;
  });

  it("returns true for valid dicom file", async () => {
    const file = new File(["valid"], "test.dcm", { type: "application/dicom" });
    Object.defineProperty(file, "size", { value: 1024 });

    const mockDataSet: Partial<DataSet> = {};
    vi.mocked(dicomParser.parseDicom).mockImplementation(() => mockDataSet as DataSet);
    const result = await validateFiles([file], ImageType.Dicom);

    expect(result).toBe(true);
  });

  //   it("rejects unsupported file type for dicom", async () => {
  //     const file = new File(["a"], "test.jpg", { type: "image/jpeg" });
  //     const result = await validateFiles([file], ImageType.Dicom);
  //     expect(result).toContain("The selected file must be a DICOM file");
  //   });

  //   it("rejects files that are too large", async () => {
  //     const photo = new File(["a".repeat(11 * 1024 * 1024)], "photo.jpg", { type: "image/jpeg" });
  //     Object.defineProperty(photo, "size", { value: 11 * 1024 * 1024 });
  //     const result = await validateFiles([photo], ImageType.Photo);
  //     expect(result).toContain("The selected file must be smaller than 10MB");

  //     const dicom = new File(["a".repeat(51 * 1024 * 1024)], "scan.dcm", {
  //       type: "application/dicom",
  //     });
  //     Object.defineProperty(dicom, "size", { value: 51 * 1024 * 1024 });
  //     const result2 = await validateFiles([dicom], ImageType.Dicom);
  //     expect(result2).toContain("The selected file must be smaller than 50MB");
  //   });

  //   it("rejects empty files", async () => {
  //     const file = new File([""], "empty.jpg", { type: "image/jpeg" });
  //     Object.defineProperty(file, "size", { value: 0 });
  //     const result = await validateFiles([file], ImageType.Photo);
  //     expect(result).toContain("The selected file is empty");
  //   });
});
