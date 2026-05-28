# Authoriser

Azure Active Directory B2C JWT authoriser for API Gateway. Validates incoming requests and extracts clinic identity for use by downstream Lambda handlers.

## Responsibilities

- Validating the Azure B2C JWT token on every API Gateway request
- Extracting the `clinicId` and any other authoriser context from the token
- Returning an IAM policy (allow/deny) to API Gateway

## Source Location

`pets-core-services/src/authoriser/`

## Lambda Entry Point

`authoriser/b2c-authoriser.ts`

## How It Works

API Gateway invokes this Lambda as a **TOKEN authoriser** before the request reaches any service Lambda. The authoriser:

1. Receives the `Authorization: Bearer <token>` header
2. Validates the JWT signature and claims against Azure B2C
3. Extracts the `clinicId` claim and other context
4. Returns an IAM `Allow` policy (and the extracted context) on success, or `Deny`/`Unauthorized` on failure

The extracted context (e.g., `clinicId`) is available to downstream Lambdas via `event.requestContext.authorizer`.

## Key Files

| File | Purpose |
| --- | --- |
| `b2c-authoriser.ts` | Lambda handler — JWT validation and policy generation |
| `b2c-authoriser.spec.ts` | Unit tests |
| `constants.ts` | B2C endpoint URLs and claim names |

## Configuration

| Environment variable | Description |
| --- | --- |
| `B2C_TENANT_ID` | Azure AD B2C tenant ID |
| `B2C_CLIENT_ID` | Application (client) ID registered in Azure AD B2C |
| `B2C_POLICY_NAME` | The B2C user flow / policy name |

These values are stored in AWS Secrets Manager and pulled via `pnpm pull:secrets`.

## Tests

Unit tests: `b2c-authoriser.spec.ts`

## Dependencies

- **Azure AD B2C** — identity provider for JWT validation
- **API Gateway** — invokes this Lambda as a TOKEN authoriser
