import { screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Mock } from "vitest";

import CancellationConfirmationPage from "@/pages/cancellation-confirmation";
import { ApplicationStatus } from "@/utils/enums";
import { renderWithProviders } from "@/utils/test-utils";

const useNavigateMock: Mock = vi.fn();
vi.mock(`react-router`, async (): Promise<unknown> => {
  const actual: Record<string, unknown> = await vi.importActual(`react-router`);
  return {
    ...actual,
    useNavigate: (): Mock => useNavigateMock,
  };
});

describe("Cancellation confirmation page", () => {
  it("Page renders with correct text", () => {
    const preloadedState = {
      application: {
        applicationId: "abc-123",
        dateCreated: { year: "2010", month: "1", day: "1" },
        applicationStatus: ApplicationStatus.IN_PROGRESS,
        cancellationReason: "The clinic uploaded the wrong data",
        cancellationFurtherInfo: "They messed it up big time",
      },
    };
    renderWithProviders(
      <HelmetProvider>
        <CancellationConfirmationPage />
      </HelmetProvider>,
      { preloadedState },
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("TB screening cancelled");
    expect(
      screen.getByText(
        "The visa applicant TB screening has been cancelled because the clinic uploaded the wrong data.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("What happens next")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If the visa applicant returns for a new screening, you will need to start again.",
      ),
    ).toBeInTheDocument();
  });

  it("Page renders with correct links", () => {
    renderWithProviders(
      <HelmetProvider>
        <CancellationConfirmationPage />
      </HelmetProvider>,
    );
    expect(
      screen.getByRole("link", { name: "visa applicant's screening history" }).getAttribute("href"),
    ).toEqual("/screening-history");
    expect(
      screen.getByRole("link", { name: "Search for another visa applicant" }).getAttribute("href"),
    ).toEqual("/search-for-visa-applicant");
    expect(
      screen
        .getByRole("link", { name: "What did you think of this service? (opens in new tab)" })
        .getAttribute("href"),
    ).toEqual(
      "https://forms.office.com/pages/responsepage.aspx?id=mRRO7jVKLkutR188-d6GZtaAaJfrhApCue13O2-oStFUNlIyRkRMWVBNQkszSTJISDJGU1pJTTkxNy4u&route=shorturl",
    );
  });
});
