import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect } from "vitest";

import { renderWithProviders } from "@/utils/test-utils";

import Container from "../container/container";

const user = userEvent.setup();

describe("Container Component", () => {
  test("renders title inside Helmet", async () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="Test Page">Test Content</Container>
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe("Test Page");
    });
  });

  test("renders header, footer, and main content", () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="Page Title">Test Content</Container>
      </HelmetProvider>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // Footer
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("renders back link when provided", () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="With Back Link" backLinkTo="/test">
          Test Content
        </Container>
      </HelmetProvider>,
    );
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  test("renders without back link if none are provided", () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="No Back Link">Test Content</Container>
      </HelmetProvider>,
    );
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  test("main element has tabIndex of -1", () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="No Breadcrumbs">Test Content</Container>
      </HelmetProvider>,
    );
    const mainElement = screen.getByRole("main");
    expect(mainElement).toHaveAttribute("tabIndex", "-1");
  });

  test("main element is in focus when skipLink is clicked", async () => {
    renderWithProviders(
      <HelmetProvider>
        <Container title="No Breadcrumbs">Test Content</Container>
      </HelmetProvider>,
    );
    const skipLink = screen.getByText("Skip to main content");
    await user.click(skipLink);
    const mainElement = screen.getByRole("main");
    await waitFor(() => {
      expect(mainElement).toHaveFocus();
    });
  });
});
