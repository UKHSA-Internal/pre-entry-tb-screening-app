import pino, { multistream } from "pino";
import { lambdaRequestTracker, pinoLambdaDestination } from "pino-lambda";
import PinoPretty from "pino-pretty";

import { isLocal, isTest } from "./config";

let streams = [{ stream: pinoLambdaDestination() }];

if (isLocal() || isTest()) {
  const logPrettifier = { stream: PinoPretty({ colorize: true, sync: true }) };
  streams = [logPrettifier, ...streams];
}

export const withRequest = lambdaRequestTracker();

const logLevel = process.env.LOG_LEVEL ?? "info";
export const logger = pino(
  {
    level: logLevel,
  },
  multistream(streams),
);
