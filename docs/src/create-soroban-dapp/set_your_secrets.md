
# Set up your secrets!
When deploying our contracts, we will need to the secret key of the deployer account. This secret key will be in a ignored file in `./contracts/.env`.

To set up your secrets do
```bash
cp contracts/.env.example contracts/.env
```
If you are already inside the contracts folder (due to being inside the Docker Container), just do `cp .env.example .env`

And then edit the `.env` file, that will look like this:
```bash
# Stellar accounts Secret Keys
ADMIN_SECRET_KEY=

# RPC Setup
MAINNET_RPC_URL=
```
You can generate new Accounts and Private Keys from https://laboratory.stellar.org/#account-creator?network=test

If you plan to deploy in Mainnet, you will also need a Mainnet RPC Provider. Find one in https://app.validationcloud.io/ or in https://nownodes.io/ 