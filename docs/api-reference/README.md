# API Reference

The PETS backend exposes a REST API via **Amazon API Gateway**, backed by Lambda functions. All endpoints require a valid Azure B2C JWT token in the `Authorization: Bearer <token>` header.

> **Note:** The canonical API specification is generated at build time and stored in `pets-core-services/openapi-docs.json`. The content below describes the available endpoints based on the Lambda handlers in each service.

## Base URL

| Environment | Base URL |
| --- | --- |
| Local (LocalStack) | `http://localhost:4566/restapis/{API_GATEWAY_ID}/{API_GATEWAY_STAGE}/_user_request_` |
| Dev | Provided via deployment output |
| Test | Provided via deployment output |

Environment-specific API Gateway IDs and stage names are configured in the relevant `configs/.env.*` file.

## Authentication

All requests must include:

```text
Authorization: Bearer <Azure B2C JWT token>
```

The API Gateway TOKEN authoriser validates the JWT and extracts the `clinicId` claim. The `clinicId` is propagated to downstream Lambda handlers via `event.requestContext.authorizer.clinicId`.

---

## Applicant Service

### Search applicant

Looks up an applicant by passport number and country of issue. Returns the applicant details and all associated applications (most recent first).

**Headers:**

| Header | Type | Required | Description |
| --- | --- | --- | --- |
| `passportnumber` | string | Yes | The applicant's passport number |
| `countryofissue` | string (CountryCode) | Yes | ISO country code of the issuing country |

**Response `200 OK`:**

```json
{
  "applicantId": "string",
  "passportNumber": "string",
  "countryOfIssue": "string",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "string",
  "applications": [
    {
      "applicationId": "string",
      "clinicId": "string",
      "applicationStatusGroup": "string",
      "dateCreated": "string"
    }
  ]
}
```

Returns `{}` if no applicant is found.

### Create applicant

Creates a new applicant record.

**Request body:** Applicant personal details (passport number, country of issue, name, date of birth).

### Update applicant

Updates an existing applicant record.

**Request body:** Fields to update.

---

## Application Service

### Create application

Creates a new TB screening application for an applicant.

### Cancel application

Cancels an existing application.

### Get application

Returns a single application by ID.

### Get dashboard applications

Returns applications for the authenticated clinic, filterable by status group.

**Query parameters:**

| Parameter | Description |
| --- | --- |
| `statusGroup` | Filter by `applicationStatusGroup` value |

### Generate image upload URL

Returns a pre-signed S3 URL for uploading a chest X-ray image. The client uses this URL to `PUT` the image directly to S3.

### Save chest X-ray

Records chest X-ray metadata (filename, upload timestamp) after the image has been uploaded to S3.

### Save medical screening

Saves the medical screening section of the application.

### Save radiological outcome

Records the radiologist's outcome for the submitted chest X-ray.

### Save sputum decision / details

Records sputum test decision and details.

### Save TB certificate

Issues or records the TB clearance certificate.

### Save / update travel information

Saves or updates the applicant's travel information (destination country, travel dates, etc.).

---

## Clinic Service

### Create clinic

Creates a new clinic record.

### Fetch clinics

Returns a list of all clinics.

### Get clinic

Returns a single clinic by ID.

### Is active clinic

Returns whether a given clinic is currently active.

---

## Error Responses

All endpoints return standardised error responses:

| Status | Meaning |
| --- | --- |
| `400 Bad Request` | Invalid request body or missing required fields |
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | Valid token but insufficient permissions |
| `422 Unprocessable Entity` | Validation error |
| `500 Internal Server Error` | Unexpected server error |

Error response body:

```json
{
  "message": "Human-readable error description"
}
```

---

## Notes

- The DICOM service and EDAP integration service are **not** exposed via API Gateway — they are triggered by S3 events and DynamoDB Streams respectively.
- The Audit service is invoked internally by other services and is not directly callable via the API.
- For the full OpenAPI specification, build the project (`pnpm -r build`) and inspect `pets-core-services/openapi-docs.json`.
