import { GlobalContextStorageProvider } from "pino-lambda";

import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export const setApplicationIdContext = (request: { event: PetsAPIGatewayProxyEvent }) => {
  const applicationId = decodeURIComponent(
    request.event.pathParameters?.["applicationId"] || "",
  ).trim();

  GlobalContextStorageProvider.updateContext({
    applicationId,
  });
};
