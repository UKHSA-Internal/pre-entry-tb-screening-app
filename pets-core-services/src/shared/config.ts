import assert from "assert";

export const isLocal = () => assertEnvExists(process.env.ENVIRONMENT) === "local";

// unit, integration
export const isTest = () => assertEnvExists(process.env.ENVIRONMENT) === "TEST_LOCAL";

export const assertEnvExists = (envValue: string | undefined) => {
  assert(envValue);
  return envValue;
};
