import * as StellarSdk from 'stellar-sdk'
import { SorobanRpc } from 'stellar-sdk'
import type {
  Memo,
  MemoType,
  Operation,
  Transaction as StellarSdkTransaction,
} from 'stellar-sdk'

export type Transaction = StellarSdk.Transaction | StellarSdk.FeeBumpTransaction
export type Tx = StellarSdkTransaction<Memo<MemoType>, Operation[]>
export type TxResponse = SorobanRpc.Api.GetTransactionResponse & {
  txHash: string
}
export type Simulation = SorobanRpc.Api.SimulateTransactionResponse
