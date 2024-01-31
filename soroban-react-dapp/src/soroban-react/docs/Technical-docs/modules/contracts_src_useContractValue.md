---
title: contracts/src/useContractValue
---
[soroban-react](../README.md) / contracts/src/useContractValue

# Module: contracts/src/useContractValue

## Table of contents

### Interfaces

- [fetchContractValueProps](../interfaces/contracts_src_useContractValue.fetchContractValueProps.md)
- [useContractValueProps](../interfaces/contracts_src_useContractValue.useContractValueProps.md)

### Type Aliases

- [ContractValueType](contracts_src_useContractValue.md#contractvaluetype)

### Functions

- [useContractValue](contracts_src_useContractValue.md#usecontractvalue)

## Type Aliases

### ContractValueType

Ƭ **ContractValueType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | `string` \| `unknown` |
| `loading?` | ``true`` |
| `result?` | `StellarSdk.xdr.ScVal` |

#### Defined in

[contracts/src/useContractValue.tsx:12](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useContractValue.tsx#L12)

## Functions

### useContractValue

▸ **useContractValue**(`«destructured»`): [`ContractValueType`](contracts_src_useContractValue.md#contractvaluetype)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`useContractValueProps`](../interfaces/contracts_src_useContractValue.useContractValueProps.md) |

#### Returns

[`ContractValueType`](contracts_src_useContractValue.md#contractvaluetype)

#### Defined in

[contracts/src/useContractValue.tsx:30](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/contracts/src/useContractValue.tsx#L30)
