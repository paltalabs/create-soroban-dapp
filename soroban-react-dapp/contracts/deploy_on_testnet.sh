#! /bin/bash
echo -e "\n\n"
echo "Using Makefile to build contracts wasm blobs"

echo -e "\n\n"

make > /dev/null

echo -e "\n\n"

echo "Configuring soroban for testnet\n"
soroban config network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

echo "Configuring deployer identity"
soroban config identity generate deployer \
    --rpc-url https://soroban-testnet.stellar.org:443 \
    --network-passphrase "Test SDF Network ; September 2015" \
    --network "testnet"


echo -e "\n\n"

echo "Deployer address is $(soroban config identity address deployer)"

echo -e "\n\n"

echo "Funding deployer address with friendbot"
curl "https://friendbot.stellar.org/?addr=$(soroban config identity address deployer)" > /dev/null

echo -e "\n\n"

for contract_name in $@
do
    echo "Deploying $contract_name on testnet"
    CONTRACT_ID="$(soroban contract deploy \
    --wasm "./$contract_name/target/wasm32-unknown-unknown/release/$contract_name.wasm" \
    --source deployer \
    --network testnet)"
    echo "Contract successfully deployed on testnet with contract id $CONTRACT_ID"

    echo -e "\n\n"

    tmp=$(mktemp) 
    if [[ $(jq ".testnet.$contract_name" contracts_ids.json) ]]; then
        jq ".testnet.$contract_name = \"$CONTRACT_ID\"" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
    else
        jq ".testnet += [{\"$contract_name\":\"$CONTRACT_ID\"}]" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
    fi

    tmp=$(mktemp) 
    if [[ $(jq "any(.[]; .contractId == "\"$contract_name\"" and .networkId == "\"TESTNET\"")" deployments.json) = "true" ]]; then
        echo "we go there because cond = $(jq "any(.[]; .contractId == "\"$contract_name\"" and .networkId == "\"TESTNET\"")" deployments.json)"
        jq "map(select(.contractId == \"$contract_name\" and .networkId == \"TESTNET\") |= [{\"contractId\": \"$contract_name\",\"networkId\": \"TESTNET\", \"contractAddress\": \"$CONTRACT_ID\"}])" deployments.json > "$tmp" && mv "$tmp" deployments.json
    else
        echo "We go here"
        jq ". += [{\"contractId\": \"$contract_name\",\"networkId\": \"TESTNET\", \"contractAddress\": \"$CONTRACT_ID\"}]" deployments.json > "$tmp" && mv "$tmp" deployments.json
    fi
done

echo -e "Check the address of the deployed contracts in contracts_ids.json:\n`cat contracts_ids.json`"
echo -e "Check the address of the deployed contracts in deployments.json:\n`cat deployments.json`"