# Paltalabs Challenge

## Getting Started

Clone the repository and run the following commands:

```bash
cd paltalabs-challenge
docker-compose up -d
bash run.sh
yarn
cd contracts
make build
yarn
```

Then copy the `.env.example` file to `.env` and fill in the necessary information.

Now you can run the following command to deploy the contract:

```bash
yarn deploy testnet greeting
```

Also you can run the following command to run the tests:

```bash
yarn test testnet greeting
```

Finally you can run the following command to run the dev client:

```bash
yarn dev
```

## Assumptions

- Authorized users can only be added through the .env file
- Users can only be authorized but not deauthorized
