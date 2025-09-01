import { InvokeCommand } from "@aws-sdk/client-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { afterEach, assert, beforeEach, describe, expect, it } from "vitest";

import { mockAPIGwEvent } from "../../test/mocks/events";
import awsClients from "../clients/aws";
import { simulateLambdaAuthorizer } from "./local-auth";

describe("simulateLambdaAuthorizer", () => {
  const lambdaClientMock = mockClient(awsClients.lambdaClient);
  const originalEnv = process.env;
  beforeEach(() => {
    lambdaClientMock.reset();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should return the Lambda response when invoked locally", async () => {
    process.env.ENVIRONMENT = "local";

    const mockPayload = {
      context: {
        clinicId: "Test-Clinic",
        createdBy: "CreatedByAction",
      },
      policyDocument: {
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [],
          },
        ],
      },
    };

    lambdaClientMock.on(InvokeCommand).resolves({
      //@ts-expect-error type difference
      Payload: new TextEncoder().encode(JSON.stringify(mockPayload)),
    });

    const mockRequest = { event: mockAPIGwEvent };

    await simulateLambdaAuthorizer(mockRequest);

    expect(lambdaClientMock.commandCalls(InvokeCommand)).toHaveLength(1);

    expect(mockRequest.event.requestContext.authorizer).toMatchObject({
      ...mockPayload.context,
    });
  });

  it("should return a 500 response if Lambda invocation fails", async () => {
    process.env.ENVIRONMENT = "local";

    lambdaClientMock.on(InvokeCommand).rejects("failed invocation");

    const result = await simulateLambdaAuthorizer({ event: mockAPIGwEvent });
    assert(result);
    expect(lambdaClientMock.commandCalls(InvokeCommand)).toHaveLength(1);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toMatchObject({
      message: "Invalid token",
    });
  });

  it("should return undefined if not running locally", async () => {
    process.env.ENVIRONMENT = "staging";

    const result = await simulateLambdaAuthorizer({ event: mockAPIGwEvent });
    expect(result).toBeUndefined();
    expect(lambdaClientMock.commandCalls(InvokeCommand)).toHaveLength(0);
  });
});
