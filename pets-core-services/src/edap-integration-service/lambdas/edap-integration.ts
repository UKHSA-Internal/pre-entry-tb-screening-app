import { Handler } from "aws-lambda";

import { handler } from "../handlers/process-db-streams";

export const lambdaHandler: Handler = handler;
