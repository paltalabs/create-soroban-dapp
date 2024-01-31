import { SorobanContextType } from '@soroban-react/core'
import { WalletChain } from '@soroban-react/types'
import React from 'react'

import * as StellarSdk from 'stellar-sdk'

import { WalletChainByName } from './provideWalletChains'

export type NetworkConfig = {
  activeChain?: WalletChain
  server?: StellarSdk.SorobanRpc.Server
  chains: Array<WalletChain>
}

export function useNetwork(sorobanContext: SorobanContextType): NetworkConfig {
  const { activeChain, server } = sorobanContext
  return {
    activeChain,
    server,
    chains: Object.values(WalletChainByName),
  }
}
