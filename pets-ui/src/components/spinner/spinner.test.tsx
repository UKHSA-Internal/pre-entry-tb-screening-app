import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Spinner from "./spinner";

describe("Spinner component", () => {
  it("renders correctly when isLoading is true", () => {
    renderWithProviders(<Spinner />);

    const spinnerElement = screen.getByTestId("spinner");
    const overlayElement = screen.getByTestId("spinner-overlay");
    const containerElement = screen.getByTestId("spinner-container");

    expect(spinnerElement).toBeInTheDocument();
    expect(overlayElement).toBeInTheDocument();
    expect(containerElement).toBeInTheDocument();
  });
});
