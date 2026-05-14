# Localstack configuration (WIP)

You need to authenticate with GHCR. Create a GitHub Personal Access Token (classic) with `read:packages` scope at <https://github.com/settings/tokens>. The image is set to internal only access so everyone who is already in ukhsa-internal should be able to get into it with a personal token.

Apart from creating GitHub PAT, also run `docker login` like this:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

If SSO authorization is the issue — go to <https://github.com/settings/tokens>, find your token, click "Configure SSO" → "Authorize" next to ukhsa-internal, then re-login:

```sh
echo YOUR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Also, if running `pnpm test` gives errors related to docker, then run the above command.

If you keep your PAT and GH name in env vars, and you want to run back-end test, you can do it in one line,like this (considering you're in `pets-core-services` directory):

```sh
echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin && pnpm test
```

If you're on macOS (especially if the CPU architecture is *arm64*, the new M1, M2... processors), enabling *rosetta* emulator is required. There's also a setting in Rancher Desktop (container manager app, if you use it) to use Apple Virtualization framework, which enables *Rosetta* support.

More about it can be found here: <https://docs.github.com/en/packages/working-with-a-github-packages-registry/>
working-with-the-container-registry#authenticating-to-the-container-registry
