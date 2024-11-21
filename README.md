# pre-entry-tb-screening-app

## `git-secrets` setup

`git-secrets` will scan your commits to help prevent adding secrets to git repos. Full documentation & installation guide is available at https://github.com/awslabs/git-secrets

### Quick install guide on Windows:
- clone the https://github.com/awslabs/git-secrets repo
- open a terminal, cd into the git-secrets repo & run `.\install.ps1`
- restart vscode
- run the following in the root folder of this repo:
	- `git secrets --install`
	- `git secrets --register-aws`
- to test that git-secrets is working:
	- create a new test branch by running:
    	- `git checkout main`
    	- `git branch git-secrets-test`
    	- `git checkout git-secrets-test`
	- create a file named test.txt with the following contents: ACCESS_KEY_ID="****IOSFODNN7ABCDPLE", replacing the asterisks with "AKIA" to mimic an AWS Access Key
	- attempt to commit this change:
    	- you should receive the following error: "[ERROR] Matched one or more prohibited patterns", and the commit should fail
	- change the file contents to ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
	- attempt to commit this change:
    	- this should succeed since this is an allowed pattern

### To scan the repo for secrets:
- run the following in the root folder of this repo: `yarn run security-checks`
- note that by default all files returned by `git ls-files` are scanned. This DOES NOT include untracked files.

## Java setup using Jabba

### Initial setup
- install jabba for your OS following instructions at https://github.com/shyiko/jabba?tab=readme-ov-file#installation
- in a new terminal run `jabba --version` to check that jabba is installed correctly
- run `jabba use openjdk@1.11.0` to set the version of java

### Configure terminal to set java version on startup
- open your terminal's configuration file:
  - for bash, this is `~.bashrc`
  - for zsh, this is `~.zshrc`
  - for powershell, the filepath is returned by running `$PROFILE`
- add the following to your terminal's configuration file: `jabba use openjdk@1.11.0`
- run `java --version` in a brand new terminal - this should return `openjdk@1.11.0`

## Automated dependency updates

### Renovate
- The `renovate.yaml` workflow will run at 25 minutes past the hour every 5 hours.
- PRs for dependencies requiring updates will be opened by the workflow.