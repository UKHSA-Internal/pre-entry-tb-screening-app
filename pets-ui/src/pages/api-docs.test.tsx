import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
