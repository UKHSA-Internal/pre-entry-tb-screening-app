import { describe, expect, it, vi } from "vitest";

import { assertEnvExists, isLocal } from "./config";

describe("assertEnvExists", () => {
  it("should return the environment value when it exists", () => {
    expect(assertEnvExists(process.env.ENVIRONMENT)).toBe("ENVIRONMENT");
  });

  it("should throw an assertion error when the environment value is undefined", () => {
    expect(() => assertEnvExists(process.env.NON_EXISTING)).toThrow();
  });
});

describe("isLocal", () => {
  it("should return true if ENVIRONMENT is 'local'", () => {
    vi.stubEnv("ENVIRONMENT", "local");
    expect(isLocal()).toBe(true);
  });

  it("should return false if ENVIRONMENT is not 'local'", () => {
    vi.stubEnv("ENVIRONMENT", "production");
    expect(isLocal()).toBe(false);
  });

  it("should throw an assertion error if ENVIRONMENT is missing", () => {
    vi.stubEnv("ENVIRONMENT", ""); // Ensure no ENVIRONMENT is set
    expect(() => isLocal()).toThrow();
  });
});
