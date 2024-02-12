import type { WalletChain } from '@soroban-react/types'

import {Networks} from 'stellar-sdk'

/**
 * A `WalletChain` object representing the public blockchain network.
 * @property {string} id - The unique identifier for the blockchain network.
 * @property {string} name - The name of the blockchain network.
 * @property {string} network - The name of the blockchain network.
 * @property {string} networkPassphrase - The network passphrase for the blockchain network.
 * @property {string} networkUrl - The Horizon URL "https://horizon-testnet.stellar.org";
 * @property {string} sorobanRpcUrl  - The Soroban RPC URL sorobanRpcUr;
 */

export const public_chain: WalletChain = {
  id: 'public',
  network: 'public',
  name: 'Public',
  networkPassphrase: Networks.PUBLIC,
  networkUrl: 'https://horizon.stellar.org',
  sorobanRpcUrl: 'https://horizon.stellar.org',
}

/**
 * A `WalletChain` object representing the Futurenet blockchain network.
 */

export const futurenet: WalletChain = {
  id: 'futurenet',
  network: 'futurenet',
  name: 'Futurenet',
  networkPassphrase: 'Test SDF Future Network ; October 2022',
  networkUrl: 'https://horizon-futurenet.stellar.org',
  sorobanRpcUrl: 'https://rpc-futurenet.stellar.org/',
}

/**
 * A `WalletChain` object representing the Testnet blockchain network.
 */

export const testnet: WalletChain = {
  id: 'testnet',
  network: 'testnet',
  name: 'Testnet',
  networkPassphrase: Networks.TESTNET,
  networkUrl: 'https://horizon-testnet.stellar.org',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org/',
}

/**
 * A `WalletChain` object representing the Sandbox blockchain network.
 */

export const sandbox: WalletChain = {
  id: 'sandbox',
  network: 'sandbox',
  name: 'Sandbox',
  networkPassphrase: 'Local Sandbox Stellar Network ; September 2022',
  networkUrl: 'http://localhost:8000',
  sorobanRpcUrl: 'http://localhost:8000/soroban/rpc',
}

/**
 * A `WalletChain` object representing the Standalone blockchain network.
 */

export const standalone: WalletChain = {
  id: 'standalone',
  network: 'standalone',
  name: 'Standalone',
  networkPassphrase: 'Standalone Network ; February 2017',
  networkUrl: 'http://localhost:8000',
  sorobanRpcUrl: 'http://localhost:8000/soroban/rpc',
}
