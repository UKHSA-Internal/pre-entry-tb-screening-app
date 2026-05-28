# Database Migrations

Migrations are AWS Glue Job Python scripts that modify data in the DynamoDB applicant and application tables. They are triggered via GitHub Actions workflows.

For the original migration script documentation, see [scripts/db_migrations/README.md](../../scripts/db_migrations/README.md).

## Available Migrations

| Migration name | Affected tables | Description |
| --- | --- | --- |
| `migrate_applicants` | Applicant, Application | Changes `_pk_` attribute in applicant records and sets new attributes; also adds `applicantId` to application records |
| `set_application_statusgroup` | Application | Adds or recalculates the `applicationStatusGroup` attribute on all root application records |
| `rewrite_db_items` | Applicant, Application | Re-writes all records without value changes — triggers DynamoDB Streams to re-send all data to EDAP |

## Triggering a Migration

Migrations are triggered via the **DB Migrations** GitHub Actions workflow:

1. Go to the [Actions](https://github.com/UKHSA-Internal/pre-entry-tb-screening-app/actions) page
2. Find the **DB Migrations** workflow
3. Click **Run workflow**
4. Provide:
   - The target environment (`dev`, `test`, `preprod`, or `prod`)
   - The migration name (from the table above)
5. Monitor the workflow run for completion and errors

> **Caution:** Migrations run directly against the target environment's DynamoDB tables. Always test on `dev` before running on `test` or `prod`.

## Migration Details

### migrate_applicants

Changes the `_pk_` attribute in applicant records to the new format and provisions new attributes. Also adds the `applicantId` attribute to associated application records to ensure referential consistency.

**When to run:** After a schema change that modifies how applicant primary keys or IDs are structured.

### set_application_statusgroup

Adds or corrects the `applicationStatusGroup` attribute on every root application record (`sk = APPLICATION#ROOT`). Ignores any existing value and recalculates from the current application state.

**When to run:** If `applicationStatusGroup` values are missing or incorrect — e.g., after a status group logic change, or if the dashboard is not showing applications correctly.

### rewrite_db_items

Re-writes all records in both tables without changing values. This triggers DynamoDB Streams events, which causes the EDAP integration Lambda to re-send all records to EDAP.

**When to run:** If EDAP is missing historical data or if records need to be re-synced after an EDAP integration outage. This migration internally runs three sub-migrations in order:

1. `rewrite_applicant_records`
2. `rewrite_application_root_records`
3. `rewrite_application_other_records`

## Rollback

There is no automatic rollback for migrations. Before running a migration on a non-dev environment:

- Ensure a DynamoDB point-in-time recovery (PITR) backup is enabled on the target tables
- Confirm the migration has been verified on `dev`
- Have a recovery plan in place if the migration produces incorrect results

To restore from a PITR backup, follow the AWS documentation for [restoring a DynamoDB table](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.Tutorial.html).
