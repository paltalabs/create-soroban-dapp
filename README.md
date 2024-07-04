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


## Using quickstart!
This will launch a Stellar node, when using standalone it will create a Stellar blockchain locally. Also, it will run a container with all the necessary dependancies to deploy and interact with the contracts. Along with the dapp container that will run the front-end of the dapp.

First configure the `ADMIN_SECRET_KEY` and `MAINNET_RPC_URL` in the `contracts/.env` file. You can use the `contracts/.env.example` file as a template. 

Second, move to `soroban-react-dapp`
    
    ```bash
    cd soroban-react-dapp
    ```
    

Then, run the following command to start the dapp and the soroban node:
```bash
bash quickstart.sh <network>
```
you will typically use this with standalone:
```bash
bash quickstart.sh standalone
```
then open a new terminal, and run the following command to start the dapp:
```bash
bash run.sh
```
Then, compile contracts:
```bash
cd contracts
make
```
Then, install packages
```bash
yarn
```
Then, deploy contracts (in this example we will deploy the greeting contract):
```bash
yarn deploy testnet greeting
```

and run the dapp locally in development mode
```bash
cd .. # Move to the parent folder
yarn dev
```

