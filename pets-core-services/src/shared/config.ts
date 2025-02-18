import assert from "assert";

export const isLocal = () => assertEnvExists(process.env.ENVIRONMENT) === "local";

export const assertEnvExists = (envValue: string | undefined) => {
  assert(envValue);
  return envValue;
};
