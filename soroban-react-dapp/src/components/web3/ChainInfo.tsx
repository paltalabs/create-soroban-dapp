import { Card, Link } from '@chakra-ui/react'
import { useSorobanReact } from '@soroban-react/core'
import { type FC, useEffect, useState } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import 'twin.macro'

interface ChainInfo {
  Chain: string | undefined,
  PassPhrase: string,
  NetworkURL: string,
  sorobanURL: string | undefined
} 
export const ChainInfo: FC = () => {
  const sorobanContext = useSorobanReact();
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  const fetchChainInfo = () => {


    const chain = sorobanContext.activeChain ?? {name:"", networkPassphrase:"",networkUrl:"",sorobanRpcUrl:""}
    const chainInfo = {
      Chain: chain.name,
      PassPhrase: chain.networkPassphrase,
      NetworkURL: chain.networkUrl,
      sorobanURL: chain.sorobanRpcUrl
    }
    setChainInfo(chainInfo)
  }
  useEffect(fetchChainInfo, [sorobanContext])


  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">

        <Card variant="outline" p={4} bgColor="black">
          {Object.entries(chainInfo ?? {}).map(([key, value]:[string, string]) => (
            <div key={key} tw="text-sm leading-7">
              {key}:
              <strong tw="float-right ml-6 truncate max-w-[15rem]" title={value}>
                {value}
              </strong>
            </div>
          ))}

            {
              <Link
                href={"https://stellar.expert/explorer/testnet/"}
                target="_blank"
                tw="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                TestNet Explorer <HiOutlineExternalLink />
              </Link>
            }
            
        </Card>


      </div>
    </>
  )
}
