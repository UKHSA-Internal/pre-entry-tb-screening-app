import { APIGatewayTokenAuthorizerEvent, Context, Statement } from "aws-lambda";
import { authorizer } from "../../../src/functions/authorizer";
import { IncomingMessage } from "http";
import { APIGatewayAuthorizerResult } from "aws-lambda/trigger/api-gateway-authorizer";
import { getLegacyRoles } from "../../../src/services/roles";
import jwtJson from "../../resources/jwt.json";
import { getValidJwt } from "../../../src/services/tokens";
import getSecrets from "../../../src/services/secrets-utils"

const event: APIGatewayTokenAuthorizerEvent = {
  type: "TOKEN",
  authorizationToken: "Bearer myBearerToken",
  methodArn: "arn:aws:execute-api:eu-west-1:*:*/*/*/*",
};

describe("authorizer() unit tests", () => {
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { AZURE_TENANT_ID: "tenant", AZURE_CLIENT_ID: "client" };
    (getValidJwt as jest.Mock) = jest.fn().mockReturnValue(jwtJson);
    (getSecrets as jest.Mock) = jest.fn().mockReturnValue({"SecretString": '{"AZURE_CLIENT_ID": "client", "AZURE_TENANT_ID": "tenant"}'});
  });

  it("should fail on non-2xx HTTP status", async () => {
    (getValidJwt as jest.Mock) = jest.fn().mockRejectedValue({ statusCode: 418, body: "I'm a teapot", options: { url: "http://example.org" }, response: {} as IncomingMessage });

    await expectUnauthorised(event);
  });

  it("should fail on JWT signature check error", async () => {
    (getValidJwt as jest.Mock) = jest.fn().mockRejectedValue(new Error("test-signature-error"));

    await expectUnauthorised(event);
  });

  it("should return valid read-only statements on valid JWT", async () => {
    const jwtJsonClone = JSON.parse(JSON.stringify(jwtJson));
    jwtJsonClone.payload.roles = ["SystemAdmin.read"];
    (getValidJwt as jest.Mock) = jest.fn().mockReturnValue(jwtJsonClone);

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual(jwtJson.payload.sub);
    expect(returnValue.policyDocument.Statement.length).toEqual(1);
    expect(returnValue.policyDocument.Statement).toContainEqual(
      buildAllowStatementWithResource("arn:aws:execute-api:eu-west-1:*:*/*/GET/*"));
  });

  it("should return valid write statements on valid JWT", async () => {
    const jwtJsonClone = JSON.parse(JSON.stringify(jwtJson));
    jwtJsonClone.payload.roles = ["SystemAdmin.write"];
    (getValidJwt as jest.Mock) = jest.fn().mockReturnValue(jwtJsonClone);

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual(jwtJson.payload.sub);

    expect(returnValue.policyDocument.Statement.length).toEqual(1);
    expect(returnValue.policyDocument.Statement).toContainEqual(
      buildAllowStatementWithResource("arn:aws:execute-api:eu-west-1:*:*/*/*/*"));
  });

  it("should return valid clinic read statements on valid JWT", async () => {
    const jwtJsonClone = JSON.parse(JSON.stringify(jwtJson));
    jwtJsonClone.payload.roles = ["HeathrowDoctor.read"];
    (getValidJwt as jest.Mock) = jest.fn().mockReturnValue(jwtJsonClone);

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual(jwtJson.payload.sub);

    expect(returnValue.policyDocument.Statement.length).toEqual(1);
    expect(returnValue.policyDocument.Statement).toContainEqual(
      buildAllowStatementWithResource("arn:aws:execute-api:eu-west-1:*:*/*/GET/clinics*"));
  });

  it("should return an accurate policy based on a single functional role", async () => {
    (getLegacyRoles as jest.Mock) = jest.fn().mockReturnValue([]);
    jwtJson.payload.roles = ["Clinics.ReadAll"];

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual(jwtJson.payload.sub);

    expect(returnValue.policyDocument.Statement.length).toEqual(2);
    expect(returnValue.policyDocument.Statement).toContainEqual(
      buildAllowStatementWithResource("arn:aws:execute-api:eu-west-1:*:*/*/OPTIONS/clinics"));
  });

  it("should return an accurate policy based on multiple functional roles", async () => {
    (getLegacyRoles as jest.Mock) = jest.fn().mockReturnValue([]);
    jwtJson.payload.roles = ["Clinics.ReadAll", "Clinics.WriteAll"];

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual(jwtJson.payload.sub);
    expect(returnValue.policyDocument.Statement.length).toEqual(3);

    const get: { Action: string; Effect: string; Resource: string } = returnValue.policyDocument.Statement[0] as unknown as { Action: string; Effect: string; Resource: string };
    expect(get.Effect).toEqual("Allow");
    expect(get.Action).toEqual("execute-api:Invoke");
    expect(get.Resource).toEqual("arn:aws:execute-api:eu-west-1:*:*/*/GET/clinics");

    const post: { Action: string; Effect: string; Resource: string } = returnValue.policyDocument.Statement[2] as unknown as { Action: string; Effect: string; Resource: string };
    expect(post.Effect).toEqual("Allow");
    expect(post.Action).toEqual("execute-api:Invoke");
    expect(post.Resource).toEqual("arn:aws:execute-api:eu-west-1:*:*/*/POST/clinics");
  });

  it("should return an unauthorised policy response", async () => {
    jwtJson.payload.roles = [];

    const returnValue: APIGatewayAuthorizerResult = await authorizer(event, exampleContext());

    expect(returnValue.principalId).toEqual("Unauthorised");

    expect(returnValue.policyDocument.Statement.length).toEqual(1);
    expect(returnValue.policyDocument.Statement).toContainEqual(
      buildDenyStatementWithResource("arn:aws:execute-api:eu-west-1:*:*/*/*"));
  });
});

const expectUnauthorised = async (e: APIGatewayTokenAuthorizerEvent) => {
  (getSecrets as jest.Mock) = jest.fn().mockReturnValue({ $metadata: {} })
  await expect(authorizer(e, exampleContext())).resolves.toMatchObject({
    principalId: "Unauthorised",
  });
};

const exampleContext = (): Context => {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "test",
    functionVersion: "0.0.0",
    invokedFunctionArn: "arn:aws:execute-api:eu-west-1:TEST",
    memoryLimitInMB: "128",
    awsRequestId: "TEST-AWS-REQUEST-ID",
    logGroupName: "TEST-LOG-GROUP-NAME",
    logStreamName: "TEST-LOG-STREAM-NAME",
    getRemainingTimeInMillis: (): number => 86400000,
    done: (): void => {
      /* circumvent TSLint no-empty */
    },
    fail: (): void => {
      /* circumvent TSLint no-empty */
    },
    succeed: (): void => {
      /* circumvent TSLint no-empty */
    },
  };
};

const buildAllowStatementWithResource = (resource: string): Statement => {
  return {
    Effect: "Allow",
    Action: "execute-api:Invoke",
    Resource: resource,
  }
}

const buildDenyStatementWithResource = (resource: string): Statement => {
  return {
    Effect: "Deny",
    Action: "execute-api:Invoke",
    Resource: resource,
  }
}
