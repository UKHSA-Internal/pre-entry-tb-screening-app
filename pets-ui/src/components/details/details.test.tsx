import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Details from "./details";

describe("Details Component", () => {
  test("always shows summary text, and shows/hides details text on click", async () => {
    const user = userEvent.setup();

    render(<Details summary="summary text" details="details text" />);

    const summary = screen.getByText("summary text");
    const details = screen.getByText("details text");

    expect(summary).toBeVisible();
    expect(details).not.toBeVisible();

    await user.click(summary);
    expect(summary).toBeVisible();
    expect(details).toBeVisible();

    await user.click(summary);
    expect(summary).toBeVisible();
    expect(details).not.toBeVisible();
  });
});
