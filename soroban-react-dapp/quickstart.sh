previewVersion=$(jq -r '.previewVersion' preview_version.json)
quickstartHash=$(jq -r '.quickstartHash' preview_version.json)

#!/bin/bash

set -e

case "$1" in
standalone)
    echo "Using standalone network"
    ARGS="--standalone" # --enable-core-artificially-accelerate-time-for-testing"
    STELLAR_NAME='stellar-standalone'
    LOCAL_PORT='8000'
    ;;
futurenet)
    echo "Using Futurenet network"
    ARGS="--futurenet"
    STELLAR_NAME='stellar-futurenet'
    LOCAL_PORT='8001'
    ;;
*)
    echo "Usage: $0 standalone|futurenet"
    exit 1
    ;;
esac


shift

echo "1. Creating docker soroban network"
(docker network inspect soroban-network -f '{{.Id}}' 2>/dev/null) \
  || docker network create soroban-network


echo "2. Running a soroban-preview docker container"

echo "Searching for a previous soroban-preview docker container"
containerID=$(docker ps --filter=`name=soroban-preview-${previewVersion}` --all --quiet)
if [[ ${containerID} ]]; then
    echo "Start removing soroban-preview-${previewVersion}  container."
    docker rm --force soroban-preview-${previewVersion}
    echo "Finished removing soroban-preview-${previewVersion} container."
else
    echo "No previous soroban-preview-${previewVersion} container was found"
fi
 

currentDir=$(pwd)
docker run -dti \
  --volume ${currentDir}:/workspace \
  --name soroban-preview-${previewVersion} \
  --ipc=host \
  --network soroban-network \
  esteblock/soroban-preview:${previewVersion}


echo "2. Running a the stellar quickstart image with name=$STELLAR_NAME"

# Run the stellar quickstart image
docker run --rm -ti \
  --name $STELLAR_NAME \
  --network soroban-network \
  -p $LOCAL_PORT:8000 \
  stellar/quickstart:$quickstartHash \
  $ARGS \
  --enable-soroban-rpc \
  --protocol-version 20 \
  "$@" # Pass through args from the CLI



  #--platform linux/amd64 \

  # docker run --rm -it \
  # -p 8002:8000 \
  # --name stellar-futurenet \
  # stellar/quickstart:soroban-dev@sha256:a057ec6f06c6702c005693f8265ed1261e901b153a754e97cf18b0962257e872 \
  # --futurenet \
  # --enable-soroban-rpc

