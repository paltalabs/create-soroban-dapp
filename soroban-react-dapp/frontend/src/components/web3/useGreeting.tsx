import * as SorobanClient from 'soroban-client';
import { SorobanContextType } from '@soroban-react/core';
import { useContractValue } from '@soroban-react/contracts'

import contract_ids from '../../../../src/contract_ids.json'


export function scvalToString(value: SorobanClient.xdr.ScVal): string | undefined {
  return value.value()?.toString();
}

interface useGreetingProps {
  sorobanContext: SorobanContextType
}


export function useGreeting({sorobanContext}: useGreetingProps){
      let title_scval
      let title 
      let currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
      // console.log("useGreeting: currentChain: ", currentChain)
      // console.log("useGreeting: contract_ids[currentChain].title_id: ", contract_ids[currentChain]?.title_id)
      
      
      title_scval = useContractValue({ 
      contractAddress: (contract_ids as { [char: string]: {title_id:string} })[currentChain? currentChain: "standalone"]?.title_id,
      method: 'read_title',
      sorobanContext: sorobanContext
      })


      if(title_scval.result){
      title = title_scval.result && scvalToString(title_scval.result)?.replace("\u0000", "")
      // console.log("useGreeting: Reading the contract: title: ", title)
      return title
      }

      return 'useGreeting: wrong connection'
      
}