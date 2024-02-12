import type { WalletChain, ChainName } from '@soroban-react/types'

// Sourced from https://github.com/tmm/wagmi/blob/main/packages/core/src/constants/chains.ts
// This is just so we can clearly see which of wagmi's first-class chains we provide metadata for
export const WalletChainByName: Record<ChainName, WalletChain> = {
  public: {
    id: 'public',
    network: 'public',
    name: 'Public',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    iconBackground: '#e84141',
    networkUrl: 'https://horizon.stellar.org',
    sorobanRpcUrl: 'https://horizon.stellar.org',
    // iconUrl: async () => (await import('./chainIcons/public.svg')).default,
  },
  testnet: {
    id: 'testnet',
    network: 'testnet',
    name: 'Testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    iconBackground: '#484c50',
    networkUrl: 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: 'https://rpc-testnet.stellar.org/',
    // iconUrl: async () => (await import('./chainIcons/testnet.svg')).default,
  },
  futurenet: {
    id: 'futurenet',
    network: 'futurenet',
    name: 'Futurenet',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
    iconBackground: '#96bedc',
    networkUrl: 'https://horizon-futurenet.stellar.org',
    sorobanRpcUrl: 'https://rpc-futurenet.stellar.org/',
    // iconUrl: async () => (await import('./chainIcons/futurenet.svg')).default,
  },
  sandbox: {
    id: 'sandbox',
    network: 'sandbox',
    name: 'Sandbox',
    networkPassphrase: 'Local Sandbox Stellar Network ; September 2022',
    iconBackground: '#dac695',
    networkUrl: 'http://localhost:8000',
    sorobanRpcUrl: 'http://localhost:8000/soroban/rpc',
    // iconUrl: async () => (await import('./chainIcons/futurenet.svg')).default,
  },
  standalone: {
    id: 'standalone',
    network: 'standalone',
    name: 'Standalone',
    networkPassphrase: 'Standalone Network ; February 2017',
    iconBackground: '#dac695',
    networkUrl: 'http://localhost:8000',
    sorobanRpcUrl: 'http://localhost:8000/soroban/rpc',
    // iconUrl: async () => (await import('./chainIcons/futurenet.svg')).default,
  },
}
