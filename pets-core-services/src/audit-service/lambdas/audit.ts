import { Handler } from "aws-lambda";

import { createAuditHandler } from "../handlers/create-audit";

export const handler: Handler = createAuditHandler;
