PETs Application Service

## Endpoints

| HTTP Method | endpoint path                        | Query Params | Headers | Path Params   | Body               |
| ----------- | ------------------------------------ | ------------ | ------- | ------------- | ------------------ |
| POST        | /application-details                 | -            | -       | -             | applicationDetails |
| GET         | /application-details/{applicationId} | -            | -       | applicationId | -                  |
| PUT         | /application-details/{applicationId} | -            | -       | applicationId | applicationDetails |

Body for any request can be found here: https://github.com/UKHSA-Internal/pre-entry-tb-screening-app/blob/main/core-services/application-service/src/models/IPetsApplication.ts
A field is mandatory wherever the type is just 'string' or ApplicationStatus, any other ones are optional (they still have to be present, but their value can be 'null')
The 'user roles' are defined here: https://confluence.collab.test-and-trace.nhs.uk/display/TPT/Identity+Architecture

## User roles

__R__  - Read All
__RC__ - Read Own Clinic Only
__W__  - Write All
__WC__ - Write Own Clinic Only
__WS__ - Write Status and Comments Only

| Method : endpoint                       | SystemAdmin | UkhsaDataAnalyst | ClinicAdmin | ClinicRadiologist | UkhsaRadiologist | ExternalQARadiologist | HeathrowDoctor | PanelPhysicians |
| --------------------------------------- | ----------- | ---------------- | ----------- | ----------------- | ---------------- | --------------------- | -------------- | --------------- |
| POST:application-details                | W           | -                | WC          | WC                | -                | -                     | -              | -               |
| GET:application-details/{applicatoinId} | R           | R                | RC          | RC                | R                | R                     | R              | R               |
| PUT:application-details/{applicationID} | W           | -                | WC          | WC                | WS               | WS                    | WS             | WS              |

_This is still work in progress._
