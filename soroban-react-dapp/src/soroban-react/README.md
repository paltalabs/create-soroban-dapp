# @soroban-react

@soroban-react is a simple, powerful framework for building modern Soroban dApps using React!!!!!!!!

Library created based on [the code](https://github.com/stellar/soroban-example-dapp/tree/cb63b93b0eb79a797cd497942816379f7a3792ef/wallet) written by https://github.com/paulbellamy.

## Packages

| Package                                                    | Version                                                                                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@soroban-react/chains`](packages/chains)                 | [![npm version](https://img.shields.io/npm/v/@soroban-react/chains/latest.svg)](https://www.npmjs.com/package/@soroban-react/chains/v/latest)                 |
| [`@soroban-react/connect-button`](packages/connect-button) | [![npm version](https://img.shields.io/npm/v/@soroban-react/connect-button/latest.svg)](https://www.npmjs.com/package/@soroban-react/connect-button/v/latest) |
| [`@soroban-react/contracts`](packages/contracts)           | [![npm version](https://img.shields.io/npm/v/@soroban-react/contracts/latest.svg)](https://www.npmjs.com/package/@soroban-react/contracts/v/latest)           |
| [`@soroban-react/core`](packages/core)                     | [![npm version](https://img.shields.io/npm/v/@soroban-react/core/latest.svg)](https://www.npmjs.com/package/@soroban-react/core/v/latest)                     |
| [`@soroban-react/freighter`](packages/core)                | [![npm version](https://img.shields.io/npm/v/@soroban-react/freighter/latest.svg)](https://www.npmjs.com/package/@soroban-react/freighter/v/latest)           |
| [`@soroban-react/types`](packages/types)                   | [![npm version](https://img.shields.io/npm/v/@soroban-react/types/latest.svg)](https://www.npmjs.com/package/@soroban-react/types/v/latest)                   |
| [`@soroban-react/utils`](packages/utils)                   | [![npm version](https://img.shields.io/npm/v/@soroban-react/utils/latest.svg)](https://www.npmjs.com/package/@soroban-react/utils/v/latest)                   |
| [`@soroban-react/wallet-data`](packages/wallet-data)       | [![npm version](https://img.shields.io/npm/v/@soroban-react/wallet-data/latest.svg)](https://www.npmjs.com/package/@soroban-react/wallet-data/v/latest)       |
| [`@soroban-react/events`](packages/events)                 | [![npm version](https://img.shields.io/npm/v/@soroban-react/events/latest.svg)](https://www.npmjs.com/package/@soroban-react/events/v/latest)                 |

Currently, @soroban-react it's supporting [soroban-client](https://www.npmjs.com/package/soroban-client) v0.7.0, hence it's supporting [PREVIEW 9](https://soroban.stellar.org/docs/reference/releases)

# Introduction

`@soroban-react` is a simple, powerful framework for building modern Soroban dApps using React. Its marquee features are:

- Full support for [Freighter](https://github.com/stellar/freighter)

- A dev-friendly context containing the current account and chain, and more, available globally throughout your dApp via a [React Context](https://reactjs.org/docs/context.html).

- The ability to write custom, fully featured _Connectors_ that manage every aspect of your dApp's connectivity with the Soroban blockchain and user accounts.

# Usage:

See the official gitbook: https://soroban-react.gitbook.io/index/
You can also contribute to the Gitbook by editing the docs folder in this repo

## Install:

Install all sub-packages with just `yarn`

## Run tests

Currently tests are only working when installing with `npm i`. [Why?](https://github.com/esteblock/soroban-react/issues/39)
Currently tests are supporting the `chains`, `core`, `events` & `contracts` packages

```
rm -R node_modules
npm i
npm run test
```

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

First, be sure to be logged in with an authorized npmjs account for publishing, you can verify this with

```
npm whoami
```

If you are not logged in you have to login before continuing, using

```
npm login
```

Then, commit your changes with [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) with

```
commit -m "feat(SUB_PACKAGE_NAME): change"
```

And finally

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

If you forgot to login and `lerna-publish` stopped early, the risk is that it will consider that packages are published even if they are not really and not be able to finish to publish them. If this is the case, discard the possible uncommitted changes made by `lerna-publish` and run

```
yarn run lerna publish --no-private --conventional-commits from-git
```

This should save it.

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
