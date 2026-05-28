# Clinic Service

Manages the registry of TB screening clinics that are authorised to use the PETS system.

## Responsibilities

- Creating clinic records
- Listing all clinics
- Fetching a single clinic by ID
- Checking whether a clinic is currently active

## Source Location

`pets-core-services/src/clinic-service/`

## Lambda Entry Point

`clinic-service/lambdas/clinics.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `createClinicHandler` | `handlers/createClinic.ts` | Creates a new clinic record |
| `fetchClinicsHandler` | `handlers/fetchClinics.ts` | Returns a list of all clinics |
| `getClinicHandler` | `handlers/getClinic.ts` | Fetches a single clinic by ID |
| `isActiveClinicHandler` | `handlers/isActiveClinic.ts` | Returns whether a clinic is currently active |

## Clinic Data

Static clinic data is maintained in `clinicsData.json`. This is used for seeding or reference purposes alongside the dynamic DynamoDB records.

## Database

**Table:** `CLINIC_SERVICE_DATABASE_NAME` (env var)

| Key | Type | Notes |
| --- | --- | --- |
| `pk` | String (partition key) | Clinic identifier |
| `sk` | String (sort key) | Record type discriminator |

No Global Secondary Indexes — clinics are looked up directly by their ID.

## Key Types

Types: `types/`
Models: `models/`

## Tests

Unit tests: `handlers/*.spec.ts`
Fixtures: `fixtures/`

## Dependencies

- **DynamoDB** — clinic table
- **Shared:** `logger`, `httpResponses`
