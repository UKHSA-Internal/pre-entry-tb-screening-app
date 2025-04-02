import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Spinner from "./spinner";

describe("Spinner component", () => {
  it("renders correctly when isLoading is true", () => {
    renderWithProviders(
      <BrowserRouter>
        <Spinner isLoading={true} />
      </BrowserRouter>,
    );

    const spinnerElement = screen.getByTestId("spinner");
    const overlayElement = screen.getByTestId("spinner-overlay");
    const containerElement = screen.getByTestId("spinner-container");

    expect(spinnerElement).toBeInTheDocument();
    expect(overlayElement).toBeInTheDocument();
    expect(containerElement).toBeInTheDocument();
  });
  it("does not render the spinner or overlay when isLoading is false", () => {
    renderWithProviders(
      <BrowserRouter>
        <Spinner isLoading={false} />
      </BrowserRouter>,
    );

    const spinnerElement = screen.queryByTestId("spinner");
    const overlayElement = screen.queryByTestId("spinner-overlay");
    const containerElement = screen.queryByTestId("spinner-container");

    expect(spinnerElement).toBeNull();
    expect(overlayElement).toBeNull();
    expect(containerElement).toBeInTheDocument();
  });
});
