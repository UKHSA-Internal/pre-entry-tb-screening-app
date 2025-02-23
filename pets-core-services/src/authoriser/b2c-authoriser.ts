import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  Callback,
  Context,
  PolicyDocument,
  Statement,
  StatementEffect,
} from "aws-lambda";

import { logger, withRequest } from "../shared/logger";
import { policyMapping, Roles } from "./enum";

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

    // TODO: Replace the array with valid role from token
    const roles = [
      Roles.ApplicantsRead,
      Roles.ApplicantsWrite,
      Roles.ApplicationRead,
      Roles.ApplicantsWrite,
      Roles.ClinicsRead,
    ];

    // TODO: Replace the code below with correct check
    switch (token) {
      case "allow":
        callback(null, generatePolicy("user", "Allow", roles));
        break;
      case "deny":
        callback(null, generatePolicy("user", "Deny", roles));
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
  b2cRoles: string[],
): APIGatewayAuthorizerResult => {
  logger.info({ effect, principalId, b2cRoles }, "Generating Policy");

  const filterPredicate = (role: string): role is Roles => {
    const validRole = role in policyMapping;
    if (!validRole) logger.error({ role }, "Invalid role found");
    return validRole;
  };

  const statements: Statement[] = b2cRoles.filter(filterPredicate).map((role) => ({
    Action: "execute-api:Invoke",
    Effect: effect,
    Resource: policyMapping[role],
  }));

  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: statements,
  };

  const clinicId = "Apollo Clinic"; // TODO: Add middleware to validate this
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

  logger.info({ authResponse }, "Generated authRespose");

  return authResponse;
};
