# Architecture

## System Overview

PETS (Pre-Entry TB Screening) is a serverless application built on AWS. The frontend is a React SPA served via a CDN. The backend consists of Lambda functions behind an API Gateway, with DynamoDB for storage, S3 for images, and SQS for async integration with the external data analytics platform (EDAP).

For the full architecture diagram, see [docs/architecture.pdf](../architecture.pdf).

## Components

```text
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React SPA)                                            │
│  - Vite + React + TypeScript                                    │
│  - Redux for state management                                   │
│  - GDS (govuk-frontend) styling                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Amazon API Gateway (REST)                                      │
│  - OpenAPI spec-driven routing                                  │
│  - TOKEN authoriser Lambda (Azure B2C JWT validation)           │
└──────────┬──────────────────────────────────────────────────────┘
           │ Invokes
           ▼
┌──────────────────────────────────────────────────────────────────┐
│  Lambda Functions                                                │
│                                                                  │
│  ┌──────────────────┐  ┌───────────────────┐  ┌───────────────┐  │
│  │ applicant-service│  │application-service│  │ clinic-service│  │
│  └────────┬─────────┘  └───────┬───────────┘  └──────┬────────┘  │
│           │                    │                     │           │
│  ┌────────▼────────────────────▼─────────────────────▼──────┐    │
│  │                  Amazon DynamoDB                         │    │
│  │  applicant-table  │  application-table  │  clinic-table  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │  dicom-service  │◄── S3 event (image upload)                  │
│  └────────┬────────┘                                             │
│           │ Scans image                                          │
│  ┌────────▼────────┐                                             │
│  │  Amazon S3      │  (IMAGE_BUCKET — chest X-ray images)        │
│  └─────────────────┘                                             │
│                                                                  │
│  ┌──────────────────────────┐                                    │
│  │  edap-integration-service│◄── DynamoDB Streams                │
│  └────────────┬─────────────┘                                    │
│               │                                                  │
│  ┌────────────▼─────────────┐                                    │
│  │  Amazon SQS              │  (EDAP integration queue + DLQ)    │
│  └──────────────────────────┘                                    │
│                                                                  │
│  ┌─────────────────┐                                             │
│  │  audit-service  │◄── Called by other services                 │
│  └────────┬────────┘                                             │
│           │                                                      │
│  ┌────────▼────────┐                                             │
│  │  DynamoDB       │  (audit-table)                              │
│  └─────────────────┘                                             │
└──────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│  EDAP (External Data Analytics Platform)                        │
│  - Consumes records from SQS queue                              │
└─────────────────────────────────────────────────────────────────┘
```

## Service Responsibilities

| Service | Trigger | Storage |
| --- | --- | --- |
| applicant-service | API Gateway (HTTP) | applicant-table |
| application-service | API Gateway (HTTP) | application-table, S3 |
| clinic-service | API Gateway (HTTP) | clinic-table |
| dicom-service | S3 event | S3, application-table |
| audit-service | Internal (service calls) | audit-table |
| edap-integration-service | DynamoDB Streams | SQS |
| authoriser | API Gateway TOKEN auth | — |

## Authentication Flow

```text
Browser → API Gateway → Authoriser Lambda (validates Azure B2C JWT)
                ↓ (on success: passes clinicId in requestContext)
         Service Lambda → processes request using clinicId
```

## Local Development

Local development uses [LocalStack](https://localstack.cloud/) to emulate AWS services (API Gateway, Lambda, DynamoDB, S3, SQS) inside Docker. The local infrastructure is defined in `pets-local-infra/lib/local-infra-stack.ts` using AWS CDK.

Lambda hot-reload is enabled locally via a `hot-reload` S3 bucket — code changes are picked up without restarting containers.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Redux, govuk-frontend |
| Backend | Node.js 20, TypeScript, AWS Lambda, Middy |
| Infrastructure | AWS CDK (local), GitHub Actions (deployment) |
| Database | Amazon DynamoDB |
| Storage | Amazon S3 |
| Messaging | Amazon SQS |
| Authentication | Azure Active Directory B2C |
| Local emulation | LocalStack |
| Testing | Vitest (unit/integration), Cypress (E2E) |

## Key Design Decisions

- **Serverless:** Lambda functions scale automatically and eliminate server management
- **Single-table design per service:** Each service owns its DynamoDB table, keeping services independent
- **Middy middleware:** Shared cross-cutting concerns (auth context, logging, validation) are applied as middleware rather than duplicated across handlers
- **OpenAPI-driven API Gateway:** The API spec is generated from code and used to configure API Gateway, keeping the spec and implementation in sync
- **DynamoDB Streams for EDAP:** Decouples the core application from the analytics platform — data is streamed asynchronously without blocking user-facing operations
