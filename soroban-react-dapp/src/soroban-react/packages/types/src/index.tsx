export type InstructionStepName = 'install' | 'create' | 'scan'

export interface NetworkDetails {
  network: string
  networkUrl: string
  networkPassphrase: string
  sorobanRpcUrl?: string
}

export interface WalletChain {
  id: string
  name?: string
  networkPassphrase: string
  iconBackground?: string
  iconUrl?: string | null
  unsupported?: boolean
  network: string
  networkUrl: string
  sorobanRpcUrl?: string
}

export type Connector = {
  id: string
  name: string
  shortName?: string
  iconUrl: string | (() => Promise<string>)
  iconBackground: string
  installed?: boolean
  downloadUrls?: {
    android?: string
    ios?: string
    browserExtension?: string
    qrCode?: string
  }
  isConnected: () => boolean
  getNetworkDetails: () => Promise<NetworkDetails>
  getPublicKey: () => Promise<string>
  signTransaction: (
    xdr: string,
    opts?: {
      network?: string
      networkPassphrase?: string
      accountToSign?: string
    }
  ) => Promise<string>
}

// Sourced from https://github.com/tmm/wagmi/blob/main/packages/core/src/constants/chains.ts
// This is just so we can clearly see which of wagmi's first-class chains we provide metadata for
export type ChainName =
  | 'futurenet'
  | 'public'
  | 'testnet'
  | 'sandbox'
  | 'standalone'

export type ChainMetadata = WalletChain


// Type for top level contract registry
export type ContractDeploymentInfo = {
  contractId: string,
  networkPassphrase: string,
  contractAddress: string
}

import * as StellarSdk from 'stellar-sdk'

export type WrappedContractInvokeArgs = {
  // NO NEED contractAddress: string
  method: string
  args?: StellarSdk.xdr.ScVal[] | undefined
  signAndSend?: boolean
  fee?: number
  skipAddingFootprint?: boolean
  secretKey?: string
  // NO NEED MAYBE sorobanContext: SorobanContextType
  // If useSorobanReact called inside of wrapped function
  reconnectAfterTx?: boolean
}

import {TxResponse} from '@soroban-react/contracts'

export type WrappedContract = {
  deploymentInfo: ContractDeploymentInfo,
  invoke: (args: WrappedContractInvokeArgs) => Promise<TxResponse | StellarSdk.xdr.ScVal>
}