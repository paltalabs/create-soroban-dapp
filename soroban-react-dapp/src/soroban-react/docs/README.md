
# Welcome to @soroban-react.

`@soroban-react` is a powerful library designed to facilitate the creation of modern, decentralized applications (dApps) using React and the Soroban blockchain network. This library provides a suite of features and tools that simplify and streamline the development of dApps on Soroban.

## Key Features:

- **Full support for Freighter**: [Freighter](https://github.com/stellar/freighter) is a browser extension for managing Stellar secret keys. With `@soroban-react`, you can interact securely and efficiently with Freighter to sign transactions and queries on the [Soroban blockchain network](https://soroban.stellar.org/).

- **Easy-to-use global context**: @soroban-react provides a global context, accessible throughout your dApp, that contains essential information such as the current account and chain. This context simplifies the management and access to key data in your dApp. Via a [React Context](https://reactjs.org/docs/context.html).

- **Customizable Connectors**: Connectors are an integral part of `@soroban-react`. A Connector manages all aspects of your dApp's connectivity with the Soroban blockchain network and user accounts.

- **Tests with Jest**

## Additional Utilities and Components:

- **[Set Trustline](./Technical-docs/modules/contracts_src_setTrustline.md)**: `@soroban-react` makes it easy to establish trustlines on the Soroban network, allowing accounts to hold assets issued by other accounts.

- **[Custom React Hooks](./Technical-docs/modules/contracts_src.md)**: `@soroban-react` provides several custom React hooks that simplify interaction with smart contracts and conducting transactions on the Soroban network.

- **[Events Package](./Technical-docs/modules/events_src.md)**: This package provides tools for subscribing to specific contract events on the Soroban blockchain network. To utilize it, wrap your components in the [SorobanEventsProvider](./Technical-docs/modules/events_src_SorobanEventsProvider.md) component and use the useSorobanEvents hook to subscribe to events.

- **[Freighter Package](./Technical-docs/modules/freighter_src.md)**: This package provides a connector for the `Freighter` web wallet, enabling the library to interact directly with it.

- **[Wallet Data Package (wallet-data)](./Technical-docs/modules/wallet_data_src.md)**: This package provides tools for managing wallet and network data. It includes a [WalletChainByName object](https://github.com/mauroepce/soroban-react/blob/486e5d4/packages/wallet-data/src/provideWalletChains.tsx#L5) with details of different Stellar chains, and custom React hooks like [useIsMounted](./Technical-docs/modules/wallet_data_src_useIsMounted.md) and [useNetwork](./Technical-docs/modules/wallet_data_src_useNetwork.md).

---

> In summary, `@soroban-react` is a comprehensive library for developing dApps on the Soroban network, providing a
> wealth of useful features and tools. Whether you're looking to interact with the Freighter web wallet, 
> subscribe to contract events, or manage network and wallet data, @soroban-react has the tools to help you
> achieve your goals.
