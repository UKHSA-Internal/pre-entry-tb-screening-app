import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Spinner from "./spinner";

describe("Spinner component", () => {
  it("renders correctly", () => {
    renderWithProviders(<Spinner />);

    const spinnerElement = screen.getByTestId("spinner");
    const boxElement = screen.getByTestId("spinner-box");
    const overlayElement = screen.getByTestId("spinner-overlay");
    const containerElement = screen.getByTestId("spinner-container");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(spinnerElement).toBeInTheDocument();
    expect(boxElement).toBeInTheDocument();
    expect(overlayElement).toBeInTheDocument();
    expect(containerElement).toBeInTheDocument();
  });
});
