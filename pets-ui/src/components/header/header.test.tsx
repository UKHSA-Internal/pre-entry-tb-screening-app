import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Header from "./header";

describe("Header component", () => {
  it("renders", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
    const header = screen.getByRole("banner");
    expect(header).toBeTruthy();
  });
});
