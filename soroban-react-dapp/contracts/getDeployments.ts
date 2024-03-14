import deployments from './deployments.json'
import { ContractDeploymentInfo } from '@soroban-react/types'
export const getDeployments : () => ContractDeploymentInfo[] = () => {
    return deployments
}