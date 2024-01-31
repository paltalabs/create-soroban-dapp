import { SorobanContextType } from '@soroban-react/core'

import * as StellarSdk from 'stellar-sdk'
import { SorobanRpc } from 'stellar-sdk'

import { contractTransaction } from './contractTransaction'
import { signAndSendTransaction } from './transaction'
import { TxResponse } from './types'

let xdr = StellarSdk.xdr

export type InvokeArgs = {
  contractAddress: string
  method: string
  args?: StellarSdk.xdr.ScVal[] | undefined
  signAndSend?: boolean
  fee?: number
  skipAddingFootprint?: boolean
  secretKey?: string
  sorobanContext: SorobanContextType
  reconnectAfterTx?: boolean
}

// Dummy source account for simulation. The public key for this is all 0-bytes.
const defaultAddress =
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'

export async function contractInvoke({
  contractAddress,
  method,
  args = [],
  signAndSend = false,
  fee = 100,
  skipAddingFootprint,
  secretKey,
  sorobanContext,
  reconnectAfterTx = true,
}: InvokeArgs): Promise<TxResponse | StellarSdk.xdr.ScVal> {
  const { server, address, activeChain } = sorobanContext

  if (!activeChain) {
    throw new Error('No active Chain')
  }
  if (!server) {
    throw new Error('No connected to a Server')
  }
  if (signAndSend && !secretKey && !sorobanContext.activeConnector) {
    throw new Error(
      'contractInvoke: You are trying to sign a txn without providing a source, secretKey or active connector'
    )
  }

  const networkPassphrase = activeChain?.networkPassphrase
  let source = null

  if (secretKey) {
    source = await server.getAccount(
      StellarSdk.Keypair.fromSecret(secretKey).publicKey()
    )
  } else {
    try {
      if (!address) throw new Error('No address')

      source = await server.getAccount(address)
    } catch (error) {
      source = new StellarSdk.Account(defaultAddress, '0')
    }
  }

  //Builds the transaction
  let txn = contractTransaction({
    source,
    networkPassphrase,
    contractAddress,
    method,
    args,
  })

  const simulated: SorobanRpc.Api.SimulateTransactionResponse =
    await server?.simulateTransaction(txn)

  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(simulated.error)
  } else if (!simulated.result) {
    throw new Error(`invalid simulation: no result in ${simulated}`)
  }

  if (!signAndSend && simulated) {
    return simulated.result.retval
  } else {
    // If signAndSend
    const res = await signAndSendTransaction({
      txn,
      skipAddingFootprint,
      secretKey,
      sorobanContext,
    })

    if (reconnectAfterTx) {
      sorobanContext.connect()
    }

    return res
  }
}
