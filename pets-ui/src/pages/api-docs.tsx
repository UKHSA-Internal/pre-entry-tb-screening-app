import "swagger-ui-react/swagger-ui.css";

import React, { useCallback } from "react";
import { Helmet } from "react-helmet-async";

import { acquireTokenSilently } from "@/utils/auth";

import swaggerSpec from "../../../pets-core-services/openapi-docs.json";

const SwaggerUI = React.lazy(() => import("swagger-ui-react"));
const ApiDocs = () => {
  const serverUrl = import.meta.env.DEV
    ? `http://${location.host}/api`
    : `https://${location.host}/api`;

  const spec = {
    ...swaggerSpec,
    servers: [
      {
        url: serverUrl,
      },
    ],
  };

  const handleComplete = useCallback(async (swagger: any) => {
    const tokenResponse = await acquireTokenSilently();
    const idToken = tokenResponse?.idToken;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    swagger.preauthorizeApiKey("authorizer", `Bearer ${idToken}`);
  }, []);

  return (
    <>
      <Helmet>
        <title>Api Documentation</title>
      </Helmet>
      <SwaggerUI spec={spec} onComplete={handleComplete} />
    </>
  );
};

export default ApiDocs;
