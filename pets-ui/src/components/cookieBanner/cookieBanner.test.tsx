import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import CookieBanner from "./cookieBanner";

afterEach(() => {
  localStorage.clear();
});

const user = userEvent.setup();

describe("CookieBanner component", () => {
  it("renders correctly when consent is not present", () => {
    renderWithProviders(<CookieBanner />);
    expect(
      screen.getByText("Cookies on Complete UK pre-entry health screening"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("We use some essential cookies to make this service work."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We would also like to use analytics cookies so we can understand how you use the service and make improvements.",
      ),
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Accept analytics cookies");
    expect(buttons[1]).toHaveTextContent("Reject analytics cookies");

    expect(screen.getByRole("link")).toHaveTextContent("View cookies");
    expect(screen.getByRole("link").getAttribute("href")).toEqual("/cookies");

    expect(localStorage.getItem("cookie-consent")).toEqual(null);
  });

  it("renders correct message when user accepts cookies, then hides message when user clicks button", async () => {
    renderWithProviders(<CookieBanner />);
    const acceptButton = screen.getAllByRole("button")[0];
    await user.click(acceptButton);

    expect(screen.getByText(/You have accepted analytics cookies. You can/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveTextContent("change your cookie settings");
    expect(screen.getByRole("link").getAttribute("href")).toEqual("/cookies");
    expect(screen.getByText(/at any time/)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Hide cookie message");

    expect(localStorage.getItem("cookie-consent")).toEqual("accepted");

    const hideButton = screen.getByRole("button");
    await user.click(hideButton);

    expect(
      screen.queryByText("Cookies on Complete UK pre-entry health screening"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/You have accepted analytics cookies. You can/),
    ).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders correct message when user rejects cookies, then hides message when user clicks button", async () => {
    renderWithProviders(<CookieBanner />);
    const rejectButton = screen.getAllByRole("button")[1];
    await user.click(rejectButton);

    expect(screen.getByText(/You have rejected analytics cookies. You can/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveTextContent("change your cookie settings");
    expect(screen.getByRole("link").getAttribute("href")).toEqual("/cookies");
    expect(screen.getByText(/at any time/)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Hide cookie message");

    expect(localStorage.getItem("cookie-consent")).toEqual("rejected");

    const hideButton = screen.getByRole("button");
    await user.click(hideButton);

    expect(
      screen.queryByText("Cookies on Complete UK pre-entry health screening"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/You have accepted analytics cookies. You can/),
    ).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
