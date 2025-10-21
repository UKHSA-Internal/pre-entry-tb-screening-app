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

    expect(screen.getAllByRole("link")[4]).toHaveTextContent("Back");

    expect(screen.getByText("Sorry, there is a problem with the service")).toBeInTheDocument();
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "If you completed a section and viewed a confirmation page, we saved your answers.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "If you did not view a confirmation page, we have not saved your answers. When the service is available, you will have to start the section again.",
      ),
    ).toBeInTheDocument();

    const contactParagraph = screen.getAllByRole("paragraph")[4];
    expect(contactParagraph).toHaveTextContent(
      "Email uktbscreeningsupport@ukhsa.gov.uk if you need support.",
    );
    expect(screen.getAllByRole("link")[5]).toHaveTextContent("uktbscreeningsupport@ukhsa.gov.uk");
  });
});
