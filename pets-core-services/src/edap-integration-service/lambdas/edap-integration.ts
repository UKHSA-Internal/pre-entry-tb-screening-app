import { Handler } from "aws-lambda";

import { edapIntegrationHandler } from "../handlers/process-db-streams";

export const handler: Handler = edapIntegrationHandler;
