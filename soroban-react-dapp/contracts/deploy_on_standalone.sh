#! /bin/bash
echo -e "\n\n"
echo "Using Makefile to build contracts wasm blobs"

echo -e "\n\n"

make > /dev/null

echo -e "\n\n"

echo "Configuring soroban for standalone\n"
soroban config network add --global standalone \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

echo "Configuring deployer identity"
soroban config identity generate deployer

echo -e "\n\n"

echo "Deployer address is $(soroban config identity address deployer)"

echo -e "\n\n"

echo "Funding deployer address with friendbot"
curl "http://localhost:8000/friendbot?addr=$(soroban config identity address deployer)" > /dev/null

echo -e "\n\n"

for contract_name in $@
do
    echo "Deploying $contract_name on standalone"
    CONTRACT_ID="$(soroban contract deploy \
    --wasm "./$contract_name/target/wasm32-unknown-unknown/release/$contract_name.wasm" \
    --source deployer \
    --network standalone)"
    echo "Contract successfully deployed on standalone with contract id $CONTRACT_ID"

    echo -e "\n\n"

    tmp=$(mktemp) 
    if [[ $(jq ".standalone.$contract_name" contracts_ids.json) ]]; then
        jq ".standalone.$contract_name = \"$CONTRACT_ID\"" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
    else
        jq ".standalone += [{\"$contract_name\":\"$CONTRACT_ID\"}]" contracts_ids.json > "$tmp" && mv "$tmp" contracts_ids.json
    fi
done

echo -e "Check the address of the deployed contracts in contracts_ids.json:\n`cat contracts_ids.json`"