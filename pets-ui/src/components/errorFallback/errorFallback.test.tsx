import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ErrorFallback } from "./errorFallback";

vi.mock("react-helmet-async", () => ({
  Helmet: () => <>{}</>,
  HelmetProvider: () => <>{}</>,
}));

describe("Error Summary Component", () => {
  it("renders correctly when props are specified", () => {
    render(
      <Router>
        <ErrorFallback />
      </Router>,
    );

    expect(
      screen.getByText(
        "Sorry, there is a problem with the Complete UK pre-entry health screening service",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Try again now or later.")).toBeInTheDocument();
    expect(
      screen.getByText("Contact uktbscreeningsupport@ukhsa.gov.uk if the problem continues."),
    ).toBeInTheDocument();
  });
});
