# Set up your secrets!

When deploying our contracts, you will need the secret key of the deployer account. This secret key will be stored in an ignored file located at `./contracts/.env`.

To set up your secrets, first copy the example environment file:

```bash
cp contracts/.env.example contracts/.env
```

If you are already inside the contracts folder (such as when using a Docker container), simply use:

`cp .env.example .env`

Next, edit the `.env` file and add your secret keys. The file will look like this:

```bash
# Stellar accounts Secret Keys
ADMIN_SECRET_KEY=

# RPC Setup
MAINNET_RPC_URL=
```

You can generate new Accounts and Private Keys from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

If you plan to deploy on the Mainnet, you will also need a Mainnet RPC Provider. Find one in [Validation Cloud](https://app.validationcloud.io/) or [Nownodes](https://nownodes.io/)
