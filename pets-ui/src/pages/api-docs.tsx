import "swagger-ui-react/swagger-ui.css";

import React from "react";
import { Helmet } from "react-helmet-async";

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
  return (
    <>
      <Helmet>
        <title>Api Documentation</title>
      </Helmet>
      <SwaggerUI spec={spec} />
    </>
  );
};

export default ApiDocs;
