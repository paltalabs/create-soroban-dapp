#! /bin/bash

## THIS SCRIPT IS INTENDED TO BE USED AT ROOT FOLDER OF DAPP PROJECT

echo "Configuring soroban for testnet\n"
soroban config network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

echo "Configuring deployer identity\n"
soroban config identity generate deployer

echo "Deployer address is $(soroban config identity address deployer)\n"

echo "Funding deployer address with friendbot\n"
curl "https://friendbot.stellar.org/?addr=$(soroban config identity address deployer)"

echo "Deploying on testnet\n"
CONTRACT_ID="$(soroban contract deploy \
  --wasm "contract/target/wasm32-unknown-unknown/release/title_contract.wasm" \
  --source deployer \
  --network testnet)"

echo "Contract successfully deployed on testnet with contract id $CONTRACT_ID\n"

tmp=$(mktemp) 
jq ".testnet.title_id = \"$CONTRACT_ID\"" contract/contract_ids.json > "$tmp" && mv "$tmp" contract/contract_ids.json