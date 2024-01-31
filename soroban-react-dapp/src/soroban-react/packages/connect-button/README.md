# @soroban-react/connect-button

See the official gitbook: https://soroban-react.gitbook.io/index/
___

Simple button, without style

Library created based on https://github.com/stellar/soroban-example-dapp/tree/main/wallet written by https://github.com/paulbellamy

The @soroban-react/connect-button library sets a button inside your dApp to connect to an specific connector.
In order to use it you'll need to give it a context of type `SorobanContextType`

# Usage 

```
import { useSorobanReact } from '@soroban-react/core'
import { ConnectButton } from '@soroban-react/connect-button'

```

```
<ConnectButton label="Connect Wallet" sorobanContext={sorobanContext} />
```

Its important to give the button the sorobanContext that will carry the connector's `connect()` method that the button will trigger.

