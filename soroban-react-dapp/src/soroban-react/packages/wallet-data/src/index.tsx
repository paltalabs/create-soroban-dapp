import { ConnectButton } from '@soroban-react/connect-button'
import { SorobanContextType } from '@soroban-react/core'
import React from 'react'

import { useNetwork } from './useNetwork'

export interface WalletDataProps {
  sorobanContext: SorobanContextType
}

// TODO: Eliminate flash of unconnected content on loading
export function WalletData({ sorobanContext }: WalletDataProps) {
  const useAccount = () => {
    const { address } = sorobanContext

    if (!address) {
      return {}
    }

    return {
      data: {
        address,
        displayName: `${address.slice(0, 4)}...${address.slice(-4)}`,
      },
    }
  }

  const { data: account } = useAccount()

  const { activeChain: chain, chains } = useNetwork(sorobanContext)

  const unsupportedChain = chain?.unsupported

  const styleDisplayData: any = { display: 'flex' }

  return (
    <>
      {account ? (
        <div className={styleDisplayData}>
          {chain && (chains.length > 1 || unsupportedChain) && (
            <div>
              {chain.iconUrl}
              {chain.name ?? chain.id}
            </div>
          )}
          <div>{account.displayName}</div>
        </div>
      ) : (
        <ConnectButton label="Connect Wallet" sorobanContext={sorobanContext} />
      )}
    </>
  )
}
