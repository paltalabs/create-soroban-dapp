---
title: SendTransactionResult<E>
---
[soroban-react](../README.md) / [contracts/src/useSendTransaction](../modules/contracts_src_useSendTransaction.md) / SendTransactionResult

# Interface: SendTransactionResult\<E\>

[contracts/src/useSendTransaction](../modules/contracts_src_useSendTransaction.md).SendTransactionResult

## Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `Error` |

## Table of contents

### Properties

- [data](contracts_src_useSendTransaction.SendTransactionResult.md#data)
- [error](contracts_src_useSendTransaction.SendTransactionResult.md#error)
- [isError](contracts_src_useSendTransaction.SendTransactionResult.md#iserror)
- [isIdle](contracts_src_useSendTransaction.SendTransactionResult.md#isidle)
- [isLoading](contracts_src_useSendTransaction.SendTransactionResult.md#isloading)
- [isSuccess](contracts_src_useSendTransaction.SendTransactionResult.md#issuccess)
- [reset](contracts_src_useSendTransaction.SendTransactionResult.md#reset)
- [sendTransaction](contracts_src_useSendTransaction.SendTransactionResult.md#sendtransaction)
- [status](contracts_src_useSendTransaction.SendTransactionResult.md#status)

## Properties

### data

• `Optional` **data**: `ScVal`

#### Defined in

[contracts/src/useSendTransaction.tsx:12](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L12)

___

### error

• `Optional` **error**: `E`

#### Defined in

[contracts/src/useSendTransaction.tsx:13](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L13)

___

### isError

• **isError**: `boolean`

#### Defined in

[contracts/src/useSendTransaction.tsx:14](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L14)

___

### isIdle

• **isIdle**: `boolean`

#### Defined in

[contracts/src/useSendTransaction.tsx:15](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L15)

___

### isLoading

• **isLoading**: `boolean`

#### Defined in

[contracts/src/useSendTransaction.tsx:16](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L16)

___

### isSuccess

• **isSuccess**: `boolean`

#### Defined in

[contracts/src/useSendTransaction.tsx:17](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L17)

___

### reset

• **reset**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[contracts/src/useSendTransaction.tsx:22](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L22)

___

### sendTransaction

• **sendTransaction**: (`txn?`: [`Transaction`](../modules/contracts_src_types.md#transaction), `opts?`: [`SendTransactionOptions`](contracts_src_useSendTransaction.SendTransactionOptions.md)) => `Promise`\<`SimulateTransactionResponse` \| `Object`\>

#### Type declaration

▸ (`txn?`, `opts?`): `Promise`\<`SimulateTransactionResponse` \| `Object`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `txn?` | [`Transaction`](../modules/contracts_src_types.md#transaction) |
| `opts?` | [`SendTransactionOptions`](contracts_src_useSendTransaction.SendTransactionOptions.md) |

##### Returns

`Promise`\<`SimulateTransactionResponse` \| `Object`\>

#### Defined in

[contracts/src/useSendTransaction.tsx:18](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L18)

___

### status

• **status**: [`TransactionStatus`](../modules/contracts_src_useSendTransaction.md#transactionstatus)

#### Defined in

[contracts/src/useSendTransaction.tsx:23](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useSendTransaction.tsx#L23)
