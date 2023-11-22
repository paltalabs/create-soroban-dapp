#!/bin/bash
echo "Creating an empty src/contract_ids.json file"
echo '{"standalone": {"title_id": "undefined"}, "futurenet": {"title_id": "undefined"}}' > src/contract_ids.json
set -e


echo Build the title contract

cd contract
make build
cd ..

for NETWORK in standalone futurenet
do
    case "$NETWORK" in
    standalone) 
    echo "Using standalone network"
    SOROBAN_RPC_HOST="http://stellar-standalone:8000"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"
    SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
    FRIENDBOT_URL="$SOROBAN_RPC_HOST/friendbot"
    NEW_TITLE="I love Standalone"
    ;;
    futurenet)
    echo "Using Futurenet network"
    SOROBAN_RPC_HOST="http://stellar-futurenet:8000"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"
    SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
    FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
    NEW_TITLE="I prefer Futurenet"
    ;;
    *)
    echo "Usage: $0 standalone|futurenet"
    exit 1
    ;;
    esac

    
    echo Add the $NETWORK network to cli client
        soroban config network add "$NETWORK" \
            --rpc-url "$SOROBAN_RPC_URL" \
            --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE"
        echo "--"
        echo "--"

    echo Creating the title-admin identity
        soroban config identity generate title-admin
        TOKEN_ADMIN_ADDRESS="$(soroban config identity address title-admin)"
        echo "--"
        echo "--"

    # This will fail if the account already exists, but it'll still be fine.
    echo Fund title-admin account from friendbot
        curl  -X POST "$FRIENDBOT_URL?addr=$TOKEN_ADMIN_ADDRESS"
        echo "--"
        echo "--"

    ARGS="--network $NETWORK --source title-admin"
    echo "Using ARGS: $ARGS"
        echo "--"
        echo "--"

    echo Deploy the title contract
        WASM_PATH="contract/target/wasm32-unknown-unknown/release/title_contract.wasm"
        TITLE_ID="$(soroban contract deploy $ARGS --wasm $WASM_PATH)"
        echo "Contract deployed in $NETWORK network succesfully with ID: $TITLE_ID"
        echo "--"
        echo "--"

    sleep 3

    tmp=$(mktemp) 
    jq ".$NETWORK.title_id = \"$TITLE_ID\"" src/contract_ids.json > "$tmp" && mv "$tmp" src/contract_ids.json


    echo "Setting the first title: My $NETWORK title"
        soroban contract invoke \
            $ARGS \
            --wasm $WASM_PATH \
            --id $TITLE_ID \
            -- \
            set_title   \
            --title "{\"string\":\"$NEW_TITLE\"}"
        echo "--"
        echo "--"

    echo "Reading the  read_title function value"

    soroban contract invoke \
        $ARGS \
        --wasm $WASM_PATH \
        --id $TITLE_ID \
        -- \
        read_title

    chmod 777 src/contract_ids.json # Give permission after each network in case future net is not ready yet
done

echo "We have our src/contract_ids.json file:"
cat src/contract_ids.json