# Getting Started

This guide takes you from a fresh machine to a running local PETS development environment.

## Prerequisites

Ensure the following are installed before continuing.

### Node 20

Install via [Volta](https://docs.volta.sh/guide/getting-started):

```sh
volta install node@20
```

Verify: `node -v` should return `v20.19.0`

### pnpm

```sh
npm install -g pnpm@9.15.4
```

### Docker

Docker is required to run LocalStack (the local AWS emulator). Choose one option:

- [Docker Desktop](https://docs.docker.com/engine/install/)
- [Rancher Desktop](https://rancherdesktop.io/) — if Docker Desktop is unavailable. After installing, apply [LocalStack-specific configuration](https://docs.localstack.cloud/user-guide/integrations/rancher-desktop/).

Verify: `docker -v`

### Git Secrets

Prevents accidental secret commits:

- **Linux:** `apt-get install git-secrets`
- **Mac:** `brew install git-secrets`
- **Windows:**
  1. Clone `https://github.com/awslabs/git-secrets.git` in Git Bash
  2. Open PowerShell as Administrator, navigate to the cloned folder
  3. Run `./install.ps1`

## Installation

```sh
# 1. Clone the repository
git clone git@github.com:UKHSA-Internal/pre-entry-tb-screening-app.git
cd pre-entry-tb-screening-app

# 2. Install all dependencies (frontend + backend)
pnpm i

# 3. Configure git-secrets
git secrets --install
git secrets --register-aws
```

Install the [recommended VS Code extensions](.vscode/extensions.json) for linting and formatting.

## GitHub Container Registry Authentication

LocalStack pulls a private Docker image from GHCR. You need a GitHub Personal Access Token (classic) with `read:packages` scope.

1. Create a PAT at <https://github.com/settings/tokens> (classic, `read:packages` scope)
2. If you are in the `ukhsa-internal` org, configure SSO: go to your token settings → **Configure SSO** → **Authorize** next to `ukhsa-internal`
3. Log in to GHCR:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Store your credentials in environment variables for convenience:

```sh
echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

> **macOS (Apple Silicon M1/M2+):** Enable Rosetta emulation in your container manager. See [Localstack_config.md](../Localstack_config.md) for details.

## Pulling Local Secrets

Required for running the backend (LocalStack) and E2E tests. Requires Administrator access to the `pre-entry-tb-screening-nl-develop` AWS account.

1. Go to [Halo](https://halopr.awsapps.com/start/#/?tab=accounts)
2. Select **Administrator Access Keys** for `pre-entry-tb-screening-nl-develop`
3. Copy the **Set AWS environment variables** commands (check the OS tab)
4. Run those commands in your shell
5. Pull the secrets:

```sh
pnpm pull:secrets
```

6. Verify that `configs/.env.local.secrets` was created — **do not commit this file**

## Starting the Development Environment

```sh
pnpm start
```

- Requires Docker to be running
- Takes ~45 seconds on first run
- Opens the React app at <http://localhost:3000/>

**UI only (no backend):** `pnpm start:ui`

## Running Tests

```sh
# All unit and integration tests
pnpm -r test

# Single package
pnpm --filter pets-core-services test
pnpm --filter pets-ui test

# E2E tests (requires running environment)
# See pets-ui/README.md for Cypress instructions
```

## Troubleshooting

See [docs/troubleshooting.md](docs/troubleshooting.md) for common issues and fixes.

## Next Steps

- Read [docs/backend-services/](docs/backend-services/) to understand the 7 backend services
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) before picking up your first ticket
- Browse the [monorepo structure](../README.md#monorepo-organization) in the main README
