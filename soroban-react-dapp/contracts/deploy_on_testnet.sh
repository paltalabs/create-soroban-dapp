#! /bin/bash
echo -e "\n\n"
echo "Using Makefile to build contracts wasm blobs"

echo -e "\n\n"

make

echo -e "\n\n"

echo "Configuring soroban for testnet\n"
soroban config network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

echo "Configuring deployer identity"
soroban config identity generate deployer

echo -e "\n\n"

echo "Deployer address is $(soroban config identity address deployer)"

echo -e "\n\n"

echo "Funding deployer address with friendbot"
curl "https://friendbot.stellar.org/?addr=$(soroban config identity address deployer)"

echo -e "\n\n"

echo "Deploying on testnet"
CONTRACT_ID="$(soroban contract deploy \
  --wasm "./$1/target/wasm32-unknown-unknown/release/$1.wasm" \
  --source deployer \
  --network testnet)"
echo "Contract successfully deployed on testnet with contract id $CONTRACT_ID"

echo -e "\n\n"

tmp=$(mktemp) 
if [[ $(jq ".testnet.$1" contracts_ids.json) ]]; then
    jq ".testnet.$1 = \"$CONTRACT_ID\"" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
else
    jq ".testnet += [{\"$1\":\"$CONTRACT_ID\"}]" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
fi

echo -e "Check the address of the deployed contracts in contracts_ids.json:\n`cat contracts_ids.json`"