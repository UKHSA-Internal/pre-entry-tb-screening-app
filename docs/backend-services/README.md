# Backend Services

Documentation for each of the 7 Lambda-backed services in `pets-core-services/src/`.

## Services

| Service | Responsibility | Lambda entry point |
| --- | --- | --- |
| [applicant-service](applicant-service/README.md) | Applicant records (personal details, passport data) | `applicant-service/lambdas/applicants.ts` |
| [application-service](application-service/README.md) | TB screening application lifecycle | `application-service/lambdas/application.ts` |
| [clinic-service](clinic-service/README.md) | Clinic registry and lookup | `clinic-service/lambdas/clinics.ts` |
| [dicom-service](dicom-service/README.md) | Chest X-ray image malware scanning | `dicom-service/lambdas/` |
| [audit-service](audit-service/README.md) | Audit event recording | `audit-service/lambdas/audit.ts` |
| [edap-integration-service](edap-integration-service/README.md) | DynamoDB stream processing and EDAP export | `edap-integration-service/lambdas/edap-integration.ts` |
| [authoriser](authoriser/README.md) | Azure B2C JWT validation for API Gateway | `authoriser/b2c-authoriser.ts` |

## Shared Code

All services share utilities in `pets-core-services/src/shared/`:

| Module | Purpose |
| --- | --- |
| `config.ts` | Environment variable loading and validation |
| `logger.ts` | Structured logging via `pino-lambda` |
| `http.ts` | HTTP utility functions |
| `httpResponses.ts` | Standardised success and error response builders |
| `country.ts` | Country code constants and validation |
| `date.ts` | Date parsing and formatting utilities |
| `models/applicant.ts` | Applicant DynamoDB model and operations |
| `models/application.ts` | Application DynamoDB model and operations |
| `clients/aws.ts` | Pre-configured AWS SDK clients |
| `middlewares/` | Shared Middy middleware (auth extraction, validation) |
| `types/` | Shared TypeScript types (e.g., `PetsAPIGatewayProxyEvent`) |

## Middleware Pattern

All Lambda handlers use [Middy](https://middy.js.org/) for middleware. Each service Lambda entry point wraps handlers with middleware for:

- Request parsing and header extraction
- JWT authoriser context propagation
- Structured logging correlation
- Error normalisation

See `middy-router.d.ts` for the router type definitions.
