# Introduction

The local development environment is set up using AWS CDK and LocalStack to simulate AWS services locally. These allows us to test core services in an environemnt close to a real AWS account.

Also note that the local-dev-secret secret in AWS Secrets Manager has been updated with the client & tenant ID. Hence please pull the secrets before you start local-stack

Pull the secrets with the commands below:

```sh
pnpm pull:secrets
```

Verify `.env.local.secrets` has been created in `configs` directory. Double check this file is not committed.

For more details on setup and usage, refer to the [readme](../README.md).
