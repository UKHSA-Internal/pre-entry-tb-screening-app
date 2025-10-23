import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";

import NotificationBanner from "./notificationBanner";

describe("NotificationBanner", () => {
  test("renders the banner title correctly", () => {
    render(<NotificationBanner bannerTitle="Important Notice" />);
    expect(screen.getByRole("heading", { name: "Important Notice" })).toBeInTheDocument();
  });

  test("renders the banner heading and text when provided", () => {
    render(
      <NotificationBanner
        bannerTitle="Important"
        bannerHeading="This is a critical update."
        bannerText="Do not turn off your device."
      />,
    );
    expect(screen.getByText("This is a critical update.")).toBeInTheDocument();
    expect(screen.getByText("This is a critical update.")).toHaveClass(
      "govuk-notification-banner__heading",
    );
    expect(screen.getByText("Do not turn off your device.")).toBeInTheDocument();
    expect(screen.getByText("Do not turn off your device.")).toHaveClass("govuk-body");
  });

  test("renders a list of items when provided", () => {
    const items = ["Item 1", "Item 2", "Item 3"];
    render(<NotificationBanner bannerTitle="Notice" list={items} />);
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("renders both text and list when provided", () => {
    const items = ["Item 1", "Item 2"];
    render(
      <NotificationBanner
        bannerTitle="Items"
        bannerText="Please fulfill the following:"
        list={items}
      />,
    );
    expect(screen.getByText("Please fulfill the following:")).toBeInTheDocument();
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("does not render banner text or list when neither is provided", () => {
    render(<NotificationBanner bannerTitle="Alert" />);
    const content = screen.getByRole("region");
    expect(content).toBeInTheDocument();
    expect(content).not.toHaveTextContent("govuk-body");
  });
});
