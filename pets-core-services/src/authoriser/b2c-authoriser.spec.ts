import { APIGatewayRequestAuthorizerEvent, Callback } from "aws-lambda";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { context, mockRequestAuthoriserEvent } from "../test/mocks/events";
import { handler } from "./b2c-authoriser";

const mockVerify = vi.fn();
vi.mock("aws-jwt-verify", () => ({
  JwtVerifier: {
    create: vi.fn(() => ({
      verify: mockVerify,
    })),
  },
}));

describe("Authorizer Lambda", () => {
  let callback: Callback;
  beforeEach(() => {
    vi.clearAllMocks();
    callback = vi.fn();
  });

  it("should return an Allow policy for a valid token", async () => {
    // Arrange
    const mockToken = "valid.jwt.token";
    const mockPayload = {
      email: "johndoe@email.com",
      clinicId: "Apollo Clinic",
      roles: [
        "Application.Read",
        "Application.Write",
        "Clinics.Read",
        "Applicants.Write",
        "Applicants.Read",
        "Imaging.Write",
      ],
      sub: "user123",
    };

    mockVerify.mockResolvedValue(mockPayload);

    const event = {
      ...mockRequestAuthoriserEvent,
      headers: { Authorization: `Bearer ${mockToken}` },
    };

    // Act
    await handler(event, context, callback);

    // Assert
    expect(mockVerify).toHaveBeenCalledWith(mockToken);
    expect(callback).toHaveBeenCalledWith(null, {
      context: {
        clinicId: "Apollo Clinic",
        createdBy: "johndoe@email.com",
      },
      policyDocument: {
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/application",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/application/*",
            ],
          },
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/POST/application",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/POST/application/*",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/PUT/application",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/PUT/application/*",
            ],
          },
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/clinics",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/clinics/*",
            ],
          },
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/POST/applicant",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/POST/applicant/*",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/PUT/applicant",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/PUT/applicant/*",
            ],
          },
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/applicant",
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/GET/applicant/*",
            ],
          },
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-2:000000000000:TEST_API_GATEWAY_ID/*/POST/application/*",
            ],
          },
        ],
        Version: "2012-10-17",
      },
      principalId: "user",
    });
  });

  it("Unmapped role in token should be ignored for a valid token", async () => {
    // Arrange
    const mockToken = "valid.jwt.token";
    const mockPayload = {
      email: "johndoe@email.com",
      roles: ["Unmapped.role"],
      sub: "user123",
    };

    mockVerify.mockResolvedValue(mockPayload);

    const event = {
      ...mockRequestAuthoriserEvent,
      headers: { Authorization: `Bearer ${mockToken}` },
    };

    // Act
    await handler(event, context, callback);

    // Assert
    expect(mockVerify).toHaveBeenCalledWith(mockToken);
    expect(callback).toHaveBeenCalledWith(null, {
      context: {
        clinicId: "Apollo Clinic",
        createdBy: "johndoe@email.com",
      },
      policyDocument: {
        Statement: [],
        Version: "2012-10-17",
      },
      principalId: "user",
    });
  });

  it("should return Unauthorized if headers are missing", async () => {
    const event = {} as APIGatewayRequestAuthorizerEvent;

    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith("Unauthorized");
  });

  it("should return Unauthorized if Authorization header is missing", async () => {
    const event = { ...mockRequestAuthoriserEvent, headers: {} };

    await handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith("Unauthorized");
  });

  it("should return Unauthorized if token verification fails", async () => {
    // Arrange
    const mockToken = "invalid.jwt.token";

    const event = {
      ...mockRequestAuthoriserEvent,
      headers: { Authorization: `Bearer ${mockToken}` },
    };

    mockVerify.mockRejectedValue(new Error("Invalid Token"));

    // Act
    await handler(event, context, callback);

    // Assert
    expect(mockVerify).toHaveBeenCalledWith(mockToken);
    expect(callback).toHaveBeenCalledWith("Unauthorized");
  });
});
