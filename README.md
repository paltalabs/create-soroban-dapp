# @create-soroban-dapp

@create-soroban-dapp is both a npx script and a boilerplate dapp for kickstarting any of your ideas for a Soroban-based Dapp.

Largely inspired by the [ink!athon](https://github.com/scio-labs/inkathon) project by [Scio Labs](https://github.com/scio-labs) and by [@create-t3-app](https://github.com/t3-oss/create-t3-app) by [T3 Open Source](https://github.com/t3-oss) for the script mechanisms.

Check the [`LIVE VERSION`](https://create-soroban-dapp.vercel.app/) of the dapp utilizing already deployed testnet contract!

***Read the docs [here](https://create-soroban-dapp-docs.vercel.app/)***  📚📚

# Introduction

`@create-soroban-dapp` is composed of two things:

- A boilerplate dapp utilizing the [@soroban-react](https://github.com/paltalabs/soroban-react).

- A npx script allowing any developer to quickstart its project via the command line and `npx create-soroban-dapp`

# Usage:

Simply use

`npx create-soroban-dapp@latest`

or

`npm create soroban-dapp@latest`

Then, cd inside the new project repository.

# Troubleshooting

## If npm create script malfunctions

The script in its early stage is likely to not function perfectly on every different os and configuration. If the script happens to not function properly 'please report to @benjaminsalon' on the stellar developer discord channel.

## Manual cloning

It is also possible to use the dapp boilerplate via manually cloning the repo:

`git clone git@github.com:paltalabs/create-soroban-dapp.git`

The dapp will then not be in the root folder, this folder is occupied by the npx script. You will find the dapp in the sub folder 'soroban-react-dapp':

`cd soroban-react-dapp`

From there, it is a normal nextjs app:

`yarn` or `npm install` or `pnpm install`


# Get those containers up!

Make sure you have configured your .env file with the necessary variables. You can find an example in the .env.example file.

We will use docker-compose to get the containers up and running. This will rise a container for a local Stellar blockchain and another container with soroban-preview, which has all the necessary dependancies to deploy and interact with the contracts. Along with the dapp container that will run the front-end of the dapp.

```bash
# move to the right directory
cd soroban-react-dapp/

# Then, run the containers
docker compose up -d

# To get inside the soroban-preview container
bash run.sh 
# or 
# docker exec --tty --interactive soroban-contracts bash
```
Inside the container we can now compile the contracts, install the packages and deploy the contracts.

```bash
# move to the contracts folder
cd contracts
# build
make build

# Install dependencies and deploy the contract
yarn install
yarn deploy testnet greeting
```
Now we can run our frontend

```bash
# move to the parent folder
cd ..
# install the dependencies
yarn
# run the frontend in development mode
yarn dev

