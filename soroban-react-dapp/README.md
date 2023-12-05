# Welcome to your soroban react dapp boilerplate!

This dapp largely inspired by the [ink!athon](https://github.com/scio-labs/inkathon) project will help you kickstart your soroban dapp creator journey.

## Verify installation

To verify that everything is in order you can run

```bash
# If you use yarn
yarn dev

# If you use npm or pnpm
npm run dev
pnpm run dev
```

This will start the development server. The dapp will be available on localhost. 

The dapp should display the current greeting set in the testnet smart contract. 

`Check if you can change it by sending a new greeting!` 

> You may need some tokens from the faucet to interact with the testnet.
> You can fund your wallet address with the testnet friendbot at
> https://friendbot.stellar.org/?addr=YOUR_ADDRESS_HERE


## Getting started

To start the customization of the dapp you can follow these lines:

### Customize app data

You can start by modifying the TODOs with your own data (None of them is mandatory to change):
- Name of the package in [package.json](package.json).
- All the dapp info in [_app.tsx](src/pages/_app.tsx).
- Manifest and favicon in [_document.tsx](src/pages/_document.tsx).

### Create and build your own contracts

The contracts workflow happens in the `contracts/` folder. Here you can see that the greeting contract is present already.

Every new contract should be in its own folder, and the folder should be named the same name as the name of the contract in its `cargo.toml` file. You can check how the `tweaked_greeting` contract is changed from the `greeting` contract and you can also start from this to build your own contract.

To build the contracts you can simply invoke the `make` command which will recursively build all contracts by propagating the `make` command to subfolders. Each contract needs to have its own `Makefile` for this to work. The `Makefile` from the greeting contract is a generic one and can be copied and paste to use with any of your new contract.

If you are not familiar or comfortable with Makefiles you can simply go in the directory of the contract you want to compile and run 

```bash
# This will create the target wasm blob under target/wasm32-unknown-unknown/release/contract_name.wasm
cargo build --target wasm32-unknown-unknown --release
```

> If it's your first time manipulating soroban contracts you might need to add the `wasm32-unknown-unknown` target to rust. For this run `rustup target add wasm32-unknown-unknown`. Follow instructions online if not working ("add target wasm32-unknown-unknown to rust").

### Deploy your contracts on tesnet

Now that you have added your contract to the project, you can deploy the contract to the soroban testnet.

To do so you can use the script provided in the `contracts` folder: `deploy_on_testnet.sh`. You simply have to add your contract name as argument like this

```bash
# From the contracts folder run
./deploy_on_testnet.sh name_of_your_contract
```

The script also takes a list of contracts as arguments for deploying several contracts at once with the same identity. Simply use 
```bash
# Deploy several contracts like this
./deploy_on_testnet.sh contract_1 ontract_2 contract_3
```

The script will 
- Run `make` anyway to ensure that the contracts are up to date from your last modification
- Add the testnet network configuration to soroban-cli
- Create a random identity for the deployer of your contracts (BE AWARE THAT THIS WILL CHANGE EVERY TIME YOU REDEPLOY)
- Fund the deployer identity using Friendbot
- Deploy the contracts on testnet
- Add the contracts addresses in `contracts_ids.json` under `testnet.name_of_your_contract`

### Change the contract you are interacting with in the frontend code.

In the file [GreeterContractInteraction.tsx](src/components/web3/GreeterContractInteractions.tsx), change the two references to `"greeting"` in `updateGreeting` at line 105 and in `fetchGreeting` at line 55.

You then need to adapt the `contractInvoke()` calls in these functions to match the structure of your contract, by setting the right `method` name and the right `args` list.

Finally feel, of course, free to change the front-end how you wish, to match your desired functionalities.

*Good luck building!*