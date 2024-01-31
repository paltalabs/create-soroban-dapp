# @soroban-react/contracts

See the official gitbook: https://soroban-react.gitbook.io/index/ .
___

```javascript
import { useContractValue} from '@soroban-react/contracts'
import { useSorobanReact } from '@soroban-react/core'


const balance = useContractValue({ 
        contractId: Constants.TokenId,
        method: 'balance',
        params: [contractIdentifier(Buffer.from(Constants.CrowdfundId, 'hex'))],
        sorobanContext: sorobanContext
    })
```
