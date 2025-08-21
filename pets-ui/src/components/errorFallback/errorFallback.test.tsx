import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import { ErrorFallback } from "./errorFallback";

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

describe("Error Summary Component", () => {
  it("renders correctly when props are specified", () => {
    renderWithProviders(<ErrorFallback />);

    expect(
      screen.getByText(
        "Sorry, there is a problem with the Complete UK pre-entry health screening service",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Try again now or later.")).toBeInTheDocument();

    const contactParagraph = screen.getAllByRole("paragraph")[2];
    expect(contactParagraph).toHaveTextContent(
      "Contact uktbscreeningsupport@ukhsa.gov.uk if the problem continues.",
    );
    expect(screen.getAllByRole("link")[4]).toHaveTextContent("uktbscreeningsupport@ukhsa.gov.uk");
  });
});
