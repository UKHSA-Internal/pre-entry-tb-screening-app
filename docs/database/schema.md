# Database Schema

PETS uses **Amazon DynamoDB** with a single-table design per service. All tables share the same base key structure: `pk` (partition key) and `sk` (sort key), both strings.

## Tables

### clinic-service-table

Stores clinic records.

| Attribute | Type | Notes |
| --- | --- | --- |
| `pk` | String (PK) | Clinic identifier |
| `sk` | String (SK) | Record type |

No GSIs. Clinics are fetched directly by ID or via full table scan for listing.

---

### applicant-service-table

Stores applicant personal and passport details.

| Attribute | Type | Notes |
| --- | --- | --- |
| `pk` | String (PK) | Applicant identifier |
| `sk` | String (SK) | Record type |
| `passportId` | String | Composite of country code + passport number |

**Global Secondary Indexes:**

| Index name | Partition key | Sort key | Use case |
| --- | --- | --- | --- |
| `PASSPORT_ID_INDEX` | `passportId` | — | Look up an applicant by passport number + country of issue |

---

### application-service-table

Stores TB screening applications. Each application is made up of multiple records distinguished by `sk` — a root record (`APPLICATION#ROOT`) plus section-specific records.

| Attribute | Type | Notes |
| --- | --- | --- |
| `pk` | String (PK) | Application identifier |
| `sk` | String (SK) | Record type — e.g., `APPLICATION#ROOT`, `TRAVEL`, `CHEST_RAY`, etc. |
| `applicantId` | String | Links to the applicant |
| `clinicId` | String | Clinic that created the application |
| `applicationStatusGroup` | String | Current status group — drives dashboard filtering |
| `dateCreated` | String | ISO 8601 timestamp |

**Global Secondary Indexes:**

| Index name | Partition key | Sort key | Use case |
| --- | --- | --- | --- |
| `APPLICANT_ID_INDEX` | `applicantId` | — | Fetch all applications for a given applicant |
| `CLINIC_ID_INDEX` | `clinicId` | `applicationStatusGroup` | Clinic dashboard — filter applications by clinic and status group |

---

### audit-service-table

Stores audit records for compliance and investigation.

| Attribute | Type | Notes |
| --- | --- | --- |
| `pk` | String (PK) | Resource identifier (e.g., application or applicant ID) |
| `sk` | String (SK) | Timestamp or action-based discriminator |

No GSIs. Audit records are queried by resource ID.

---

## S3 Bucket

**Bucket:** `IMAGE_BUCKET` (env var)

Stores chest X-ray images uploaded during the application process. The application service generates pre-signed `PUT` URLs for direct browser upload. The DICOM service is triggered on upload to scan for malware.

CORS is configured to allow `GET`, `PUT`, `POST`, `DELETE`, `HEAD` from any origin (restricted in production via environment-specific bucket policies).

---

## SQS Queues

### EDAP Integration Queue

**Queue:** `EDAP_INTEGRATION_QUEUE_NAME` (env var)

Receives messages from the EDAP integration Lambda after processing DynamoDB stream events.

**Dead Letter Queue:** `EDAP_INTEGRATION_DLQ_NAME` (env var)

- **Max receive count:** 3 — messages are retried 3 times before being moved to the DLQ

---

## Local Development

Tables, buckets, and queues are provisioned by LocalStack via AWS CDK in `pets-local-infra/lib/local-infra-stack.ts`. Environment variable names for table names, index names, and queue names are defined in `configs/.env`.

See [migrations.md](migrations.md) for database migration procedures.
