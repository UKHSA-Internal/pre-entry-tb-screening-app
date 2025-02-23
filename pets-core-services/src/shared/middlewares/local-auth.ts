import { InvokeCommand } from "@aws-sdk/client-lambda";
import { APIGatewayAuthorizerResult, APIGatewayProxyEvent } from "aws-lambda";

import awsClients from "../clients/aws";
import { assertEnvExists, isLocal } from "../config";
import { createHttpResponse } from "../http";
import { logger } from "../logger";

/**
 * This is strictly for local environment due to lack of support from localstack
 * Any changes to auth should absolutely be verified on AWS
 */
export const simulateLambdaAuthorizer = async (request: { event: APIGatewayProxyEvent }) => {
  if (isLocal()) {
    const { event } = request;

    try {
      const command = new InvokeCommand({
        FunctionName: assertEnvExists(process.env.AUTHORISER_LAMBDA_NAME),
        Payload: JSON.stringify(event),
      });

      const { lambdaClient } = awsClients;
      const { Payload } = await lambdaClient.send(command);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: APIGatewayAuthorizerResult = JSON.parse(
        new TextDecoder("utf-8").decode(Payload),
      );

      if (payload.policyDocument?.Statement[0]?.Effect !== "Allow") {
        return createHttpResponse(401, { message: "Unauthorized" });
      }

      Object.assign(request.event, { requestContext: { authorizer: { ...payload.context } } });
    } catch (err) {
      logger.error("Authorization failed:", err);
      return createHttpResponse(500, "Invalid token");
    }
  }
};
