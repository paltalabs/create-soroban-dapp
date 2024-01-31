// import { useSorobanReact, SorobanContextType } from '@soroban-react/core'
// import React, { useEffect, useRef } from 'react'

// import * as SorobanClient from 'soroban-client'

// import {
//   SorobanEventsContext,
//   DefaultSorobanEventsContext,
// } from './SorobanEventsContext'

// let xdr = SorobanClient.xdr

// export interface SorobanEventsProviderProps {
//   children: React.ReactNode
// }

// export function SorobanEventsProvider({
//   children,
// }: SorobanEventsProviderProps) {
//   const pollInterval = 5000
//   const sorobanContext: SorobanContextType = useSorobanReact()

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout | null = null
//     let stop = false

//     async function pollEvents(): Promise<void> {
//       try {
//         if (!sorobanContext.server) {
//           console.debug('RPC events: Not connected to server')
//           return
//         }

//         for (const subscription of DefaultSorobanEventsContext.subscriptions) {
//           if (!subscription.lastLedgerStart) {
//             let latestLedgerState =
//               await sorobanContext.server.getLatestLedger()
//             subscription.lastLedgerStart = latestLedgerState.sequence
//           }

//           const subscriptionTopicXdrs: Array<string> = []
//           subscription.topics &&
//             subscription.topics.forEach(topic => {
//               subscriptionTopicXdrs.push(
//                 xdr.ScVal.scvSymbol(topic).toXDR('base64')
//               )
//             })

//           // TODO: updated js-soroban-client to include latestLedger
//           interface GetEventsWithLatestLedger
//             extends SorobanClient.SorobanRpc.GetEventsResponse {
//             latestLedger?: string
//           }

//           // TODO: use rpc batch for single round trip, each subscription can be one
//           // getEvents request in the batch, is that possible now?
//           let response = (await sorobanContext.server.getEvents({
//             startLedger: !subscription.pagingToken
//               ? subscription.lastLedgerStart
//               : undefined,
//             cursor: subscription.pagingToken,
//             filters: [
//               {
//                 contractIds: [subscription.contractId],
//                 topics: [subscriptionTopicXdrs],
//                 type: 'contract',
//               },
//             ],
//             limit: 10,
//           })) as GetEventsWithLatestLedger

//           delete subscription.pagingToken
//           if (response.latestLedger) {
//             subscription.lastLedgerStart = parseInt(response.latestLedger)
//           }
//           response.events &&
//             response.events.forEach(event => {
//               try {
//                 subscription.cb(event)
//               } catch (error) {
//                 console.error(
//                   'Poll Events: subscription callback had error: ',
//                   error
//                 )
//               } finally {
//                 subscription.pagingToken = event.pagingToken
//               }
//             })
//         }
//       } catch (error) {
//         console.error('Poll Events: error: ', error)
//       } finally {
//         if (!stop) {
//           timeoutId = setTimeout(pollEvents, pollInterval)
//         }
//       }
//     }

//     pollEvents()

//     return () => {
//       if (timeoutId != null) clearTimeout(timeoutId)
//       stop = true
//     }
//   }, [sorobanContext])

//   return (
//     <SorobanEventsContext.Provider value={DefaultSorobanEventsContext}>
//       {children}
//     </SorobanEventsContext.Provider>
//   )
// }
