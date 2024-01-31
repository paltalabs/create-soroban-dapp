import { SorobanContextType } from '@soroban-react/core'
import React from 'react'

import * as StellarSdk from 'stellar-sdk'

import { signAndSendTransaction } from './transaction'
import type { Transaction, Tx, TxResponse, Simulation } from './types'

export type TransactionStatus = 'idle' | 'error' | 'loading' | 'success'

export interface SendTransactionResult<E = Error> {
  data?: StellarSdk.xdr.ScVal
  error?: E
  isError: boolean
  isIdle: boolean
  isLoading: boolean
  isSuccess: boolean
  sendTransaction: (
    txn?: Transaction,
    opts?: SendTransactionOptions
  ) => Promise<(TxResponse & { xdr: string }) | Simulation>
  reset: () => void
  status: TransactionStatus
}

export interface SendTransactionOptions {
  timeout?: number
  skipAddingFootprint?: boolean
  secretKey?: string
  sorobanContext?: SorobanContextType
}

// useSendTransaction is a hook that returns a function that can be used to
// send a transaction. Upon sending, it will poll server.getTransactionStatus,
// until the transaction succeeds/fails, and return the result.
export function useSendTransaction<E = Error>(
  defaultTxn?: Transaction,
  defaultOptions?: SendTransactionOptions
): SendTransactionResult<E> {
  const [status, setState] = React.useState<TransactionStatus>('idle')

  // TODO: as the sorobanContext is passed each time sendTransaction is called
  // we don't need anymore a useCallback hook. Convert useSendTransaction to a
  const sendTransaction = React.useCallback(
    async function (
      passedTxn?: Transaction,
      passedOptions?: SendTransactionOptions
    ): Promise<any> {
      // Promise<(TxResponse & { xdr: string }) | Simulation> {

      let sorobanContext: SorobanContextType | undefined

      if (passedOptions?.sorobanContext) {
        sorobanContext = passedOptions?.sorobanContext
      }
      let txn = passedTxn ?? defaultTxn

      if (!(passedOptions?.secretKey || sorobanContext?.activeConnector)) {
        throw new Error(
          'No secret key or active wallet. Provide at least one of those'
        )
      }

      if (
        !txn ||
        !sorobanContext?.activeConnector ||
        !sorobanContext?.activeChain
      ) {
        throw new Error('No transaction or wallet or chain')
      }

      if (!sorobanContext.server) throw new Error('Not connected to server')

      let activeChain = sorobanContext?.activeChain
      let activeConnector = sorobanContext?.activeConnector
      let server = sorobanContext?.server

      const { timeout, skipAddingFootprint } = {
        timeout: 60000,
        skipAddingFootprint: false,
        ...defaultOptions,
        ...passedOptions,
      }
      const networkPassphrase = activeChain.networkPassphrase

      setState('loading')

      return await signAndSendTransaction({
        txn,
        secretKey: passedOptions?.secretKey,
        skipAddingFootprint,
        sorobanContext,
      })
    },
    [defaultTxn]
  )

  return {
    isIdle: status == 'idle',
    isError: status == 'error',
    isLoading: status == 'loading',
    isSuccess: status == 'success',
    sendTransaction,
    reset: () => {},
    status,
  }
}
