import swaggerSpec from "../../../pets-core-services/openapi-docs.json";

export const getSwaggerSpec = () => {
  const serverUrl = import.meta.env.DEV
    ? `http://${location.host}/api`
    : `https://${location.host}/api`;

  return {
    ...swaggerSpec,
    servers: [
      {
        url: serverUrl,
      },
    ],
  };
};
