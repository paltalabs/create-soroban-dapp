---
title: contracts/src/transaction
---
[soroban-react](../README.md) / contracts/src/transaction

# Module: contracts/src/transaction

## Table of contents

### Type Aliases

- [SignAndSendArgs](contracts_src_transaction.md#signandsendargs)

### Functions

- [sendTx](contracts_src_transaction.md#sendtx)
- [signAndSendTransaction](contracts_src_transaction.md#signandsendtransaction)

## Type Aliases

### SignAndSendArgs

Ƭ **SignAndSendArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `secretKey?` | `string` |
| `skipAddingFootprint?` | `boolean` |
| `sorobanContext` | `SorobanContextType` |
| `txn` | [`Transaction`](contracts_src_types.md#transaction) |

#### Defined in

[contracts/src/transaction.tsx:9](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/transaction.tsx#L9)

## Functions

### sendTx

▸ **sendTx**(`«destructured»`): `Promise`\<[`TxResponse`](contracts_src_types.md#txresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `secondsToWait` | `number` |
| › `server` | `Server` |
| › `tx` | [`Tx`](contracts_src_types.md#tx) |

#### Returns

`Promise`\<[`TxResponse`](contracts_src_types.md#txresponse)\>

#### Defined in

[contracts/src/transaction.tsx:83](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/transaction.tsx#L83)

___

### signAndSendTransaction

▸ **signAndSendTransaction**(`«destructured»`): `Promise`\<[`TxResponse`](contracts_src_types.md#txresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SignAndSendArgs`](contracts_src_transaction.md#signandsendargs) |

#### Returns

`Promise`\<[`TxResponse`](contracts_src_types.md#txresponse)\>

#### Defined in

[contracts/src/transaction.tsx:16](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/transaction.tsx#L16)
