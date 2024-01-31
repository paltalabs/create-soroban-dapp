---
title: contracts/src/useSendTransaction
---
[soroban-react](../README.md) / contracts/src/useSendTransaction

# Module: contracts/src/useSendTransaction

## Table of contents

### Interfaces

- [SendTransactionOptions](../interfaces/contracts_src_useSendTransaction.SendTransactionOptions.md)
- [SendTransactionResult](../interfaces/contracts_src_useSendTransaction.SendTransactionResult.md)

### Type Aliases

- [TransactionStatus](contracts_src_useSendTransaction.md#transactionstatus)

### Functions

- [useSendTransaction](contracts_src_useSendTransaction.md#usesendtransaction)

## Type Aliases

### TransactionStatus

Ƭ **TransactionStatus**: ``"idle"`` \| ``"error"`` \| ``"loading"`` \| ``"success"``

#### Defined in

[contracts/src/useSendTransaction.tsx:9](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L9)

## Functions

### useSendTransaction

▸ **useSendTransaction**\<`E`\>(`defaultTxn?`, `defaultOptions?`): [`SendTransactionResult`](../interfaces/contracts_src_useSendTransaction.SendTransactionResult.md)\<`E`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `Error` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultTxn?` | [`Transaction`](contracts_src_types.md#transaction) |
| `defaultOptions?` | [`SendTransactionOptions`](../interfaces/contracts_src_useSendTransaction.SendTransactionOptions.md) |

#### Returns

[`SendTransactionResult`](../interfaces/contracts_src_useSendTransaction.SendTransactionResult.md)\<`E`\>

#### Defined in

[contracts/src/useSendTransaction.tsx:36](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L36)
