import { SorobanContextType } from '@soroban-react/core'

import { Sign } from 'crypto'
import * as StellarSdk from 'stellar-sdk'

import { SorobanRpc } from 'stellar-sdk'

import type { Tx, Transaction, TxResponse } from './types'

export type SignAndSendArgs = {
  txn: Transaction
  secretKey?: string
  skipAddingFootprint?: boolean
  sorobanContext: SorobanContextType
}

export async function signAndSendTransaction({
  txn,
  secretKey,
  skipAddingFootprint = false,
  sorobanContext,
}: SignAndSendArgs): Promise<TxResponse> {
  let networkPassphrase = sorobanContext.activeChain?.networkPassphrase
  let server = sorobanContext.server

  if (!secretKey && !sorobanContext.activeConnector)
    throw Error('signAndSend: no secretKey neither activeConnector')
  if (!server) throw Error('signAndSend: no server')
  if (!networkPassphrase) throw Error('signAndSend: no networkPassphrase')

  // preflight and add the footprint !
  if (!skipAddingFootprint) {
    txn = await server.prepareTransaction(txn)
    if (!txn) {
      throw new Error('No transaction after adding footprint')
    }
  }

  // // is it possible for `auths` to be present but empty? Probably not, but let's be safe.
  // const auths = simulated.results?.[0]?.auth;
  // let auth_len = auths?.length ?? 0;

  // if (auth_len > 1) {
  //   throw new NotImplementedError("Multiple auths not yet supported");
  // } else if (auth_len == 1) {
  //   // TODO: figure out how to fix with new StellarSdk
  //   // const auth = StellarSdk.xdr.SorobanAuthorizationEntry.fromXDR(auths![0]!, 'base64')
  //   // if (auth.addressWithNonce() !== undefined) {
  //   //   throw new NotImplementedError(
  //   //     `This transaction needs to be signed by ${auth.addressWithNonce()
  //   //     }; Not yet supported`
  //   //   )
  //   // }
  // }

  let signed = ''
  if (secretKey) {
    // User as set a secretKey, txn will be signed using the secretKey
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    txn.sign(keypair)
    signed = txn.toXDR()
  } else if (sorobanContext.activeConnector) {
    // User has not set a secretKey, txn will be signed using the Connector (wallet) provided in the sorobanContext
    console.log("TRANSACTION SIGN AND SEND OPTS",{networkPassphrase,
      network: sorobanContext.activeChain?.id,
      accountToSign: sorobanContext.address})
    signed = await sorobanContext.activeConnector.signTransaction(txn.toXDR(), {
      networkPassphrase,
      network: sorobanContext.activeChain?.id,
      accountToSign: sorobanContext.address
    })
    console.log("Wallet has signed: ", signed)
  } else {
    throw new Error(
      'signAndSendTransaction: no secretKey, neither active Connector'
    )
  }

  const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
    signed,
    networkPassphrase
  )

  let tx = transactionToSubmit as Tx
  let secondsToWait = 20

  const raw = await sendTx({ tx, secondsToWait, server })

  return raw
}

export async function sendTx({
  tx,
  secondsToWait,
  server,
}: {
  tx: Tx
  secondsToWait: number
  server: StellarSdk.SorobanRpc.Server
}): Promise<TxResponse> {
  const sendTransactionResponse = await server.sendTransaction(tx)
  let getTransactionResponse = await server.getTransaction(
    sendTransactionResponse.hash
  )
  const waitUntil = new Date(Date.now() + secondsToWait * 1000).valueOf()
  
  let waitTime = 1000
  let exponentialFactor = 1.5
  
  while (
    Date.now() < waitUntil &&
    getTransactionResponse.status === 'NOT_FOUND'
    ) {
      // Wait a beat
      await new Promise(resolve => setTimeout(resolve, waitTime))
      /// Exponential backoff
      waitTime = waitTime * exponentialFactor
      // See if the transaction is complete
      getTransactionResponse = await server.getTransaction(
        sendTransactionResponse.hash
        )
      }
      
  console.log("Transaction result is ", getTransactionResponse)
  if (
    getTransactionResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
  ) {
    console.error(
      `Waited ${secondsToWait} seconds for transaction to complete, but it did not. ` +
        `Returning anyway. Check the transaction status manually. ` +
        `Info: ${JSON.stringify(sendTransactionResponse, null, 2)}`
    )
  }

  return { ...getTransactionResponse, txHash: sendTransactionResponse.hash }
}
