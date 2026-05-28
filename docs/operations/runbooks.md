# Operational Runbooks

Step-by-step procedures for common operational tasks.

## Contents

- [Hotfix deployment](#hotfix-deployment)
- [Rollback a deployment](#rollback-a-deployment)
- [Investigating Lambda errors](#investigating-lambda-errors)
- [Investigating EDAP integration failures](#investigating-edap-integration-failures)
- [Data corrections](#data-corrections)
- [Incident response](#incident-response)

---

## Hotfix deployment

For urgent fixes that need to bypass the normal feature branch workflow:

1. Create a branch from `main`: `git checkout -b hotfix/TBBETA-{number}-{description}`
2. Make the minimal fix required — keep scope as small as possible
3. Open a PR against `main` — tag it as a hotfix and request expedited review
4. After approval, trigger the deployment to `dev` to verify the fix
5. If verified, trigger deployment to `test`, then `preprod`, then `prod`
6. Close the hotfix branch after merging

---

## Rollback a deployment

If a deployment introduces a regression:

1. Identify the last known good commit (check the Actions deployment history)
2. Trigger the `Pets Deployment - {env}` workflow with the last good branch/tag as the branch name
3. Verify the rollback resolved the issue
4. If DynamoDB data was corrupted by the bad deployment, refer to [database migrations](../database/migrations.md) and AWS PITR restore procedures

---

## Investigating Lambda errors

1. Log in to the AWS account via [Halo](https://halopr.awsapps.com/start/#/?tab=accounts)
2. Open **CloudWatch** → **Log groups**
3. Find the log group for the relevant Lambda (named by the Lambda function name)
4. Filter for `ERROR` level log entries
5. Use the `requestId` from the error log to trace the full request execution

**Common error patterns:**

| Log message | Likely cause |
|---|---|
| `Request missing parsed headers` | Client sent request without required headers |
| `Clinic Id missing` | JWT token does not contain `clinicId` claim |
| `Applicant has been created without an application` | Data integrity issue — applicant exists but no application |
| `Something went wrong` | Unhandled server error — check the full stack trace in the log |

---

## Investigating EDAP integration failures

If records are missing from EDAP:

1. Check the **EDAP integration Dead Letter Queue** (`EDAP_INTEGRATION_DLQ_NAME`) in the AWS SQS console
2. If messages are present in the DLQ, inspect them to identify which records failed and why
3. Fix the root cause (e.g., schema mismatch, EDAP endpoint unavailable)
4. Re-drive messages from the DLQ back to the main queue, or run the `rewrite_db_items` migration to re-send all records

For the `rewrite_db_items` migration procedure, see [docs/database/migrations.md](../database/migrations.md#rewrite_db_items).

---

## Data corrections

For correcting individual records:

- **Do not** edit DynamoDB records directly in the console unless absolutely necessary
- Prefer triggering the appropriate workflow or migration
- For bulk corrections, use the available [database migrations](../database/migrations.md)
- For one-off record fixes, consult the team lead before proceeding

---

## Incident response

### Severity levels

| Severity | Description | Response time |
|---|---|---|
| P1 | Production is down or data is being corrupted | Immediate |
| P2 | Core workflow broken in production (can't create/search applications) | Within 1 hour |
| P3 | Non-critical feature broken or degraded | Within 1 business day |

### Response steps

1. **Acknowledge** — confirm the incident is being handled in the team channel
2. **Assess** — determine severity and affected area (which service, which environment)
3. **Communicate** — notify stakeholders if P1 or P2
4. **Investigate** — use CloudWatch logs and the Lambda debugging steps above
5. **Fix or rollback** — apply hotfix or rollback as appropriate
6. **Verify** — confirm the fix resolved the issue
7. **Post-incident review** — document what happened, root cause, and how to prevent recurrence
