---
title: contracts/src/types
---
[soroban-react](../README.md) / contracts/src/types

# Module: contracts/src/types

## Table of contents

### Type Aliases

- [Simulation](contracts_src_types.md#simulation)
- [Transaction](contracts_src_types.md#transaction)
- [Tx](contracts_src_types.md#tx)
- [TxResponse](contracts_src_types.md#txresponse)

## Type Aliases

### Simulation

Ƭ **Simulation**: `SorobanRpc.Api.SimulateTransactionResponse`

#### Defined in

[contracts/src/types.tsx:15](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/types.tsx#L15)

___

### Transaction

Ƭ **Transaction**: `StellarSdk.Transaction` \| `StellarSdk.FeeBumpTransaction`

#### Defined in

[contracts/src/types.tsx:10](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/types.tsx#L10)

___

### Tx

Ƭ **Tx**: `StellarSdkTransaction`\<`Memo`\<`MemoType`\>, `Operation`[]\>

#### Defined in

[contracts/src/types.tsx:11](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/types.tsx#L11)

___

### TxResponse

Ƭ **TxResponse**: `SorobanRpc.Api.GetTransactionResponse` & \{ `txHash`: `string`  }

#### Defined in

[contracts/src/types.tsx:12](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/types.tsx#L12)
