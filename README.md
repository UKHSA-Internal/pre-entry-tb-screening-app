# pre-entry-tb-screening-app

## `git-secrets` setup

`git-secrets` will scan your commits to help prevent adding secrets to git repos. Full documentation & installation guide is available at https://github.com/awslabs/git-secrets

### Quick install guide on Windows:
- clone the https://github.com/awslabs/git-secrets repo
- open a terminal, cd into the git-secrets repo & run `.\install.ps1`
- restart vscode
- cd into this repo and run:
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
- cd to the top level
- run `yarn run security-checks`
- note that by default all files returned by `git ls-files` are scanned. This DOES NOT include untracked files.