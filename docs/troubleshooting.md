# Troubleshooting

Common issues and fixes for local development.

## Contents

- [Docker / LocalStack startup](#docker--localstack-startup)
- [GHCR authentication](#ghcr-authentication)
- [Port conflicts](#port-conflicts)
- [Test failures](#test-failures)
- [Lambda debugging](#lambda-debugging)
- [Secrets / environment variables](#secrets--environment-variables)
- [macOS Apple Silicon](#macos-apple-silicon)

---

## Docker / LocalStack startup

### `pnpm start` hangs or LocalStack never becomes ready

1. Ensure Docker is running: `docker ps`
2. Check LocalStack container logs:

```sh
pnpm watch:docker
```

   Or open Docker Desktop → Containers → select the LocalStack container → Logs.
3. Allow up to 60 seconds on first run — the image download can be slow.
4. If the container exited with an error, run `docker compose down` then `pnpm start` again.

### LocalStack container exits immediately

Check that you are authenticated with GHCR (see [GHCR authentication](#ghcr-authentication) below).

---

## GHCR authentication

### `pull access denied` or `unauthorized` when starting LocalStack

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

If you get a 401 after logging in, your PAT may need SSO authorisation:

1. Go to <https://github.com/settings/tokens>
2. Find your token → **Configure SSO** → **Authorize** next to `ukhsa-internal`
3. Re-run the `docker login` command above

---

## Port conflicts

### Port 3000 already in use (UI)

```sh
lsof -i :3000   # find the process
kill -9 <PID>
```

### LocalStack port conflicts (4566)

```sh
docker compose down   # stop all containers
pnpm start
```

---

## Test failures

### Tests fail with Docker-related errors

Ensure you are logged in to GHCR before running backend tests:

```sh
echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin && pnpm test
```

### Backend logs are missing in test output

Add the following line to `configs/.env.test.local` (do not commit):

```sh
LOG_LEVEL=info
```

### Integration tests fail with `connection refused`

Ensure the dev environment is running (`pnpm start`) before running integration or E2E tests.

### TypeScript errors in tests

Run `pnpm -r build` first to ensure shared types are compiled.

---

## Lambda debugging

### How to view Lambda logs locally

**Option 1 — Docker Desktop:**

- Open Docker Desktop → Containers → select the Lambda container → Logs tab

**Option 2 — CLI:**

```sh
pnpm watch:docker   # live tail of all container logs
```

**Option 3 — Lambda-specific:**

```sh
docker logs <container-name> --follow
# Container names follow the pattern: pets-{service-name}-lambda
```

### Lambda is not picking up my code changes

The local environment uses hot-reload via the `hot-reload` S3 bucket in LocalStack. If changes are not reflected:

1. Ensure `esbuild` is watching: check that `pnpm start` is still running
2. Force a restart: `docker compose restart`

---

## Secrets / environment variables

### `configs/.env.local.secrets` is missing

Run the secrets pull process from [docs/GETTING-STARTED.md](GETTING-STARTED.md#pulling-local-secrets).

### Environment variable not found at runtime

Check that the variable is defined in the correct file:

| Context | File |
|---|---|
| Local dev (backend) | `configs/.env` |
| Local dev (secrets) | `configs/.env.local.secrets` |
| Unit / integration tests | `configs/.env.test.local` |
| Dev deployment | `configs/.env.dev` |
| Test deployment | `configs/.env.test` |

---

## macOS Apple Silicon

### LocalStack fails to start on M1/M2/M3

Enable Rosetta emulation in your container manager:

- **Rancher Desktop:** Settings → Virtual Machine → Enable Rosetta support
- **Docker Desktop:** Settings → General → Use Rosetta for x86/AMD64 emulation

See [Localstack_config.md](../Localstack_config.md) for full details.

---

## Still stuck?

- Check existing GitHub issues in the repository
- Ask in the team Slack/Teams channel
- Review the service-level docs in [docs/backend-services/](backend-services/)
