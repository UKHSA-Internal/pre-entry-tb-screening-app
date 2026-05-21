# Audit Service

Records audit events for significant actions within the PETS system, providing a tamper-evident log for compliance and investigation purposes.

## Responsibilities

- Writing audit records when key actions occur (e.g., application created, updated, cancelled)
- Storing audit records in a dedicated DynamoDB table

## Source Location

`pets-core-services/src/audit-service/`

## Lambda Entry Point

`audit-service/lambdas/audit.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `createAuditHandler` | `handlers/create-audit.ts` | Writes a new audit record for a given action |

## Audit Record Structure

Each audit record captures:

- The action performed (e.g., `APPLICATION_CREATED`)
- The actor (user or system that performed the action)
- The resource affected (e.g., application ID, applicant ID)
- A timestamp

Types: `types/`
Models: `models/`

## Database

**Table:** `AUDIT_SERVICE_DATABASE_NAME` (env var)

| Key | Type | Notes |
| --- | --- | --- |
| `pk` | String (partition key) | Audit record identifier (e.g., resource ID) |
| `sk` | String (sort key) | Timestamp or action discriminator |

No Global Secondary Indexes — audit records are appended and queried by resource ID.

## Tests

Unit tests: `handlers/create-audit.spec.ts`
Fixtures: `fixtures/`

## Dependencies

- **DynamoDB** — audit table
- **Shared:** `logger`, `httpResponses`
