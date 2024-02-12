// import { ChainMetadata } from '@soroban-react/types'
// import React, { createContext } from 'react'

// import * as SorobanClient from 'soroban-client'

// export type EventCallback = (
//   event: SorobanClient.SorobanRpc.GetEventsResponse
// ) => void

// export interface EventSubscription {
//   contractId: string
//   topics: string[]
//   cb: EventCallback
//   id: number
//   lastLedgerStart?: number
//   pagingToken?: string
// }

// export interface SorobanEventsContextType {
//   subscribe: (subscription: EventSubscription) => number
//   unsubscribe: (subscriptionId: number) => void
//   subscriptions: Array<EventSubscription>
// }

// export const SorobanEventsContext = createContext<
//   SorobanEventsContextType | undefined
// >(undefined)

// export const DefaultSorobanEventsContext: SorobanEventsContextType = {
//   subscriptions: [],
//   subscribe: eventSubscription => {
//     for (const subscription of DefaultSorobanEventsContext.subscriptions) {
//       if (subscription.id == eventSubscription.id) {
//         return eventSubscription.id
//       }
//     }
//     DefaultSorobanEventsContext.subscriptions.push(eventSubscription)
//     return eventSubscription.id
//   },
//   unsubscribe: subscriptionId => {
//     const index = DefaultSorobanEventsContext.subscriptions.findIndex(
//       subscription => subscription.id == subscriptionId
//     )
//     if (index > -1) {
//       DefaultSorobanEventsContext.subscriptions.splice(index, 1)
//     }
//   },
// }
