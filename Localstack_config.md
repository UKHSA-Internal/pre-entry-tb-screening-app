# Localstack configuration (WIP)

You need to authenticate with GHCR. Create a GitHub Personal Access Token (classic) with `read:packages` scope at https://github.com/settings/tokens. The image is set to internal only access so everyone who is already in ukhsa-internal should be able to get into it with a personal token. Then run:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

If SSO authorization is the issue — go to https://github.com/settings/tokens, find your token, click "Configure SSO" → "Authorize" next to ukhsa-internal, then re-login:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

More about it can be found here: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry
