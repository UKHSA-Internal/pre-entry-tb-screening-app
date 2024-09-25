# PETs Clinic Service

## Introduction

The pets clinics microservice contains some reference data to be used for Pre Entry TB Screening

## Dependencies

The project runs on node >18.x with typescript and serverless framework. For further details about project dependencies, please refer to the `package.json` file.
[nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) is used to managed node versions and configuration explicitly done per project using an `.npmrc` file.

### Prerequisites

This project requires a Java Virtual Machine to run the Dynamo DB locally.
We recommend to use Jabba to manage Java versions (this is similar to NVM). 

- You can install jabba with Homebrew   
`brew install jabba`

- Install Java 18 with Jabba   
`jabba install openjdk@1.11.0`

- Set current java version to use installed jdk   
`jabba use openjdk@1.11.0`

<br>

> You might need to set $JAVA_HOME manually in your default rc file (.bashrc, .zshrc e.t.c) by adding this to the bottom of your
```
#set java home to jabba java jdk
export JAVA_HOME="/Users/oluwatomide.fasugba/.jabba/jdk/openjdk@1.11.0/Contents/Home/bin/java"
```

## Architecture
(Attach architecture diagram)
Please refer to the the [docs](./docs/README.md) for the API specification and samples of postman requests.

### End to end design

[All in one view](https://confluence.collab.test-and-trace.nhs.uk/display/TPT/High+Level+Technical+Architecture)

## Getting started

Set up your nodejs environment running `nvm use` and once the dependencies are installed using `yarn install`, you can run the scripts from `package.json` to build your project.
This code repository uses [serverless framework](https://www.serverless.com/framework/docs/) to mock AWS capabilities for local development.
You will also require to install dynamodb serverless to run your project with by running the following command `yarn run tools-setup` in your preferred shell.
Please refer to the local development section to [configure your project locally](#developing-locally).

### Environmental variables

- The `BRANCH` environment variable indicates in which environment is this application running. Use `BRANCH=local` for local development. This variable is required when starting the application or running tests.

> If branch is not one of local/local-global, the service would treat it as a remote i.e cloud rather than local development and this ultimately determines what Dynamo DB to connection to intitate.

### Scripts

The following scripts are available, however you can refer to the `package.json` to see the details:

- download local Dynamo DB: `yarn run tools-setup`
- on Windows use `yarn run start` to start the service
- on macOS/Linux use `yarn run start-m` to start the service
- unit tests: `yarn run test`

### DynamoDB and seeding

You won't need to change the configuration.
However, if you want the database to be populated with mock data on start, in your `serverless.yml` file, you need to set `seed` to `true`. You can find this setting under `custom > serverless-dynamodb > start`.

If you choose to run the DynamoDB instance separately, you can send the seed command with the following command:

`sls dynamodb seed --seed=pets-clinics`

Under `custom > dynamodb > seed` you can define new seed operations with the following config:

```yml
custom:
  serverless-dynamodb:
    seed:
      [SEED NAME HERE]:
        sources:
          - table: [TABLE TO SEED]
            sources: [./path/to/resource.json]
```

### Developing locally

Default DynamoDB configuration for seeding the data:

```yml
migrate: true
seed: true
noStart: false
```

### Debugging

The following environmental variables can be given to your serverless scripts to trace and debug your service:

```shell
AWS_XRAY_CONTEXT_MISSING = LOG_ERROR
SLS_DEBUG = *
BRANCH = local
```

_GET_ operations are exposed to the pets-ui app via API Gateway.

**In AWS:**  
https://api.gateway.uri/develop/clinics/P12345

**Locally:**  
http://localhost:3004/clinics/1

_UPSERT_ operations are via direct lambda invocation with an EventBridgeEvent object.

```
{
  "version":"0",
  "id":"4add813d-7u4c-0c30-72f9-9657de987d31",
  "detail-type":"UKHSA Update Pets Clinics",
  "source":"ukhsa.update.pets.clinics",
  "account":"1234567890",
  "time":"2022-01-26T12:18:26Z",
  "region":"eu-west-2",
  "resources":[],
  "detail":{
    "petsClinicId": "1"
    ...
  }
}
```

**In AWS:**  
Either via direct lambda invocation via the AWS CLI or the Lambda Test Event feature in the AWS Console.

**Locally:**  
Upsert operations can be achieved locally via a POST to http://localhost:3004/{apiVersion}/functions/ukhsa-pets-clinic-service-dev-getPetsClinics/invocations.

*The pets clinic will either be inserted or updated based on the absence or presense of a clinic with the same petsClinicContactNumber1. [tbc]*

## Testing

Jest is used for unit testing.
Please refer to the [Jest documentation](https://jestjs.io/docs/en/getting-started) for further details.

### Unit test

In order to test, you need to run the following:

```sh
yarn run test # unit tests
```

### Integration test

In order to test, you need to run the following, with the service running locally:

```sh
yarn run test-i # for integration tests [not yet implemented]
```

## Infrastructure

For the CI/CD and automation please refer to the following pages for further details:

- [Development process](https://confluence.collab.test-and-trace.nhs.uk/display/TPT/Technical+Documentation)
- [Pipeline](https://confluence.collab.test-and-trace.nhs.uk/pages/viewpage.action?pageId=374193469)

## Contributing
> ***Yet to be implemented***

Please familiarise yourself with [commitlint](https://commitlint.js.org/#/) and [conventional commits conventions](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) as a hook is in place to enforce standards.

The project follows a 2 week Sprint cadence [sprint board](https://jira.collab.test-and-trace.nhs.uk/secure/RapidBoard.jspa?projectKey=TBBETA&rapidView=3226).

### Code standards

The codebase uses [typescript clean code standards](https://github.com/labs42io/clean-code-typescript) as well as sonarcloud for static analysis.

## Swagger Docs

After starting the service, go to http://localhost:3004/dev/swagger to view the Swagger Docs. These docs will be automatically updated after changes to endpoints.

## Importing into Postman

After starting the service, open Postman, click 'Import' in the top left and enter http://localhost:3004/dev/swagger.json into the popup to import all APIs into Postman as a collection.

### Deployment with Serverless [Not Recommended -  should be via pipeline]

Install dependencies with:

```
yarn install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "aws-node-express-dynamodb-api" to stage "dev" (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-dev (109s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-dev-api (3.8 MB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.
