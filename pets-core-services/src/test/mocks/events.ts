/**
 * Sample APIGatewayProxyEvent to mock request data.
 */

import { APIGatewayEvent, APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";

export const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "mocked",
  functionVersion: "mocked",
  invokedFunctionArn: "mocked",
  memoryLimitInMB: "mocked",
  awsRequestId: "mocked",
  logGroupName: "mocked",
  logStreamName: "mocked",
  getRemainingTimeInMillis(): number {
    return 999;
  },
  done(): void {
    return;
  },
  fail(): void {
    return;
  },
  succeed(): void {
    return;
  },
};

export const mockAPIGwEvent: APIGatewayEvent = {
  body: null,
  headers: {
    "User-Agent": "sample-user-agent",
    "X-Forwarded-For": "sample-x-forwarded-for",
  },
  httpMethod: "sample-http-method",
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  path: "",
  pathParameters: {},
  queryStringParameters: {},
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: null,
    domainName: "sample-domain-name",
    httpMethod: "sample-http-method",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "sample-source-ip",
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: "sample-path",
    protocol: "sample-protocol",
    requestId: "sample-request-id",
    requestTimeEpoch: 0,
    resourceId: "sample-resource-id",
    resourcePath: "sample-resource-path",
    stage: "sample-stage",
  },
  resource: "",
  stageVariables: null,
};

export const mockRequestAuthoriserEvent: APIGatewayRequestAuthorizerEvent = {
  type: "REQUEST",
  methodArn: "arn:aws:execute-api:us-east-1:123456789012:abcdef123/test/GET/request",
  resource: "/request",
  path: "/request",
  httpMethod: "GET",
  headers: {
    "X-AMZ-Date": "20170718T062915Z",
    Accept: "*/*",
    HeaderAuth1: "headerValue1",
    "CloudFront-Viewer-Country": "US",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Is-Mobile-Viewer": "false",
    "User-Agent": "...",
  },
  queryStringParameters: {
    QueryString1: "queryValue1",
  },
  pathParameters: {},
  stageVariables: {
    StageVar1: "stageValue1",
  },
  requestContext: {
    path: "/request",
    accountId: "123456789012",
    resourceId: "05c7jb",
    stage: "test",
    requestId: "...",
    identity: {
      apiKey: "...",
      sourceIp: "...",
      clientCert: {
        clientCertPem: "CERT_CONTENT",
        subjectDN: "www.example.com",
        issuerDN: "Example issuer",
        serialNumber: "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
        validity: {
          notBefore: "May 28 12:30:02 2019 GMT",
          notAfter: "Aug  5 09:36:04 2021 GMT",
        },
      },
      accessKey: null,
      accountId: null,
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      user: null,
      userAgent: null,
      userArn: null,
    },
    resourcePath: "/request",
    httpMethod: "GET",
    apiId: "abcdef123",
    authorizer: undefined,
    protocol: "",
    requestTimeEpoch: 0,
  },
  multiValueHeaders: null,
  multiValueQueryStringParameters: null,
};
