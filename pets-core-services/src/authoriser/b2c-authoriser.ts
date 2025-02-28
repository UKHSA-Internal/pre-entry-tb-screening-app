import assert from "assert";
import { JwtVerifier } from "aws-jwt-verify";
import { JwtPayload } from "aws-jwt-verify/jwt-model";
import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  Callback,
  Context,
  PolicyDocument,
  Statement,
  StatementEffect,
} from "aws-lambda";

import { assertEnvExists } from "../shared/config";
import { logger, withRequest } from "../shared/logger";
import { policyMapping, Roles } from "./constants";

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
  context: Context,
  callback: Callback,
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

    const TENANT_ID = assertEnvExists(process.env.VITE_MSAL_TENANT_ID);
    const CLIENT_ID = assertEnvExists(process.env.VITE_MSAL_CLIENT_ID);

    const verifier = JwtVerifier.create({
      issuer: `https://${TENANT_ID}.ciamlogin.com/${TENANT_ID}/v2.0`,
      audience: CLIENT_ID,
      jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/keys`,
    });

    const payload = await verifier.verify(token);
    logger.info("token verified successfully");
    callback(null, generatePolicy("user", "Allow", payload));
  } catch (error) {
    logger.error(error, "Authorization failed");
    callback("Unauthorized");
  }
};

const generatePolicy = (
  principalId: string,
  effect: StatementEffect,
  payload: JwtPayload,
): APIGatewayAuthorizerResult => {
  logger.info({ effect, principalId }, "Generating Policy");

  assert(payload.roles);
  const b2cRoles = payload.roles as string[];

  const b2cRolesLowerCase = b2cRoles.map((role) => role.toLowerCase());

  logger.info("Filtering invalid roles");
  const filterPredicate = (role: string): role is Roles => {
    const validRole = role in policyMapping;
    if (!validRole) logger.error({ role }, "Invalid role found");
    return validRole;
  };

  const statements: Statement[] = b2cRolesLowerCase.filter(filterPredicate).map((role) => ({
    Action: "execute-api:Invoke",
    Effect: effect,
    Resource: policyMapping[role],
  }));

  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: statements,
  };

  const clinicId = "Apollo Clinic"; // TODO: Replace with payload.ClinicID
  assert(payload.email);
  const createdBy = payload.email as string;
  const context = {
    clinicId,
    createdBy,
  };

  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument,
    context,
  };

  logger.info("Generated policy successfully");

  return authResponse;
};
