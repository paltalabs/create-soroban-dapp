# Deploy your contracts using the provided script

Now that you have added your contract to the project, you can deploy the contract to any network of your choice.

## Add a deployer secret key in the .env file

First thing you need to do is to copy paste the `.env.example` file to create a `.env` file which will be used to retrieve the deployer secret key by the script. Just add any valid secret key to the `.env` file under the field `ADMIN_SECRET_KEY`.

## Run the contract 

Then we can use the script provided in the `contracts` folder: `scripts/deploy.ts`. The script is using [stellar-js](https://stellar.github.io/js-stellar-sdk/) under the hood. 

The contracts folder is a typescript package itself which needs to have its dependencies installed:

```bash
# From the contracts folder run
yarn
#
npm -i
#
pnpm -i
```

The script can then be called using yarn (or any package manager)

```bash
yarn deploy network_name contract_name_1 contract_name_2 ...
```

Replacing `network_name` by one of `testnet|futurenet|standalone|mainnet` and adding all the contracts name you want to deploy as next arguments.

For instance if I want to deploy the greeting contract on testnet I will run:

```bash
yarn deploy testnet greeting
```

> Under the hood the script will 
>- Load the pair provided in the .env for the deployer identity
>- Fund the deployer identity using Friendbot
>- Deploy the contracts on testnet
>- Add the contracts deployment infos in `deployments.json`