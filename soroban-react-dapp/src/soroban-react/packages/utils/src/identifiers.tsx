import * as StellarSdk from 'stellar-sdk'

let xdr = StellarSdk.xdr

// export function accountIdentifier(account: string): SorobanClient.xdr.ScVal {
//     return xdr.ScVal.scvObject(
//       xdr.ScObject.scoVec([
//         xdr.ScVal.scvSymbol('Account'),
//         xdr.ScVal.scvObject(
//           xdr.ScObject.scoAccountId(xdr.PublicKey.publicKeyTypeEd25519(
//             SorobanClient.StrKey.decodeEd25519PublicKey(account)
//           ))
//         ),
//       ])
//     )
//   }

//   export function contractIdentifier(contractId: string): SorobanClient.xdr.ScVal {
//     return xdr.ScVal.scvObject(
//       xdr.ScObject.scoVec([
//         xdr.ScVal.scvSymbol('Contract'),
//         xdr.ScVal.scvObject(xdr.ScObject.scoBytes(
//             Buffer.from(contractId, 'hex')
//         )),
//       ])
//     )

//   }
