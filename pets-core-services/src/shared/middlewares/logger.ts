import { APIGatewayProxyEvent, Context } from "aws-lambda";

import { withRequest } from "../logger";

export const setRequestLoggingContext = (request: {
  event: APIGatewayProxyEvent;
  context: Context;
}) => {
  const { event, context } = request;
  withRequest(event, context);
};
