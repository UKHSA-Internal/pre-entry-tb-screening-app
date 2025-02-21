import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  Callback,
  Context,
  PolicyDocument,
  StatementEffect,
} from "aws-lambda";

import { logger, withRequest } from "../shared/logger";

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
  context: Context,
  callback: Callback,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  try {
    logger.info("Authorizer lambda triggered");

    if (!event.headers) {
      logger.error("Headers are missing");
      throw new Error("Headers are required");
    }

    const headers = event.headers;
    withRequest({ ...event, headers }, context);

    const token = event.headers?.["Authorization"]?.split(" ")[1];
    if (!token) {
      logger.error("Authorization Headers missing");
      throw new Error("Authorization Headers missing");
    }

    // TODO: Replace the code below with correct check
    switch (token) {
      case "allow":
        callback(null, generatePolicy("user", "Allow", event.methodArn));
        break;
      case "deny":
        callback(null, generatePolicy("user", "Deny", event.methodArn));
        break;
      case "unauthorized":
        callback("Unauthorized"); // Return a 401 Unauthorized response
        break;
      default:
        callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
  } catch (error) {
    logger.error(error, "Authorizer lambda failed");
    callback("Error: Invalid token");
  }
};

const generatePolicy = (
  principalId: string,
  effect: StatementEffect,
  resource: string,
): APIGatewayAuthorizerResult => {
  logger.info({ effect, resource, principalId }, "Generating Policy");

  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  const clinicId = "Apollo Clinic";
  const createdBy = "hardcoded@user.com";
  const context = {
    clinicId,
    createdBy,
  };

  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument,
    context,
  };

  return authResponse;
};
