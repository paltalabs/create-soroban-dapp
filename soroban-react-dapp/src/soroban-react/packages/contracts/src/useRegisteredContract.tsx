import { useSorobanReact } from '../../core/src'
import {type ContractDeploymentInfo, type WrappedContract, type WrappedContractInvokeArgs} from '../../types/src'
import { contractInvoke,type InvokeArgs } from './contractInvoke'
import { useCallback, useEffect, useState } from 'react';

const getDeployment = (deployments: ContractDeploymentInfo[], contractId: string, networkPassphrase: string) => {
    let deployment = deployments.find((deployment) => {
      return (
        deployment.contractId.toLowerCase() === contractId.toLowerCase() &&
        deployment.networkPassphrase.toLowerCase() === (networkPassphrase || '').toLowerCase()
      )
    })
    if (!deployment) {
        throw new Error("Deployment not found")
    }
    else {
        return deployment
    }
}

export const useWrappedContract = (
    deploymentInfo: ContractDeploymentInfo
  ) => {
    const sorobanContext = useSorobanReact()
    const [wrappedContract, setwWrappedContract] = useState<WrappedContract | undefined>()
  
    const wrappedInvokeFunction = useCallback(async (args: WrappedContractInvokeArgs) => {
        const contractInvokeArgs: InvokeArgs ={
            ...args,
            sorobanContext,
            contractAddress: deploymentInfo.contractAddress
        }
        return contractInvoke(contractInvokeArgs)
    }, [sorobanContext, deploymentInfo])


    const createWrappedContract = () => {
      const newWrappedContract: WrappedContract = {
        deploymentInfo,
        invoke: wrappedInvokeFunction
      }
      setwWrappedContract(newWrappedContract)
    }
    useEffect(() => {
        createWrappedContract()
    }, [deploymentInfo, wrappedInvokeFunction])
  
    return wrappedContract
  }

/**
 * React Hook that returns a `WrappedContract` object configured with
 * the active context with the given deployment contract id which
 * is looked up from the deployments registry.
 */
export const useRegisteredContract = (contractId: string) => {
  const { deployments, activeChain } = useSorobanReact()

  let networkPassphrase = activeChain?.networkPassphrase || ''

  const deploymentInfo = getDeployment(deployments || [], contractId, networkPassphrase)

  return useWrappedContract(deploymentInfo)
}