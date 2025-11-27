import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../shared/config", () => ({
  assertEnvExists: vi.fn((value: string | undefined) => {
    if (!value) throw new Error("Missing environment variable");
    return value;
  }),
}));

// Important: mock BEFORE importing index.ts
const mockWriteApiDocumentation = vi.fn();
vi.mock("./generator", () => ({
  writeApiDocumentation: mockWriteApiDocumentation,
}));

// Mock routes
vi.mock("../applicant-service/lambdas/applicants", () => ({
  routes: [{ path: "/test", method: "GET" }],
}));

vi.mock("../application-service/lambdas/application", () => ({
  routes: [{ path: "/test", method: "GET" }],
}));

vi.mock("../clinic-service/lambdas/clinics", () => ({
  routes: [{ path: "/test", method: "GET" }],
}));
describe("index.ts bootstrap tests", () => {
  beforeEach(() => {
    vi.resetModules(); // resets module cache so re-import loads fresh env vars

    process.env.AWS_ACCOUNT_ID = "123456789012";
    process.env.AWS_REGION = "eu-west-2";
    process.env.APPLICANT_SERVICE_LAMBDA_NAME = "applicant-lambda";
    process.env.CLINIC_SERVICE_LAMBDA_NAME = "clinic-lambda";
    process.env.APPLICATION_SERVICE_LAMBDA_NAME = "application-lambda";
  });

  it("constructs swaggerConfig  with correct ARN and calls writeApiDocumentation", async () => {
    // Import after setting env vars + mocks
    const module = await import("./index");
    const {
      applicantServiceSwaggerConfig,
      clinicServiceSwaggerConfig,
      applicationServiceSwaggerConfig,
    } = module;

    expect(mockWriteApiDocumentation).toHaveBeenCalledTimes(1);

    // Extract call args
    const callArg = mockWriteApiDocumentation.mock.calls[0][0];
    //Should be an array of all 3 swagger configs
    expect(callArg).toEqual([
      clinicServiceSwaggerConfig,
      applicantServiceSwaggerConfig,
      applicationServiceSwaggerConfig,
    ]);

    expect(applicantServiceSwaggerConfig).toBeDefined();

    expect(applicantServiceSwaggerConfig.lambdaArn).toBe(
      "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:123456789012:function:applicant-lambda/invocations",
    );

    expect(applicantServiceSwaggerConfig.routes).toEqual([{ path: "/test", method: "GET" }]);

    expect(applicantServiceSwaggerConfig.tags).toEqual(["Applicant Service Endpoints"]);

    expect(applicationServiceSwaggerConfig).toBeDefined();

    expect(applicationServiceSwaggerConfig.lambdaArn).toBe(
      "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:123456789012:function:application-lambda/invocations",
    );

    expect(applicationServiceSwaggerConfig.routes).toEqual([{ path: "/test", method: "GET" }]);

    expect(applicationServiceSwaggerConfig.tags).toEqual(["Application Service Endpoints"]);

    expect(clinicServiceSwaggerConfig).toBeDefined();

    expect(clinicServiceSwaggerConfig.lambdaArn).toBe(
      "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:123456789012:function:clinic-lambda/invocations",
    );

    expect(clinicServiceSwaggerConfig.routes).toEqual([{ path: "/test", method: "GET" }]);

    expect(clinicServiceSwaggerConfig.tags).toEqual(["Clinic Service Endpoints"]);
  });

  it("throws when required environment variables are missing", async () => {
    delete process.env.AWS_REGION;

    await expect(import("./index")).rejects.toThrow("Missing environment variable");
  });
});
