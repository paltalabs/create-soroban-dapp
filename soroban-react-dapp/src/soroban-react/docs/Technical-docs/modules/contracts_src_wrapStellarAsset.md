---
title: contracts/src/setTrustline
---

[soroban-react](../README.md) / contracts/src/wrapStellarAsset

# Module: contracts/src/wrapStellarAsset

Wraps a Stellar asset to be used on the Soroban network, enabling it to interact with Soroban smart contracts and functionalities.

## Table of contents

### Functions

- [wrapStellarAsset](contracts_src_wrapStellarAsset.md#wrapstellarasset)

## Functions

### wrapStellarAsset

▸ **wrapStellarAsset**(`«destructured»`): `Promise`\<[`TxResponse`](contracts_src_types.md#txresponse) \| `StellarSdk.xdr.ScVal`\>

Wraps the specified Stellar asset by creating a corresponding asset on the Soroban network.

#### Parameters

| Name               | Type                 |
| :----------------- | :------------------- |
| `«destructured»`   | `Object`             |
| › `code`           | `string`             |
| › `issuer`         | `string`             |
| › `sorobanContext` | `SorobanContextType` |

#### Returns

`Promise`\<[`TxResponse`](contracts_src_types.md#txresponse) \| `StellarSdk.xdr.ScVal`\>

#### Defined in

[contracts/src/setTrustline.tsx:5](https://github.com/paltalabs/soroban-react/packages/contracts/src/wrapStellarAsset.tsx)

#### Example

```ts
const sorobanContext = useSorobanReact()
const assetCode = 'USDC'
const issuer = 'GDUKMGUGDQWSQ3SLQ2ZQVQ2U3RMLG5SZR5BHOYQTWQIWZ7STEE4JCAD4'

wrapStellarAsset({ code: assetCode, issuer, sorobanContext })
  .then(response => console.log(response))
  .catch(error => console.error('Error wrapping asset:', error))
```
