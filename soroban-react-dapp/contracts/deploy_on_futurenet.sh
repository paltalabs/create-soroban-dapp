#! /bin/bash
network=futurenet
networkId=FUTURENET
network_passphrase="Test SDF Future Network ; October 2022"
rpc_url=https://rpc-futurenet.stellar.org:443
friendbot_url=https://friendbot-futurenet.stellar.org/

./deploy_generic.sh $network $networkId "$network_passphrase" $rpc_url $friendbot_url $@