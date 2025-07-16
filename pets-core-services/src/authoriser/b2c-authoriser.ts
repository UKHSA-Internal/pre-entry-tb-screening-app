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

    let payload = await verifier.verify(token);
    console.info(JSON.stringify(payload));
    payload = {
      aud: "b8af26cb-2053-4f08-a4f1-ccb7b97f7038",
      iss: "https://f52ae62b-2ff7-4104-b90f-48cdc7454bfb.ciamlogin.com/f52ae62b-2ff7-4104-b90f-48cdc7454bfb/v2.0",
      iat: 1752591624,
      nbf: 1752591624,
      exp: 1752595524,
      aio: "AVQAq/8ZAAAAqaEoY0nFt6UaB0xCjuNu/kJJW2sNj/97tLDuj7admbPxfcCFxAqAqpp5l6bgP1Mao2XaiR0GCUq+2JQJStHUcElPxMhcpuOvVa8JXjQPC18=",
      email: "pets.tester3@hotmail.com",
      name: "unknown",
      nonce: "01980d4a-e6bb-706a-8bb4-a0bde57c01a1",
      oid: "8a36b166-3751-470b-8a72-925ecca39716",
      preferred_username: "pets.tester3@hotmail.com",
      rh: "1.AZgAK-Yq9fcvBEG5D0jNx0VL-8smr7hTIAhPpPHMt7l_cDiYAK6YAA.",
      roles: [
        "Application.Read",
        "Application.Write",
        "Clinics.Read",
        "Applicants.Write",
        "Applicants.Read",
        "Imaging.Write",
      ],
      sid: "003f5ad9-0631-0fb9-65fd-398e94606cec",
      sub: "uGoFXcwPHXWokME3e4XA6B8mI7XOQCBLH0bAXsKrdhc",
      tid: "f52ae62b-2ff7-4104-b90f-48cdc7454bfb",
      uti: "tM-afTjgxUCtOVNRHowGAA",
      ver: "2.0",
      ClinicID: "UK/LHR/00/",
    };
    if (!payload.ClinicID) {
      logger.error("Missing ClinicID");
    }

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
