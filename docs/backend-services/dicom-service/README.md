# DICOM Service

Scans uploaded chest X-ray images for malware before they are accepted into the system.

## Responsibilities

- Triggered by S3 events when a chest X-ray image is uploaded
- Scans the uploaded file for malware
- Quarantines the file if a threat is detected; marks it safe otherwise

## Source Location

`pets-core-services/src/dicom-service/`

## Lambda Entry Point

`dicom-service/lambdas/quarantine.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `quarantineHandler` | `lambdas/quarantine.ts` | Receives an S3 event, scans the uploaded image, and quarantines or approves it |

## Trigger

This Lambda is invoked by an **S3 event notification** (not via API Gateway) when a file is uploaded to the `IMAGE_BUCKET`. It does not have an HTTP endpoint.

## Malware Scanning

The service performs a malware/DICOM integrity check on the uploaded file. If the file is flagged:

- It is moved to a quarantine location within the bucket (or deleted)
- The associated application record is updated to reflect the quarantine status

If the file passes, the application record is updated to indicate the image is safe for radiological review.

## Key Types

Type definitions: `types.d.ts`

## Tests

Unit tests: `lambdas/quarantine.test.ts`

## Dependencies

- **S3** — reads the uploaded image from `IMAGE_BUCKET`
- **Application service** — updates the application record with scan result
- **Shared:** `logger`
