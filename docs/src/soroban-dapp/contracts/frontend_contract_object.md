# Retrieve the contract object in the frontend

## Get the contract wrapper object using the useRegisteredContract hook:

In the file [GreeterContractInteraction.tsx], you can see an [example](https://github.com/paltalabs/create-soroban-dapp/blob/4fe846b382b204e9f40d1fb276e3b9f48424e3d8/soroban-react-dapp/src/components/web3/GreeterContractInteractions.tsx#L44) of how to retreive the contract object in the front end:

You first need to import the `useRegisteredContract` hook in your page [here](https://github.com/paltalabs/create-soroban-dapp/blob/4fe846b382b204e9f40d1fb276e3b9f48424e3d8/soroban-react-dapp/src/components/web3/GreeterContractInteractions.tsx#L14):

`import { useRegisteredContract } from '@soroban-react/contracts'`

Then you have to call the hook with the name of the contract you want to fetch as a parameter:

`const contract = useRegisteredContract("greeting")`

The hook will fetch the contract directly in the deployments object passed to the context [here](https://github.com/paltalabs/create-soroban-dapp/blob/4fe846b382b204e9f40d1fb276e3b9f48424e3d8/soroban-react-dapp/src/components/web3/MySorobanReactProvider.tsx#L22) and the values will correspond to the values in the `deployments.json` file updated automatically when the deploy scripts are called.


## Contract wrapper object

The contract object has two fields, the deploymentInfo object and the invoke method:

```
contract
    .deploymentInfo (Object)
        .name
        .networkPassphrase
        .contractAddress
    .invoke (Method)
```

### The deploymentInfo object

`deploymentInfo` is directly corresponding to the object you can see in the `deployments.json`, looking like the following:

```JSON
{
    "contractId": "greeting",
    "networkPassphrase": "Test SDF Network ; September 2015",
    "contractAddress": "CDKU2ZVK2RV3JFPPNAVYHGHMSXD7RENEVMEPURNKEECM7FDVH7WHI7ZO"
}
```

### The invoke method

The `invoke` method is a wrapper around the `contractInvoke` method from @soroban-react. It basically use the latter with some parameters computed from the `deploymentInfo` of the contract and the current context to simplify its calling.

The syntax to call a method of the contract object is as following:

```ts
const result = await contract?.invoke({
    method: 'set_title',
    args: [stringToScVal(newMessage)],
})
```

Where `method` is the name of the smart contract method you want to call and `args` the arguments the method expects converted into ScVal.