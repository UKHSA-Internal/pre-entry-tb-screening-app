import "swagger-ui-react/swagger-ui.css";

import React, { useCallback } from "react";
import { Helmet } from "react-helmet-async";

import { swaggerAuth } from "@/utils/auth";
import { getSwaggerSpec } from "@/utils/swagger-utils";

const SwaggerUI = React.lazy(() => import("swagger-ui-react"));
const ApiDocs = () => {
  const handleComplete = useCallback(swaggerAuth, []);
  const spec = getSwaggerSpec();

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
