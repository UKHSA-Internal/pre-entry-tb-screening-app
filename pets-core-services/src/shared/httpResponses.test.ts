import { beforeEach, describe, expect, it, vi } from "vitest";

import * as httpModule from "./http";
import { HttpErrors, HttpResponses } from "./httpResponses";

vi.mock("./http", () => ({
  createHttpResponse: vi.fn(),
}));

const createHttpResponse = httpModule.createHttpResponse as unknown as ReturnType<typeof vi.fn>;

describe("HttpResponses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 for ok()", () => {
    const body = { message: "success" };

    HttpResponses.ok(body);

    expect(createHttpResponse).toHaveBeenCalledWith(200, body);
  });

  it("should return 201 for created()", () => {
    const body = { id: "123" };

    HttpResponses.created(body);

    expect(createHttpResponse).toHaveBeenCalledWith(201, body);
  });

  it("should return 204 for noContent()", () => {
    HttpResponses.noContent();

    expect(createHttpResponse).toHaveBeenCalledWith(204, null);
  });
});

describe("HttpErrors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 with default message", () => {
    HttpErrors.badRequest();

    expect(createHttpResponse).toHaveBeenCalledWith(400, {
      message: "Bad request",
    });
  });

  it("should wrap string payload in message for badRequest()", () => {
    HttpErrors.badRequest("Invalid input");

    expect(createHttpResponse).toHaveBeenCalledWith(400, {
      message: "Invalid input",
    });
  });

  it("should pass object payload directly for badRequest()", () => {
    const payload = { message: "Validation failed", field: "email" };

    HttpErrors.badRequest(payload);

    expect(createHttpResponse).toHaveBeenCalledWith(400, payload);
  });

  it("should return 401 for unauthorized()", () => {
    HttpErrors.unauthorized();

    expect(createHttpResponse).toHaveBeenCalledWith(401, {
      message: "Unauthorized",
    });
  });

  it("should return 403 for forbidden()", () => {
    HttpErrors.forbidden();

    expect(createHttpResponse).toHaveBeenCalledWith(403, {
      message: "Forbidden",
    });
  });

  it("should return 404 for notFound()", () => {
    HttpErrors.notFound();

    expect(createHttpResponse).toHaveBeenCalledWith(404, {
      message: "Resource not found",
    });
  });

  it("should return 500 for serverError()", () => {
    HttpErrors.serverError();

    expect(createHttpResponse).toHaveBeenCalledWith(500, {
      message: "Something went wrong",
    });
  });

  it("should return 422 for validationError()", () => {
    HttpErrors.validationError();

    expect(createHttpResponse).toHaveBeenCalledWith(422, {
      message: "Validation failed",
    });
  });

  it("should return 403 for authorizationError()", () => {
    HttpErrors.authorizationError();

    expect(createHttpResponse).toHaveBeenCalledWith(403, {
      message: "Not allowed to perform this action",
    });
  });

  it("should return 409 for conflictError()", () => {
    HttpErrors.conflictError();

    expect(createHttpResponse).toHaveBeenCalledWith(409, {
      message: "Resource conflict",
    });
  });

  it("should return 410 for gone()", () => {
    HttpErrors.gone();

    expect(createHttpResponse).toHaveBeenCalledWith(410, {
      message: "Resource no longer available",
    });
  });
});
