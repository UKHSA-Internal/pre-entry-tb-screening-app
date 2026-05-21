# Applicant Service

Manages applicant records — the personal and passport details of individuals undergoing TB screening.

## Responsibilities

- Creating new applicant records
- Searching for an existing applicant by passport number and country of issue
- Updating applicant details

## Source Location

`pets-core-services/src/applicant-service/`

## Lambda Entry Point

`applicant-service/lambdas/applicants.ts`

## Handlers

| Handler | File | Description |
| --- | --- | --- |
| `postApplicantHandler` | `handlers/postApplicant.ts` | Creates a new applicant record |
| `searchApplicantHandler` | `handlers/searchApplicant.ts` | Looks up an applicant by passport number + country of issue; also returns their associated applications |
| `updateApplicantHandler` | `handlers/updateApplicant.ts` | Updates an existing applicant record |

### Search behaviour

`searchApplicantHandler` queries by `passportId` (composite of passport number and country of issue) using a DynamoDB GSI. If found, it also retrieves all applications for the applicant and returns them sorted by `dateCreated` descending (most recent first).

Clinics with the support clinic ID can view any applicant's applications regardless of the clinic that created them.

## Database

**Table:** `APPLICANT_SERVICE_DATABASE_NAME` (env var)

| Key | Type | Notes |
| --- | --- | --- |
| `pk` | String (partition key) | Applicant identifier |
| `sk` | String (sort key) | Record type discriminator |
| `passportId` | String | Composite of country code + passport number — used in GSI |

**Global Secondary Index:** `PASSPORT_ID_INDEX` — partition key: `passportId`

## Key Types

```typescript
type ApplicantHeader = {
  passportnumber: string;
  countryofissue: CountryCode;
};
```

Shared model: `pets-core-services/src/shared/models/applicant.ts`

## Tests

- Unit tests: `handlers/*.spec.ts`
- Fixtures: `fixtures/applicants.ts` — includes preloaded test applicants (e.g., passport `ABC1234JANE`, country `Barbados`)

## Dependencies

- **DynamoDB** — applicant table
- **Application service model** — fetches linked applications during search
- **Shared:** `logger`, `httpResponses`, `country`, `ApplicantDbOps`
