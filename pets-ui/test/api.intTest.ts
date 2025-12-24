import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("petsApi response interceptor", () => {
  let mockAxios: MockAdapter;
  let originalLocation: Location;

  beforeEach(() => {
    vi.resetModules();
    originalLocation = window.location;

    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    if (mockAxios) {
      mockAxios.restore();
    }
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    vi.unstubAllEnvs();
  });

  test("redirects to /page-not-found on 404 error", async () => {
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");

    const { petsApi } = await import("@/api/api");
    mockAxios = new MockAdapter(petsApi);
    mockAxios.onGet("/test-endpoint").reply(404);

    await expect(petsApi.get("/test-endpoint")).rejects.toThrow();
    expect(window.location.href).toBe("/page-not-found");
  });

  test("redirects to /sorry-there-is-problem-with-service on 500 error", async () => {
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");

    const { petsApi } = await import("@/api/api");
    mockAxios = new MockAdapter(petsApi);
    mockAxios.onGet("/test-endpoint").reply(500);

    await expect(petsApi.get("/test-endpoint")).rejects.toThrow();
    expect(window.location.href).toBe("/sorry-there-is-problem-with-service");
  });

  test("redirects to /sorry-there-is-problem-with-service on 400 error", async () => {
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");

    const { petsApi } = await import("@/api/api");
    mockAxios = new MockAdapter(petsApi);
    mockAxios.onGet("/test-endpoint").reply(400);

    await expect(petsApi.get("/test-endpoint")).rejects.toThrow();
    expect(window.location.href).toBe("/sorry-there-is-problem-with-service");
  });

  test("redirects to /sorry-there-is-problem-with-service on 403 error", async () => {
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");

    const { petsApi } = await import("@/api/api");
    mockAxios = new MockAdapter(petsApi);
    mockAxios.onGet("/test-endpoint").reply(403);

    await expect(petsApi.get("/test-endpoint")).rejects.toThrow();
    expect(window.location.href).toBe("/sorry-there-is-problem-with-service");
  });

  test("does not redirect on successful response", async () => {
    vi.stubEnv("VITE_AZURE_SKIP_TOKEN_ACQUISITION", "false");

    const { petsApi } = await import("@/api/api");
    mockAxios = new MockAdapter(petsApi);
    mockAxios.onGet("/test-endpoint").reply(200, { data: "success" });

    const response = await petsApi.get("/test-endpoint");

    expect(response.status).toBe(200);
    expect(window.location.href).toBe("");
  });
});
