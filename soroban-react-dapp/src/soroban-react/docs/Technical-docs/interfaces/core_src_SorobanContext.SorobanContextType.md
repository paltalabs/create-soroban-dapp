---
title: SorobanContextType
---
[soroban-react](../README.md) / [core/src/SorobanContext](../modules/core_src_SorobanContext.md) / SorobanContextType

# Interface: SorobanContextType

[core/src/SorobanContext](../modules/core_src_SorobanContext.md).SorobanContextType

## Table of contents

### Properties

- [activeChain](core_src_SorobanContext.SorobanContextType.md#activechain)
- [activeConnector](core_src_SorobanContext.SorobanContextType.md#activeconnector)
- [address](core_src_SorobanContext.SorobanContextType.md#address)
- [appName](core_src_SorobanContext.SorobanContextType.md#appname)
- [autoconnect](core_src_SorobanContext.SorobanContextType.md#autoconnect)
- [chains](core_src_SorobanContext.SorobanContextType.md#chains)
- [connect](core_src_SorobanContext.SorobanContextType.md#connect)
- [connectors](core_src_SorobanContext.SorobanContextType.md#connectors)
- [disconnect](core_src_SorobanContext.SorobanContextType.md#disconnect)
- [server](core_src_SorobanContext.SorobanContextType.md#server)
- [serverHorizon](core_src_SorobanContext.SorobanContextType.md#serverhorizon)
- [setActiveChain](core_src_SorobanContext.SorobanContextType.md#setactivechain)

## Properties

### activeChain

• `Optional` **activeChain**: `WalletChain`

#### Defined in

[core/src/SorobanContext.tsx:22](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L22)

___

### activeConnector

• `Optional` **activeConnector**: `Connector`

#### Defined in

[core/src/SorobanContext.tsx:24](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L24)

___

### address

• `Optional` **address**: `string`

#### Defined in

[core/src/SorobanContext.tsx:23](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L23)

___

### appName

• `Optional` **appName**: `string`

#### Defined in

[core/src/SorobanContext.tsx:19](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L19)

___

### autoconnect

• `Optional` **autoconnect**: `boolean`

#### Defined in

[core/src/SorobanContext.tsx:18](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L18)

___

### chains

• **chains**: `WalletChain`[]

#### Defined in

[core/src/SorobanContext.tsx:20](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L20)

___

### connect

• **connect**: () => `Promise`\<`void`\>

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[core/src/SorobanContext.tsx:27](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L27)

___

### connectors

• **connectors**: `Connector`[]

#### Defined in

[core/src/SorobanContext.tsx:21](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L21)

___

### disconnect

• **disconnect**: () => `Promise`\<`void`\>

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[core/src/SorobanContext.tsx:28](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L28)

___

### server

• `Optional` **server**: `Server`

#### Defined in

[core/src/SorobanContext.tsx:25](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L25)

___

### serverHorizon

• `Optional` **serverHorizon**: `Server`

#### Defined in

[core/src/SorobanContext.tsx:26](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L26)

___

### setActiveChain

• `Optional` **setActiveChain**: (`chain`: `WalletChain`) => `void`

#### Type declaration

▸ (`chain`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `WalletChain` |

##### Returns

`void`

#### Defined in

[core/src/SorobanContext.tsx:29](https://github.com/paltalabs/soroban-react/blob/50e8963/packages/core/src/SorobanContext.tsx#L29)
