import "swagger-ui-react/swagger-ui.css";

import React from "react";
import { Helmet } from "react-helmet-async";

import swaggerSpec from "../../../pets-core-services/openapi-docs.json";

const SwaggerUI = React.lazy(() => import("swagger-ui-react"));
const ApiDocs = () => (
  <>
    <Helmet>
      <title>Api Documentation</title>
    </Helmet>
    <SwaggerUI spec={swaggerSpec} />
  </>
);

export default ApiDocs;
