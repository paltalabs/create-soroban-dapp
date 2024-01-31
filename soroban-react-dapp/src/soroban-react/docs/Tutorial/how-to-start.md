# How to start

See the official gitbook: https://soroban-react.gitbook.io/index/
You can also contribute to the Gitbook by editing the docs folder in this repo
## Install:
Install all sub-packages with just `yarn`

## Format Code with Prettier

To format the code using Prettier, you can run the following script:

```
yarn prettier-format
```

This will
- Automatically search for all the TypeScript (.ts) and TypeScript JSX (.tsx) files under the `packages` folder and apply the formatting rules specified in the Prettier configuration `.prettierc`.
- Make sure to run this script before committing your changes to ensure consistent code formatting across the project.

## Generate Documentation

To generate the documentation for `@soroban-react`, run the following command:

```
yarn doc
```

This will
- The command will use Typedoc to analyze the `.tsx` files within the `packages` directory and generate Markdown documentation. 
- The generated documentation will be available in the `docs` directory as a `README.md` file. 
- Make sure to run this command whenever there are code changes or new packages added to keep the documentation up to date.


## Build and publish using lerna
Commit your changes with [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) with 
```
commit -m "feat(SUB_PACKAGE_NAME): change"
```
Then
```
yarn build
yarn lerna-publish
```
This will
- build the three projects in the right order
- determine the current version of the packages
- detect which packages have changed since the last publishing & then update its version in package.json accordingly
- create a commit of the changed package.json files, tag the commit and push the tag & commit to the remote
- publish the packages to NPM
- add commit changes in CHANGELOG

## Upgrade in your project:
```
yarn upgrade --latest --patern @soroban-react
```

## Implementations

Projects using `@soroban-react` include:

- [Stellar's Soroban Example Dapp](https://github.com/stellar/soroban-example-dapp)
- [@soroban-react example CRA](https://github.com/esteblock/soroban-react-example-cra)
- [Pet Adopt Soroban](https://github.com/esteblock/pet-adopt-soroban)

Open a PR to add your project to the list! If you're interested in contributing
.

## Analize, test and approve a PR
```
git remote add REMOTE_USERNAME http://github.com/REMOTE_USERNAME/soroban-react.git
git checkout -b REMOTE_USERNAME-name_of_pull_request main
git pull REMOTE_USERNAME-name_of_pull_request pull_request_branch

```

Step 2: Merge the changes and update on GitHub.

```
git checkout main
git merge --no-ff branch_name
git push origin main
```

## Publish one version for all

Sometimes you want all the packages to carry the same version.

```
yarn exec lerna version --force-publish 

yarn exec lerna publish from-package

```