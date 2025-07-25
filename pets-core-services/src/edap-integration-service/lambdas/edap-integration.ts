import { Handler } from "aws-lambda";

import { handler } from "../handlers/send-db-stream";

export const lambdaHandler: Handler = handler;
