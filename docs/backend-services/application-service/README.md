# Application Service

Manages the lifecycle of TB screening applications — from creation through medical screening, chest X-ray submission, radiological review, and final certificate issuance.

## Responsibilities

- Creating and cancelling applications
- Managing each stage of the TB screening workflow
- Generating pre-signed S3 URLs for chest X-ray image uploads
- Providing the clinic dashboard with a filtered list of applications

## Source Location

`pets-core-services/src/application-service/`

## Lambda Entry Point

`application-service/lambdas/application.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `createApplicationHandler` | `handlers/create-application.ts` | Creates a new application for an applicant |
| `cancelApplicationHandler` | `handlers/cancel-application.ts` | Cancels an existing application |
| `getApplicationHandler` | `handlers/get-application.ts` | Fetches a single application by ID |
| `getDashboardApplicationsHandler` | `handlers/get-dashboard-applications.ts` | Returns applications for a clinic, filterable by status group |
| `generateImageUploadUrlHandler` | `handlers/generate-image-upload-url.ts` | Issues a pre-signed S3 URL for uploading a chest X-ray image |
| `saveChestRayHandler` | `handlers/save-chest-ray.ts` | Records chest X-ray metadata after upload |
| `saveMedicalScreeningHandler` | `handlers/save-medical-screening.ts` | Saves the medical screening section |
| `saveRadiologicalOutcomeHandler` | `handlers/save-radiological-outcome.ts` | Records the radiologist's outcome |
| `saveSputumDecisionHandler` | `handlers/save-sputum-decision.ts` | Records the sputum test decision |
| `saveSputumDetailsHandler` | `handlers/save-sputum-details.ts` | Records sputum test details |
| `saveTbCertificateHandler` | `handlers/save-tb-certificate.ts` | Issues or records the TB clearance certificate |
| `saveTravelInformationHandler` | `handlers/save-travel-information.ts` | Saves initial travel information |
| `updateTravelInformationHandler` | `handlers/update-travel-information.ts` | Updates previously saved travel information |

## Application Status Groups

Applications move through status groups that drive the dashboard view. The `applicationStatusGroup` attribute is stored on the application root record and indexed for efficient dashboard queries.

## Database

**Table:** `APPLICATION_SERVICE_DATABASE_NAME` (env var)

| Key | Type | Notes |
| --- | --- | --- |
| `pk` | String (partition key) | Application identifier |
| `sk` | String (sort key) | Record type (e.g., `APPLICATION#ROOT`, section keys) |
| `applicantId` | String | Links application to applicant — used in GSI |
| `clinicId` | String | Clinic that created the application — used in GSI |
| `applicationStatusGroup` | String | Current status group — used as GSI sort key |

**Global Secondary Indexes:**

| Index | Partition key | Sort key | Use |
| --- | --- | --- | --- |
| `APPLICANT_ID_INDEX` | `applicantId` | — | Fetch all applications for an applicant |
| `CLINIC_ID_INDEX` | `clinicId` | `applicationStatusGroup` | Clinic dashboard with status filtering |

## S3

**Bucket:** `IMAGE_BUCKET` (env var) — stores chest X-ray images. Pre-signed URLs are generated per upload and allow `PUT` directly from the browser.

## Key Types

Shared model: `pets-core-services/src/shared/models/application.ts`

## Tests

Unit tests: `handlers/*.spec.ts`

## Dependencies

- **DynamoDB** — application table
- **S3** — chest X-ray image storage
- **Shared:** `logger`, `httpResponses`, `Application` model
