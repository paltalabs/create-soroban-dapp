---
title: contracts/src/contractInvoke
---
[soroban-react](../README.md) / contracts/src/contractInvoke

# Module: contracts/src/contractInvoke

## Table of contents

### Type Aliases

- [InvokeArgs](contracts_src_contractInvoke.md#invokeargs)

### Functions

- [contractInvoke](contracts_src_contractInvoke.md#contractinvoke)

## Type Aliases

### InvokeArgs

Ƭ **InvokeArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args?` | `StellarSdk.xdr.ScVal`[] |
| `contractAddress` | `string` |
| `fee?` | `number` |
| `method` | `string` |
| `reconnectAfterTx?` | `boolean` |
| `secretKey?` | `string` |
| `signAndSend?` | `boolean` |
| `skipAddingFootprint?` | `boolean` |
| `sorobanContext` | `SorobanContextType` |

#### Defined in

[contracts/src/contractInvoke.tsx:12](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/contractInvoke.tsx#L12)

## Functions

### contractInvoke

▸ **contractInvoke**(`«destructured»`): `Promise`\<[`TxResponse`](contracts_src_types.md#txresponse) \| `StellarSdk.xdr.ScVal`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`InvokeArgs`](contracts_src_contractInvoke.md#invokeargs) |

#### Returns

`Promise`\<[`TxResponse`](contracts_src_types.md#txresponse) \| `StellarSdk.xdr.ScVal`\>

#### Defined in

[contracts/src/contractInvoke.tsx:28](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/contractInvoke.tsx#L28)
