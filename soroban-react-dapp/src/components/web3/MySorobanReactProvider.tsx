import React from 'react'
import {SorobanReactProvider} from '@/soroban-react/packages/core/src';
import {futurenet, sandbox, standalone,testnet} from '@/soroban-react/packages/chains/src';
import {freighter} from '@/soroban-react/packages/freighter/src';
import type {ChainMetadata, Connector} from "@/soroban-react/packages/types/src";
import { xbull } from '@/soroban-react/packages/xbull/src';

import { getDeployments } from 'contractRegistry/getDeployments';
      
const chains: ChainMetadata[] = [sandbox, standalone, futurenet,testnet];
const connectors: Connector[] = [freighter(), xbull()]


export default function MySorobanReactProvider({children}:{children: any}) {

    return (
      <SorobanReactProvider
        chains={chains}
        appName={"Example Stellar App"}
        activeChain={testnet}
        connectors={connectors}
        deployments={getDeployments()}>
          {children}
      </SorobanReactProvider>
    )
  }