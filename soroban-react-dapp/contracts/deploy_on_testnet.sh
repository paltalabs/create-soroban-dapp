#! /bin/bash

network=testnet
networkId=TESTNET
network_passphrase="Test SDF Network ; September 2015"
rpc_url=https://soroban-testnet.stellar.org:443
friendbot_url=https://friendbot.stellar.org/

./deploy_generic.sh $network $networkId "$network_passphrase" $rpc_url $friendbot_url $@