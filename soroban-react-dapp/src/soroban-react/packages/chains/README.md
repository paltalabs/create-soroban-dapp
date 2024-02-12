# @soroban-react/chains

See the official gitbook: https://soroban-react.gitbook.io/index/
___

This package will charge the follwing chains:

```
import * as SorobanClient from "soroban-client";
import type {WalletChain, ChainName} from '@soroban-react/types';

export const allowedChains: Record<ChainName, WalletChain> = {
  public: {
    id: "public",
    name: "Public",
    networkPassphrase: SorobanClient.Networks.PUBLIC,
  },
  testnet: {
    id: "testnet",
    name: "Testnet",
    networkPassphrase: SorobanClient.Networks.TESTNET,
  },
  futurenet: {
    id: "futurenet",
    name: "Futurenet",
    networkPassphrase: SorobanClient.Networks.FUTURENET,
  },
  sandbox: {
    id: "sandbox",
    name: "Sandbox",
    networkPassphrase: SorobanClient.Networks.SANDBOX,
  },
  standalone: {
    id: "standalone",
    name: "Standalone",
    networkPassphrase: "Standalone Network ; February 2017",
  },
};
```


Library created based on https://github.com/stellar/soroban-example-dapp/tree/main/wallet written by https://github.com/paulbellamy