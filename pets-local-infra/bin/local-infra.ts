#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { LocalInfrastructureStack } from "../lib/local-infra-stack";

const app = new cdk.App();
new LocalInfrastructureStack(app, "LocalInfrastructureStack", {
  env: {
    region: process.env.AWS_REGION,
    account: process.env.AWS_ACCOUNT_ID,
  },
});
