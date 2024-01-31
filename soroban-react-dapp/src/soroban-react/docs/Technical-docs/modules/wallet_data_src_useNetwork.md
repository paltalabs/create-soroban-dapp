---
title: wallet-data/src/useNetwork
---
[soroban-react](../README.md) / wallet-data/src/useNetwork

# Module: wallet-data/src/useNetwork

## Table of contents

### Type Aliases

- [NetworkConfig](wallet_data_src_useNetwork.md#networkconfig)

### Functions

- [useNetwork](wallet_data_src_useNetwork.md#usenetwork)

## Type Aliases

### NetworkConfig

Ƭ **NetworkConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `activeChain?` | `WalletChain` |
| `chains` | `WalletChain`[] |
| `server?` | `StellarSdk.SorobanRpc.Server` |

#### Defined in

[wallet-data/src/useNetwork.tsx:9](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/wallet-data/src/useNetwork.tsx#L9)

## Functions

### useNetwork

▸ **useNetwork**(`sorobanContext`): [`NetworkConfig`](wallet_data_src_useNetwork.md#networkconfig)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sorobanContext` | `SorobanContextType` |

#### Returns

[`NetworkConfig`](wallet_data_src_useNetwork.md#networkconfig)

#### Defined in

[wallet-data/src/useNetwork.tsx:15](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/wallet-data/src/useNetwork.tsx#L15)
