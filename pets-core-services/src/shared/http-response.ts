import { APIGatewayProxyResult } from "aws-lambda";

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
