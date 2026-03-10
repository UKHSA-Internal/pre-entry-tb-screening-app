import { createHttpResponse } from "./http";

export const HttpResponses = {
  ok: <T extends object | string>(body: T) => createHttpResponse(200, body),

  created: <T extends object | string>(body: T) => createHttpResponse(201, body),

  noContent: () => createHttpResponse(204, null),
};
export const HttpErrors = {
  badRequest: (payload: string | Record<string, unknown> = "Bad request") =>
    typeof payload === "string"
      ? createHttpResponse(400, { message: payload }) // wrap strings
      : createHttpResponse(400, payload), // pass objects directly
  unauthorized: (message = "Unauthorized") => createHttpResponse(401, { message }),

  forbidden: (message = "Forbidden") => createHttpResponse(403, { message }),

  notFound: (message = "Resource not found") => createHttpResponse(404, { message }),

  serverError: (message = "Something went wrong") => createHttpResponse(500, { message }),

  // ----- Domain-specific -----

  validationError: (message = "Validation failed") => createHttpResponse(422, { message }),

  authorizationError: (message = "Not allowed to perform this action") =>
    createHttpResponse(403, { message }),

  conflictError: (message = "Resource conflict") => createHttpResponse(409, { message }),

  gone: (message = "Resource no longer available") => createHttpResponse(410, { message }),
};
