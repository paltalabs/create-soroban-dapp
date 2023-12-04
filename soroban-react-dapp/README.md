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

### Create your own contracts

