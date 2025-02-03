import "swagger-ui-react/swagger-ui.css";

import { Helmet } from "react-helmet-async";
import SwaggerUI from "swagger-ui-react";

import swaggerSpec from "../../../pets-core-services/openapi-docs.json";

const ApiDocs = () => (
  <>
    <Helmet>
      <title>Api Documentation</title>
    </Helmet>
    <SwaggerUI spec={swaggerSpec} />
  </>
);

export default ApiDocs;
