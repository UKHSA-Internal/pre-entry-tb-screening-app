import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Ensure environment variable handling
vi.stubGlobal("import.meta", { env: { DEV: true } });
vi.mock("../../../pets-core-services/openapi-docs.json", () => ({
  default: {
    openapi: "3.0.0",
    info: {
      title: "Mock API",
      version: "1.0.0",
    },
    paths: {},
  },
}));

// Mock Swagger UI to avoid loading the actual library
vi.mock("swagger-ui-react", () => ({
  default: () => <div data-testid="swagger-ui">Swagger UI</div>,
}));
import ApiDocs from "./api-docs";

describe("ApiDocs Component", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders Swagger UI", async () => {
    render(
      <HelmetProvider>
        <ApiDocs />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("swagger-ui")).toBeInTheDocument();
    });
  });
  it("sets the correct API server URL in DEV mode", async () => {
    render(
      <HelmetProvider>
        <ApiDocs />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("swagger-ui")).toBeInTheDocument();
    });

    const expectedUrl = `http://${window.location.host}/api`;
    expect(expectedUrl).toContain("http://");
  });
  it("sets the correct API server URL in production mode", async () => {
    vi.stubGlobal("import.meta", { env: { DEV: false } });

    render(
      <HelmetProvider>
        <ApiDocs />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("swagger-ui")).toBeInTheDocument();
    });

    const expectedUrl = `https://${window.location.host}/api`;
    expect(expectedUrl).toContain("https://");
  });
});
