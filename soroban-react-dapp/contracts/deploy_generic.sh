#! /bin/bash
echo -e "\n\n"
echo "Using Makefile to build contracts wasm blobs"

echo -e "\n\n"

make > /dev/null

echo -e "\n\n"

network=$1
networkId=$2
network_passphrase=$3
rpc_url=$4
friendbot_url=$5


echo "Configuring soroban for $network"
soroban config network add --global $network \
  --rpc-url $rpc_url \
  --network-passphrase "$network_passphrase"

echo "Configuring deployer identity"
soroban config identity generate deployer \
    --rpc-url $rpc_url \
    --network-passphrase "$network_passphrase" \
    --network $network


echo -e "\n\n"

echo "Deployer address is $(soroban config identity address deployer)"

echo -e "\n\n"

echo "Funding deployer address with friendbot"
curl "$friendbot_url?addr=$(soroban config identity address deployer)" > /dev/null

echo -e "\n\n"

for contract_name in ${@:6}
do
    echo "Deploying $contract_name on $network"
    CONTRACT_ID="$(soroban contract deploy \
    --wasm "./$contract_name/target/wasm32-unknown-unknown/release/$contract_name.wasm" \
    --source deployer \
    --network $network)"
    echo "Contract successfully deployed on $network with contract id $CONTRACT_ID"

    echo -e "\n\n"

    DEPLOYMENTS_FILE=deployments.json

    if [ ! -f "$DEPLOYMENTS_FILE" ]; then
        echo "[]" > $DEPLOYMENTS_FILE
    fi

    tmp=$(mktemp) 
    if [[ $(jq "any(.[]; .contractId == \"$contract_name\" and .networkPassphrase == \"$network_passphrase\")" $DEPLOYMENTS_FILE) == "true" ]]; then
        echo "cond was $(jq "any(.[]; .contractId == \"$contract_name\" and .networkPaassphrase == \"$network_passphrase\")" $DEPLOYMENTS_FILE) "
        jq "map(select(.contractId == \"$contract_name\" and .networkPassphrase == \"$network_passphrase\") |= {\"contractId\": \"$contract_name\",\"networkPassphrase\": \"$network_passphrase\", \"contractAddress\": \"$CONTRACT_ID\"})" $DEPLOYMENTS_FILE > "$tmp" && mv "$tmp" $DEPLOYMENTS_FILE
    else
        echo "cond was $(jq "any(.[]; .contractId == \"$contract_name\" and .networkPassphrase == \"$network_passphrase\")" $DEPLOYMENTS_FILE) "
        jq ". += [{\"contractId\": \"$contract_name\",\"networkPassphrase\": \"$network_passphrase\", \"contractAddress\": \"$CONTRACT_ID\"}]" $DEPLOYMENTS_FILE > "$tmp" && mv "$tmp" $DEPLOYMENTS_FILE
    fi
done

echo -e "Check the address of the deployed contracts in $DEPLOYMENTS_FILE:\n`cat $DEPLOYMENTS_FILE`"