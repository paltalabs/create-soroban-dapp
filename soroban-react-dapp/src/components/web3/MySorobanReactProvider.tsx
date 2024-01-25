import React from 'react'
import {SorobanReactProvider} from '@/soroban-react/packages/core/src';
import {futurenet, sandbox, standalone,testnet} from '@soroban-react/chains';
import {freighter} from '@soroban-react/freighter';
import type {ChainMetadata, Connector} from "@soroban-react/types";
import { xbull } from '@/soroban-react/packages/xbull/src';
      
const chains: ChainMetadata[] = [sandbox, standalone, futurenet,testnet];
const connectors: Connector[] = [freighter(), xbull()]


export default function MySorobanReactProvider({children}:{children: React.ReactNode}) {

    return (
      <SorobanReactProvider
        chains={chains}
        appName={"Example Stellar App"}
        activeChain={testnet}
        connectors={connectors}>
          {children}
      </SorobanReactProvider>
    )
  }