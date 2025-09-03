import { APIGatewayProxyResult } from "aws-lambda";

import { logger } from "./logger";

export const createHttpResponse = (
  statusCode: number,
  body: string | object,
  contentType = "application/json",
  headers = {},
): APIGatewayProxyResult => {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);

  return {
    statusCode,
    body: bodyStr,
    headers: {
      "Content-Type": contentType,
      ...headers,
    },
  };
};

export const notFoundResponse = ({ method, path }: { method: string; path: string }) => {
  logger.error({ method, path }, "Missing Handler");
  return createHttpResponse(404, "Not Found");
};
