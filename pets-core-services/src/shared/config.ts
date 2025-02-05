export const getEnvironmentVariable = (variableName: string) => {
  const value = process.env[variableName];

  if (value === undefined) {
    throw new Error(`Environment variable ${variableName} is undefined`);
  }

  if (value === "") {
    throw new Error(`Environment variable ${variableName} is empty`);
  }

  return value;
};
