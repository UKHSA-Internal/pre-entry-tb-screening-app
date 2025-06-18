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
import jwt from "jsonwebtoken";

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

    const allowedTenantIds =
      (assertEnvExists(process.env.VITE_ALLOWED_TENANT_IDS) &&
        process.env.VITE_ALLOWED_TENANT_IDS?.split(",")) ??
      [];
    const allowedClientIds =
      (assertEnvExists(process.env.VITE_ALLOWED_CLIENT_IDS) &&
        process.env.VITE_ALLOWED_CLIENT_IDS?.split(",")) ??
      [];

    const roleMap =
      assertEnvExists(process.env.VITE_ROLE_MAP) && JSON.parse(process.env.VITE_ROLE_MAP || "{}");

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
    // Decode without verifying to extract tenant/client

    const decodedHeader = jwt.decode(token, { complete: true });

    if (!decodedHeader || typeof decodedHeader === "string") {
      throw new Error("Invalid token");
    }

    const payload = decodedHeader.payload as JwtPayload;

    const tenantId = payload.tid as string; // Azure AD tenant ID
    const clientId = payload.aud as string; // Client ID (Application ID)

    // Validate against allowed tenant and client lists
    if (!allowedTenantIds.includes(tenantId)) {
      throw new Error(`Unauthorized tenant: ${tenantId}`);
    }

    if (!allowedClientIds.includes(clientId)) {
      throw new Error(`Unauthorized client ID: ${clientId}`);
    }

    const verifier = JwtVerifier.create({
      issuer: `https://${tenantId}.ciamlogin.com/${tenantId}/v2.0`,
      audience: clientId,
      jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/keys`,
    });

    const verifiedPayload = await verifier.verify(token);

    if (!verifiedPayload.ClinicID) {
      logger.error("Missing ClinicID");
    }

    const clientIdFromPayload = verifiedPayload.aud as string;
    const userRoles = extractRoles(payload.roles);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const allowedRoles = roleMap[clientIdFromPayload] || [];

    // Check if any user role matches allowed roles
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isAuthorized = userRoles.some((role) => allowedRoles.includes(role));

    if (!isAuthorized) {
      throw new Error(`Unauthorized role for client ${clientId}`);
    }

    logger.info("token verified successfully");
    callback(null, generatePolicy("user", "Allow", verifiedPayload));
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

  assert(payload.email);
  assert(payload.ClinicID);
  const clinicId = payload.ClinicID as string;
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

const extractRoles = (raw: unknown): string[] =>
  Array.isArray(raw)
    ? raw.filter((r): r is string => typeof r === "string")
    : typeof raw === "string"
      ? [raw]
      : [];
