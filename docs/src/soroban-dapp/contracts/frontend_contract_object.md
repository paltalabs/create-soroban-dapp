# Retrieve the contract object in the frontend

In the file [GreeterContractInteraction.tsx](https://github.com/paltalabs/create-soroban-dapp/edit/main/soroban-react-dapp/src/components/web3/GreeterContractInteractions.tsx), change the two references to `"greeting"` in `updateGreeting` at line 105 and in `fetchGreeting` at line 55.

You then need to adapt the `contractInvoke()` calls in these functions to match the structure of your contract, by setting the right `method` name and the right `args` list.

Finally feel, of course, free to change the front-end how you wish, to match your desired functionalities.