import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ApplicantPhotoProvider, useApplicantPhoto } from "@/context/applicantPhotoContext";

interface ApplicantPhotoContextType {
  applicantPhotoFile: File | null;
  applicantPhotoDataUrl: string | null;
  setApplicantPhotoFile: (file: File | null) => void;
  setApplicantPhotoUrl: (url: string | null) => void;
}

const setup = () => {
  let latestCtx: ApplicantPhotoContextType | undefined;

  const Consumer = () => {
    latestCtx = useApplicantPhoto();
    return null;
  };

  render(
    <ApplicantPhotoProvider>
      <Consumer />
    </ApplicantPhotoProvider>,
  );

  const getCtx = (): ApplicantPhotoContextType => {
    if (!latestCtx) throw new Error("Context has not been initialised");
    return latestCtx;
  };

  return {
    getCtx,
  };
};

describe("ApplicantPhotoContext", () => {
  const ORIGINAL_FILE_READER = global.FileReader;
  const MOCK_DATA_URL = "data:image/jpeg;base64,ZmFrZS1pbWFnZS1jb250ZW50";

  const mockFileReaderSuccess = () => {
    class MockFileReader {
      public static readonly EMPTY = 0;
      public static readonly LOADING = 1;
      public static readonly DONE = 2;

      public result: string | null = MOCK_DATA_URL;
      public onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;
      public onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL() {
        setTimeout(() => {
          if (this.onload) {
            const onloadFn = this.onload as (
              this: FileReader,
              ev: ProgressEvent<FileReader>,
            ) => unknown;
            onloadFn.call(
              this as unknown as FileReader,
              new ProgressEvent("load") as ProgressEvent<FileReader>,
            );
          }
        }, 0);
      }
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;
  };

  const restoreFileReader = () => {
    global.FileReader = ORIGINAL_FILE_READER;
  };

  test("sets applicantPhotoFile & applicantPhotoDataUrl when a valid file is provided", async () => {
    mockFileReaderSuccess();

    const { getCtx } = setup();
    const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });

    act(() => {
      getCtx().setApplicantPhotoFile(file);
    });

    await (waitFor(() => {
      expect(getCtx().applicantPhotoFile).toBe(file);
      expect(getCtx().applicantPhotoDataUrl).toBe(MOCK_DATA_URL);
    }) as Promise<unknown>);

    restoreFileReader();
  });

  test("resets applicantPhotoFile & applicantPhotoDataUrl when null is provided", async () => {
    mockFileReaderSuccess();

    const { getCtx } = setup();
    const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });

    act(() => {
      getCtx().setApplicantPhotoFile(file);
    });

    await (waitFor(() => {
      expect(getCtx().applicantPhotoFile).toBe(file);
    }) as Promise<unknown>);

    act(() => {
      getCtx().setApplicantPhotoFile(null);
    });

    await (waitFor(() => {
      expect(getCtx().applicantPhotoFile).toBeNull();
      expect(getCtx().applicantPhotoDataUrl).toBeNull();
    }) as Promise<unknown>);

    restoreFileReader();
  });

  test("sets applicantPhotoDataUrl and clears file when setApplicantPhotoUrl is called", async () => {
    const { getCtx } = setup();
    const ctx: ApplicantPhotoContextType = getCtx();
    const url = "http://localhost/test-photo.jpg";

    const setUrl: (url: string | null) => void = (u) => ctx.setApplicantPhotoUrl(u);

    act(() => {
      setUrl(url);
    });

    await (waitFor(() => {
      const latest = getCtx();
      expect(latest.applicantPhotoFile).toBeNull();
      expect(latest.applicantPhotoDataUrl).toBe(url);
    }) as Promise<unknown>);
  });
});
