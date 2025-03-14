import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect } from "vitest";

import Container from "../container/container";

const mockBreadcrumb = [
  { text: "Home", href: "/" },
  { text: "Applicants", href: "/applicants" },
];

describe("Container Component", () => {
  test("renders title inside Helmet", async () => {
    render(
      <Router>
        <HelmetProvider>
          <Container title="Test Page">Test Content</Container>
        </HelmetProvider>
      </Router>,
    );

    await waitFor(() => {
      expect(document.title).toBe("Test Page");
    });
  });

  test("renders header, footer, and main content", () => {
    render(
      <Router>
        <HelmetProvider>
          <Container title="Page Title">Test Content</Container>
        </HelmetProvider>
      </Router>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // Footer
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("renders breadcrumbs when provided", () => {
    render(
      <Router>
        <HelmetProvider>
          <Container title="With Breadcrumbs" breadcrumbItems={mockBreadcrumb}>
            Test Content
          </Container>
        </HelmetProvider>
      </Router>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Applicants")).toBeInTheDocument();
  });

  test("renders without breadcrumbs if none are provided", () => {
    render(
      <Router>
        <HelmetProvider>
          <Container title="No Breadcrumbs">Test Content</Container>
        </HelmetProvider>
      </Router>,
    );
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});
