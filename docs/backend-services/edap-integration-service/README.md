# EDAP Integration Service

Processes DynamoDB stream events and forwards applicant and application data to the External Data Analytics Platform (EDAP).

## Responsibilities

- Consuming DynamoDB stream events from the applicant and application tables
- Transforming records into the EDAP-expected format
- Publishing transformed records to an SQS queue for EDAP ingestion
- Handling failures via a Dead Letter Queue (DLQ)

## Source Location

`pets-core-services/src/edap-integration-service/`

## Lambda Entry Point

`edap-integration-service/lambdas/edap-integration.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `processDbStreamsHandler` | `handlers/process-db-streams.ts` | Processes a batch of DynamoDB stream records and sends them to EDAP via SQS |

## Trigger

This Lambda is invoked by **DynamoDB Streams** (not via API Gateway) when records are inserted or modified in the applicant or application tables. It does not have an HTTP endpoint.

## Message Flow

```text
DynamoDB Stream → EDAP Integration Lambda → SQS Queue → EDAP
                                                ↓ (on failure)
                                             Dead Letter Queue (DLQ)
```

- **Queue:** `EDAP_INTEGRATION_QUEUE_NAME` (env var)
- **DLQ:** `EDAP_INTEGRATION_DLQ_NAME` (env var)
- **Max receive count before DLQ:** 3

## Error Handling

Failed messages are retried up to 3 times by SQS before being moved to the DLQ. The DLQ should be monitored and investigated when messages land there, as it indicates data that failed to reach EDAP.

## Tests

Unit tests: `handlers/process-db-streams.spec.ts`
Integration tests: `tests/`

## Database Migrations

Some migrations are designed to trigger DynamoDB Streams to re-send records to EDAP (see [docs/database/migrations.md](../../database/migrations.md)). Specifically, the `rewrite_db_items` migration re-writes all records to re-trigger streams.

## Dependencies

- **DynamoDB Streams** — source of events
- **SQS** — target queue for EDAP messages
- **Shared:** `logger`
