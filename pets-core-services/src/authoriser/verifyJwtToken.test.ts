import { beforeEach, describe, expect, test, vi } from "vitest";

import { logger } from "../shared/logger";
import * as verifyJwtModule from "./verifyJwtToken";

// Manual mocks
const verifyMock = vi.fn();
const fetchJwksMock = vi.fn();

vi.mock("../shared/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Inject mocks directly into the module's `verifier`
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (verifyJwtModule as any).verifier.verify = verifyMock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (verifyJwtModule as any).verifier._fetchJwks = fetchJwksMock;
});

const mockPayload = {
  sub: "abc",
  iss: "issuer",
  aud: "audience",
} as any;

describe("verifyJwtToken", () => {
  test("returns payload on success", async () => {
    verifyMock.mockResolvedValue(mockPayload);

    const result = await verifyJwtModule.verifyJwtToken("abc.token");

    expect(result).toEqual(mockPayload);
    expect(verifyMock).toHaveBeenCalledTimes(1);
  });

  test("retries on KidNotFoundInJwksError and succeeds", async () => {
    const err = new Error("Missing kid");
    err.name = "KidNotFoundInJwksError";

    verifyMock.mockRejectedValueOnce(err).mockResolvedValueOnce(mockPayload);

    fetchJwksMock.mockResolvedValue(undefined);

    const result = await verifyJwtModule.verifyJwtToken("retry.token");

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("JWKS miss"));
    expect(fetchJwksMock).toHaveBeenCalledWith(true);
    expect(result).toEqual(mockPayload);
  });

  test("throws if retry fails", async () => {
    const err = new Error("Missing kid");
    err.name = "KidNotFoundInJwksError";

    verifyMock.mockRejectedValue(err);
    fetchJwksMock.mockRejectedValue(new Error("fetch failed"));

    await expect(() => verifyJwtModule.verifyJwtToken("fail.token")).rejects.toThrow(
      "fetch failed",
    );

    expect(fetchJwksMock).toHaveBeenCalledWith(true);
    expect(logger.error).toHaveBeenCalledWith(
      "Retry failed: still can't verify token",
      expect.any(Error),
    );
  });

  test("throws on unknown error", async () => {
    const err = new Error("Some other failure");
    err.name = "UnknownError";

    verifyMock.mockRejectedValue(err);

    await expect(() => verifyJwtModule.verifyJwtToken("bad.token")).rejects.toThrow(
      "Some other failure",
    );

    expect(fetchJwksMock).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(" Token verification failed:", err);
  });
});
