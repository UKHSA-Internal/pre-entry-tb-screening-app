import { screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import TbConfirmationPage from "@/pages/tb-confirmation";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router-dom`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router-dom`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Tb Confirmation page", () => {
  test("Page renders with correct text", () => {
    renderWithProviders(
      <HelmetProvider>
        <TbConfirmationPage />
      </HelmetProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("TB screening complete");
    expect(screen.getByText("The visa applicant TB screening is complete.")).toBeInTheDocument();
  });

  test("does not show 'Check or change certificate information' button when certificate is not issued", () => {
    renderWithProviders(
      <HelmetProvider>
        <TbConfirmationPage />
      </HelmetProvider>,
      {
        preloadedState: {
          tbCertificate: {
            isIssued: YesOrNo.NO,
            status: ApplicationStatus.NOT_YET_STARTED,
            comments: "",
            certificateDate: {
              year: "",
              month: "",
              day: "",
            },
            certificateNumber: "",
            declaringPhysicianName: "",
            clinic: {
              clinicId: "",
              name: "",
              country: "",
              city: "",
              startDate: "",
              endDate: undefined,
              createdBy: "",
            },
          },
        },
      },
    );
    expect(
      screen.queryByRole("button", { name: "Check or change certificate information" }),
    ).not.toBeInTheDocument();
  });

  test("shows 'Check or change certificate information' button when certificate is issued", () => {
    renderWithProviders(
      <HelmetProvider>
        <TbConfirmationPage />
      </HelmetProvider>,
      {
        preloadedState: {
          tbCertificate: {
            isIssued: YesOrNo.YES,
            status: ApplicationStatus.NOT_YET_STARTED,
            comments: "",
            certificateDate: {
              year: "",
              month: "",
              day: "",
            },
            certificateNumber: "",
            declaringPhysicianName: "",
            clinic: {
              clinicId: "",
              name: "",
              country: "",
              city: "",
              startDate: "",
              endDate: undefined,
              createdBy: "",
            },
          },
        },
      },
    );
    expect(
      screen.getByRole("button", { name: "Check or change certificate information" }),
    ).toBeInTheDocument();
  });
});
