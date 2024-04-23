#! /bin/bash
network=standalone
networkId=STANDALONE
network_passphrase="Standalone Network ; February 2017"
rpc_url=http://localhost:8000/soroban/rpc
friendbot_url=http://localhost:8000/friendbot

./deploy_generic.sh $network $networkId "$network_passphrase" $rpc_url $friendbot_url $@