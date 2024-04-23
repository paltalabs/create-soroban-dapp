# Deploy your contracts using the provided script

Now that you have added your contract to the project, you can deploy the contract to the soroban testnet.

To do so you can use the script provided in the `contracts` folder: `deploy_on_testnet.sh`. You simply have to add your contract name as argument like this

```bash
# From the contracts folder run
./deploy_on_testnet.sh name_of_your_contract
```

The script also takes a list of contracts as arguments for deploying several contracts at once with the same identity. Simply use 
```bash
# Deploy several contracts like this
./deploy_on_testnet.sh contract_1 contract_2 contract_3
```

> Under the hood the script will 
>- Run `make` anyway to ensure that the contracts are up to date from your last modification
>- Add the testnet network configuration to soroban-cli
>- Create a random identity for the deployer of your contracts (*be aware that this will change every time you redeploy*)
>- Fund the deployer identity using Friendbot
>- Deploy the contracts on testnet
>- Add the contracts deployment infos in `deployments.json`