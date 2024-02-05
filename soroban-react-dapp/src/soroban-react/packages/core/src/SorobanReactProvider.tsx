import { Connector, WalletChain } from '@soroban-react/types'
import React, { useRef } from 'react'

import * as StellarSdk from 'stellar-sdk'

import { SorobanContext, SorobanContextType, defaultSorobanContext } from '.'

/**
 * @param children - A React subtree that needs access to the context.
 */

export interface SorobanReactProviderProps {
  appName?: string
  autoconnect?: boolean
  chains: WalletChain[]
  activeChain?: WalletChain // To set on frontend to define the default chain for read-only. Example: standalone
  children: React.ReactNode
  connectors: Connector[]
  server?: StellarSdk.SorobanRpc.Server // To set on frontend to define the default server url for read-only. Example 'new Server('http://localhost:8000/soroban/rpc',{allowHttp:true})'
  serverHorizon?: StellarSdk.Horizon.Server
}

function networkToActiveChain(networkDetails: any, chains: any) {
  const supported =
    networkDetails &&
    chains.find(
      (c: any) => c.networkPassphrase === networkDetails?.networkPassphrase
    )
  const activeChain = networkDetails && {
    id: supported?.id ?? networkDetails.networkPassphrase,
    name: supported?.name ?? networkDetails.network,
    networkPassphrase: networkDetails.networkPassphrase,
    iconBackground: supported?.iconBackground,
    iconUrl: supported?.iconUrl,
    unsupported: !supported,
    networkUrl: networkDetails.networkUrl,
    sorobanRpcUrl: networkDetails.sorobanRpcUrl,
  }
  return activeChain
}

function fromURLToServer(sorobanRpcUrl: string): StellarSdk.SorobanRpc.Server {
  return new StellarSdk.SorobanRpc.Server(sorobanRpcUrl, {
    allowHttp: sorobanRpcUrl.startsWith('http://'),
  })
}

function fromURLToHorizonServer(networkUrl: string): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(networkUrl, {
    allowHttp: networkUrl.startsWith('http://'),
  })
}

export function SorobanReactProvider({
  appName,
  autoconnect = false,
  chains,
  activeChain = defaultSorobanContext.activeChain, // Non mandatory fields default to default Context fields value
  children,
  connectors,
  // server = defaultSorobanContext.server, // Non mandatory fields default to default Context fields value
  // serverHorizon = defaultSorobanContext.serverHorizon,
}: SorobanReactProviderProps) {
  const activeConnector = connectors.length && connectors.length > 1 ? connectors[1] : connectors[0]
  // const activeConnector = undefined
  const isConnectedRef = useRef(false)
  console.log("SorobanReactProvider is RELOADED")
  let server: StellarSdk.SorobanRpc.Server | undefined = defaultSorobanContext.server, serverHorizon : StellarSdk.Horizon.Server | undefined= defaultSorobanContext.serverHorizon
  if (activeChain?.sorobanRpcUrl) {
    server = fromURLToServer(activeChain.sorobanRpcUrl)
  }

  if (activeChain?.networkUrl) {
    serverHorizon = fromURLToHorizonServer(activeChain.networkUrl)
  }

  const [mySorobanContext, setSorobanContext] =
    React.useState<SorobanContextType>({
      ...defaultSorobanContext,
      appName,
      autoconnect,
      chains,
      connectors,
      activeConnector,
      activeChain,
      server,
      serverHorizon,
      connect: async () => {
        console.log("ENTERING CONNECT with context: ",mySorobanContext)
        if (mySorobanContext.activeConnector) {
          // Now we will check if the wallet is freighter so that we keep the old way of choosing the network from the wallet for backward compatibility
          if (mySorobanContext.activeConnector.id === "freighter") {
            let networkDetails =
            await mySorobanContext.activeConnector.getNetworkDetails()
            let activeChain = networkToActiveChain(networkDetails, chains)
  
            
            if (
              !chains.find(
                (c: any) =>
                c.networkPassphrase === networkDetails?.networkPassphrase
                )
            ) {
              const error = new Error(
                'Your Wallet network is not supported in this app'
                )
                throw error
              }

            if (!networkDetails?.sorobanRpcUrl) {
              const error = new Error(
                'Soroban RPC URL is not set, please check your freighter wallet network configuration'
              )
              throw error
            }
  
            server =
              networkDetails &&
              new StellarSdk.SorobanRpc.Server(networkDetails.sorobanRpcUrl, {
                allowHttp: networkDetails.sorobanRpcUrl.startsWith('http://'),
              })
  
            serverHorizon =
              networkDetails &&
              new StellarSdk.Horizon.Server(networkDetails.networkUrl, {
                allowHttp: networkDetails.networkUrl.startsWith('http://'),
              })
          
            console.log("SorobanReactProvider: Connecting with FREIGHTER : ", mySorobanContext.activeConnector.name)
            let address = await mySorobanContext.activeConnector.getPublicKey()
        
  
  
            // Now we can track that the wallet is finally connected
            isConnectedRef.current = true
  
            setSorobanContext((c: any) => ({
              ...c,
              activeChain,
              address,
              server,
              serverHorizon,
            }))
          }
          // If connector is any other wallet that does not have getNetworkDetails we will need to set the active chain and server from somewehere else in the front end
          else { 
              console.log("SorobanReactProvider: Connecting with ", mySorobanContext.activeConnector.name)
              let address = await mySorobanContext.activeConnector.getPublicKey()
    
              // Now we can track that the wallet is finally connected
              isConnectedRef.current = true
    
              setSorobanContext((c: any) => ({
                ...c,
                address,
              }))
          }
      }
      else {
        console.log("SorobanReactProvider: No active Connector")
      }
      },
      disconnect: async () => {
        isConnectedRef.current = false
        // TODO: Maybe reset address to undefined
        // TODO: Handle other things here, such as perhaps resetting address to undefined.
        let address: string | undefined = undefined
        setSorobanContext((c: any) => ({
          ...c,
          address
        }))
      },

      setActiveChain: (chain: WalletChain) => {
        console.log('Chainging activeChain to : ', chain)
        // When the user in frontend changes the activeChain to read the blockchain without wallet
        let server: StellarSdk.SorobanRpc.Server | undefined = undefined, serverHorizon : StellarSdk.Horizon.Server | undefined= undefined
        activeChain = chain
        if (activeChain.sorobanRpcUrl) {
          server = fromURLToServer(activeChain.sorobanRpcUrl)
        }

        if (activeChain.networkUrl) {
          serverHorizon = fromURLToHorizonServer(activeChain.networkUrl)
        }
        setSorobanContext((c: any) => ({
          ...c,
          server,
          serverHorizon,
          activeChain,
        }))
      },

      setActiveConnectorAndConnect: async (connector: Connector) => {
        console.log("Changing connector to ", connector.name)
        let activeConnector = connector
        console.log("SorobanReactProvider: Changing connector")
        // We better connect here otherwise in the frontend the context is not updated fast enough, and the user connects to the old connector first.
        let address = await activeConnector.getPublicKey()
        isConnectedRef.current = true
        setSorobanContext((c: any) => ({
          ...c,
          activeConnector,
          address
        }))
      }
    })

    console.log("SorobanReactProvider: Active connector is ", mySorobanContext.activeConnector?.name)

  // Handle changes of address in "realtime"
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    // If it turns out that requesting an update from Freighter is too taxing,
    // then this could be increased. Humans perceive 100ms response times as instantaneous
    // (source: https://www.pubnub.com/blog/how-fast-is-realtime-human-perception-and-technology/)
    // but you also have to consider the re-render time of components.
    const freighterCheckIntervalMs = 200

    async function checkForAddressChanges() {
      // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
      if (
        !mySorobanContext.activeConnector ||
        !mySorobanContext.activeConnector.isConnected() ||
        !isConnectedRef.current ||
        !mySorobanContext.activeChain
      )
        return
      // For now we can only do this with freighter. xBull doesn't handle the repeated call well.
      else if (mySorobanContext.activeConnector.id !== "freighter") {
        return
      }
      else {
        let hasNoticedWalletUpdate = false

        try {
          
          // NOTICE: If the user logs out from or uninstalls the Freighter extension while they are connected
        // on this site, then a dialog will appear asking them to sign in again. We need a way to ask Freighter
        // if there is _any_ connected user, without actually asking them to sign in. Unfortunately, that is not
        // supported at this time; but it would be easy to submit a PR to the extension to add support for it.
        let address = await mySorobanContext.activeConnector?.getPublicKey()
        
        // TODO: If you want to know when the user has disconnected, then you can set a timeout for getPublicKey.
        // If it doesn't return in X milliseconds, you can be pretty confident that they aren't connected anymore.
        
        if (mySorobanContext.address !== address) {
          console.log(
            'SorobanReactProvider: address changed from:',
            mySorobanContext.address,
            ' to: ',
            address
            )
            hasNoticedWalletUpdate = true
            
            console.log('SorobanReactProvider: reconnecting')
            setSorobanContext((c: any) => ({
              ...c,
              address,
            }))
          } 
        } catch (error) {
          // I would recommend keeping the try/catch so that any exceptions in this async function
          // will get handled. Otherwise React could complain. I believe that eventually it may cause huge
          // problems, but that might be a NodeJS specific approach to exceptions not handled in promises.

        console.error('SorobanReactProvider: error: ', error)
      } finally {
        if (!hasNoticedWalletUpdate)
        timeoutId = setTimeout(
            checkForAddressChanges,
            freighterCheckIntervalMs
          )
      }
    }
    }
    
    checkForAddressChanges()
    
    return () => {
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [mySorobanContext])

  // Handle changes of network in "realtime" if getNetworkDetails exists
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const freighterCheckIntervalMs = 200

    async function checkForNetworkChanges() {
      // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
      if (
        !mySorobanContext.activeConnector ||
        !mySorobanContext.activeConnector.isConnected() ||
        !isConnectedRef.current ||
        !mySorobanContext.activeChain
      )
        return
      // For now we can only do this with freighter. xBull doesn't have the getNetworkDetails method exposed.
      else if (mySorobanContext.activeConnector.id !== "freighter") {
        return
      }
      else {

        let hasNoticedWalletUpdate = false
  
        try {

          let networkDetails = await mySorobanContext.activeConnector.getNetworkDetails()
          let newActiveChain = networkToActiveChain(networkDetails, chains)
  
          // We check that we have a valid network details and not a blank one like the one xbull connector would return
          if (networkDetails.network && newActiveChain.networkPassphrase !== mySorobanContext.activeChain.networkPassphrase) {
            console.log(
              'SorobanReactProvider: network changed from:',
              mySorobanContext.activeChain.networkPassphrase,
              ' to: ',
              newActiveChain.networkPassphrase
            )
            hasNoticedWalletUpdate = true
  

            mySorobanContext.setActiveChain && mySorobanContext.setActiveChain(newActiveChain)
          } 
        } catch (error) {
  
          console.error('SorobanReactProvider: error: ', error)
        } finally {
          if (!hasNoticedWalletUpdate)
            timeoutId = setTimeout(
              checkForNetworkChanges,
              freighterCheckIntervalMs
            )
        }
      }
    }

    checkForNetworkChanges()

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [mySorobanContext])
  
  // TODO: ASSESS THE USE OF THIS
  // React.useEffect(() => {
  //   if (mySorobanContext.address) return // If we already have access to the connector's address, we are OK
  //   if (!mySorobanContext.activeConnector) return // If there is not even an activeConnector, we don't need to continue

  //   // activeConnector.isConnected() means that the connector is installed (even if not allowed, even if locked)
  //   // Hence, here we want to connect automatically if autoconnect is true && if activeConnector is installed
  //   if (
  //     mySorobanContext.autoconnect &&
  //     mySorobanContext.activeConnector.isConnected()
  //   ) {
  //     // TODO: When the page loads, autoconnect==true and the user is not signed in, this gets called twice
  //     // (due to the sorobanContext.activeConnector being seen as different by React), which causes
  //     // the Wallet window to appear twice.
  //     // An easy approach will be to use a ref in the connect function so that if it's already
  //     // trying to connect from somewhere else, then it doesn't try again
  //     // (since getPublicKey is what is causing the popup to appear)
  //     // This should be programmed in every connector for every get function
  //     mySorobanContext.connect()
  //   }
  // }, [mySorobanContext.activeConnector, mySorobanContext.autoconnect])

  return (
    <SorobanContext.Provider value={mySorobanContext}>
      {children}
    </SorobanContext.Provider>
  )
}
