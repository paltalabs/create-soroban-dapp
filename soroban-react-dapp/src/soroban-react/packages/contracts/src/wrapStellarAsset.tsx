import { SorobanContextType } from '@soroban-react/core'

import * as StellarSdk from 'stellar-sdk'

import { signAndSendTransaction } from './transaction'

export async function wrapStellarAsset({
  code,
  issuer,
  sorobanContext,
}: {
  code: string
  issuer: string
  sorobanContext: SorobanContextType
}) {
  const { activeChain, address, server } = sorobanContext
  const networkPassphrase = sorobanContext.activeChain?.networkPassphrase ?? ''

  if (!activeChain) {
    throw new Error('No active Chain')
  }
  if (!server) {
    throw new Error('No connected to a Server')
  }

  if (!networkPassphrase) throw new Error('No networkPassphrase')

  let source = await server.getAccount(address!)

  const operation = StellarSdk.Operation.createStellarAssetContract({
    asset: new StellarSdk.Asset(code, issuer),
  })

  const txn = new StellarSdk.TransactionBuilder(source, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(StellarSdk.TimeoutInfinite)
    .build()

  try {
    const result = await signAndSendTransaction({ txn, sorobanContext })
    return result
  } catch (error) {
    console.log(error)
  }
}
