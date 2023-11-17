import React from 'react'
import {SorobanReactProvider} from '@soroban-react/core';
import {futurenet, sandbox, standalone} from '@soroban-react/chains';
import {freighter} from '@soroban-react/freighter';
import {ChainMetadata, Connector} from "@soroban-react/types";
import { Server } from 'soroban-client';
      
const chains: ChainMetadata[] = [sandbox, standalone, futurenet];
const connectors: Connector[] = [freighter()]
                          
                          
export default function MySorobanReactProvider({children}:{children: React.ReactNode}) {
    return (
      <SorobanReactProvider
        chains={chains}
        appName={"Example Stellar App"}
        activeChain={standalone}
        // server={new Server('http://localhost:8000/soroban/rpc',{allowHttp:true})}
        connectors={connectors}>
          {children}
      </SorobanReactProvider>
    )
  }