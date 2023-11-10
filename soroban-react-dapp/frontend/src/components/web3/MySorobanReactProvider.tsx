import React from 'react'
import {SorobanReactProvider} from '/home/ben/stellar/paltalabsdev/soroban-react/packages/core';
import {futurenet, sandbox, standalone} from '/home/ben/stellar/paltalabsdev/soroban-react/packages/chains';
import {freighter} from '/home/ben/stellar/paltalabsdev/soroban-react/packages/freighter';
import {ChainMetadata, Connector} from "/home/ben/stellar/paltalabsdev/soroban-react/packages/types";
import { Server } from 'soroban-client';
      
const chains: ChainMetadata[] = [sandbox, standalone, futurenet];
const connectors: Connector[] = [freighter()]
                          
                          
export default function MySorobanReactProvider({children}:{children: React.ReactNode}) {
    return (
      <SorobanReactProvider
        chains={chains}
        appName={"Example Stellar App"}
        activeChain={standalone}
        server={new Server('http://localhost:8000/soroban/rpc',{allowHttp:true})}
        connectors={connectors}>
          {children}
      </SorobanReactProvider>
    )
  }