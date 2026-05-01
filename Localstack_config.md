# Localstack configuration (WIP)

Check AWS CLI

```sh
aws --version
```

The `--wait` flag (in `docker compose up -d --wait`) requires Docker Compose v2.1.1+. If you're on an older version, this will fail.
_# Check Docker Compose version

```sh
docker compose version
```

Check if you are logged in using correct account:

```sh
aws sts get-caller-identity
```

You can log in:

```sh
aws sso login --profile <your-profile>
export AWS_PROFILE= <your-profile>
```

Or check which profile is active:

```sh
echo $AWS_PROFILE
aws configure list
```

Make sure you're logged in before running `pnpm start`

If you need to configure your profile, run:

```sh
aws configure
```

You need to authenticate with GHCR. Create a GitHub Personal Access Token (classic) with `read:packages` scope at https://github.com/settings/tokens, then run:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

If SSO authorization is the issue — go to https://github.com/settings/tokens, find your token, click "Configure SSO" → "Authorize" next to ukhsa-internal, then re-login:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```
