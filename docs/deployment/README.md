# Deployment Guide

PETS deployments are managed via GitHub Actions. All deployments to AWS are triggered manually through workflow dispatch.

## Environments

| Environment | Purpose | Approval required |
|---|---|---|
| `dev` | Development and feature testing | No |
| `test` | QA and integration testing | No |
| `preprod` | Pre-production validation | Yes (team lead) |
| `prod` | Production | Yes (team lead) |

## Prerequisites

- Access to the GitHub repository with permission to trigger workflows
- The feature branch has been reviewed and approved (for `preprod`/`prod`)
- All CI checks pass on the branch

## Triggering a Deployment

1. Go to the [Actions](https://github.com/UKHSA-Internal/pre-entry-tb-screening-app/actions) page
2. In the left panel, find the workflow named **`Pets Deployment - {target-env}`** (e.g., `Pets Deployment - dev`)
3. Click **Run workflow** in the top-right corner
4. Enter your branch name
5. Click **Run workflow** to start

> **Note:** Deploying to an environment will **overwrite** the existing deployment at that environment.

## Monitoring a Deployment

- Watch the workflow run in the Actions tab for progress and any errors
- If a PR is open for the deployed branch, a deployment URL will be posted as a comment after a successful deployment

## Post-Deployment Verification

After deploying, verify:

1. The application loads at the deployed URL
2. Authentication works (Azure B2C login)
3. Core workflows are functional (search applicant, create application)
4. Check CloudWatch logs for unexpected errors

## Deployment Failures

If a deployment fails:

1. Check the GitHub Actions workflow logs for the failing step
2. Check CloudWatch Logs in the target AWS account for Lambda errors
3. If the failure is infrastructure-related (CDK), check the CloudFormation stack events in the AWS Console
4. For urgent failures in `prod`, follow the [rollback procedure](#rollback)

## Rollback

There is no automated rollback. To roll back to a previous version:

1. Identify the last known good commit/branch
2. Trigger the deployment workflow with that branch name
3. Monitor the deployment to confirm the rollback succeeded

For database rollbacks, see [docs/database/migrations.md](../database/migrations.md#rollback).

## AWS Access

To access AWS environments (CloudWatch, CloudFormation, DynamoDB Console), you need the appropriate IAM role. See [docs/aws-access.md](../aws-access.md) for how to request access.

Retrieve short-lived credentials via [Halo](https://halopr.awsapps.com/start/#/?tab=accounts).
