import assert from "assert";
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

import { logger, withRequest } from "../shared/logger";
import { policyMapping, Roles } from "./constants";
import { verifyJwtToken } from "./verifyJwtToken";

export const handler = (
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

<<<<<<< HEAD
    const payload = {
      aud: "b8af26cb-2053-4f08-a4f1-ccb7b97f7038",
      iss: "https://f52ae62b-2ff7-4104-b90f-48cdc7454bfb.ciamlogin.com/f52ae62b-2ff7-4104-b90f-48cdc7454bfb/v2.0",
      iat: 1752667341,
      nbf: 1752667341,
      exp: 1752671241,
      aio: "AVQAq/8ZAAAAq4l3IBHKd7O80QE41qdjX2sD+up5QvUeGIEtYY8LulGQhZGd53sjPJoq9+whJ/+qVvsxl7W4B8Ey3Xwp2p9+6eG6G6yweY8QCXlf2uMPvb0=",
      email: "pets.tester3@hotmail.com",
      name: "unknown",
      nonce: "019812e0-790e-704e-bd0e-a161db5f7355",
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
      uti: "-UVZtu8zyU-am6915N4DAA",
      ver: "2.0",
      ClinicID: "UK/LHR/00/",
    };
=======
    const payload = await verifyJwtToken(token);
>>>>>>> origin

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
