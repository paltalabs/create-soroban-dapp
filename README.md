I tried to make it more dynamic with direct communication from the front end to the back end; however, due to time constraints, I ended up keeping it unidirectional.


to run it:
cd soroban-react-dapp
docker compose up -d
docker exec --tty --interactive soroban-preview bash 
cd contracts
make build
yarn
yarn deploy testnet greeting
cd ..
yarn install
yarn dev