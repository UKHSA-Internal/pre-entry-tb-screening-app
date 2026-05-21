# Contributing to PETS

## Table of Contents

- [Branching & Commits](#branching--commits)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)

## Branching & Commits

**Branch naming:** `feature/{ticket-number}-{concise-description}`

```sh
# Example
git checkout -b feature/TBBETA-123-add-clinic-filter
```

**Commit messages:** `{ticket-number} {commit_message}`

```sh
# Example
git commit -m "TBBETA-123 add clinic filter to dashboard query"
```

- Commit regularly with meaningful messages
- Ensure your commit email is your UKHSA email — see [this guide](https://stackoverflow.com/a/51682403) if needed

## Code Standards

### TypeScript

- All new code must be in TypeScript with proper typing — avoid `any`
- Use the existing shared types in `pets-core-services/src/shared/types/`
- Backend handlers should follow the pattern in existing handlers (e.g., `searchApplicant.ts`)

### Linting & Formatting

The project uses ESLint and Prettier. Run before committing:

```sh
pnpm lint
```

VS Code will apply formatting on save if you install the [recommended extensions](.vscode/extensions.json).

**End of line:** Must be `lf` (Unix-style). Configure once:

```sh
git config --global core.autocrlf input
```

In VS Code settings: set `Prettier: End Of Line` → `lf` and `Files: Eol` → `\n`.

### Security

- Never commit secrets, keys, or tokens — `git-secrets` hooks will catch AWS patterns
- Never import from or export to `.env.local.secrets`
- All Lambda handlers must validate input at the boundary (see existing handlers for examples)

## Testing Requirements

Every change must include appropriate tests:

| Change type | Required |
|---|---|
| New Lambda handler | Unit tests in `handlers/*.spec.ts` |
| New shared utility | Unit tests alongside the file |
| API behaviour change | Integration test in `pets-ui/test/*.intTest.{ts,tsx}` |
| UI feature | Integration test + Cypress E2E where applicable |

**Running tests:**

```sh
# All packages
pnpm -r test

# Single package
cd pets-core-services && pnpm test
cd pets-ui && pnpm test
```

Target: maintain or improve existing coverage. Do not submit PRs that reduce coverage without justification.

## Pull Request Process

1. Open a PR against `main` using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)
2. Ensure CI passes (lint, type-check, unit tests, integration tests)
3. Request at least one reviewer
4. Address all review comments before merging
5. Squash-merge is preferred for feature branches

Tickets and user stories follow the [template](docs/user-story-template.md).

## Documentation

- If you add a new Lambda handler, update [docs/backend-services](docs/backend-services/) for that service
- If you add or change an API endpoint, update [docs/api-reference/README.md](docs/api-reference/README.md)
- If you add or change a DynamoDB table or index, update [docs/database/schema.md](docs/database/schema.md)
- For significant architectural changes, update [docs/architecture/README.md](docs/architecture/README.md)
