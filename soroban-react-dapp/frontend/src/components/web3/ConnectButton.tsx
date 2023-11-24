import 'twin.macro'

import {WalletData} from "@soroban-react/wallet-data"
import {useSorobanReact} from "@soroban-react/core"


export const ConnectButton = () => {
  const sorobanContext = useSorobanReact()
  return <WalletData sorobanContext={sorobanContext}/>
}