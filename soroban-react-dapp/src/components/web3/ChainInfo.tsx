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
  // const { api, activeChain } = 
  const [chainInfo, setChainInfo] = useState<ChainInfo>()

  // Fetch Chain Info
  const fetchChainInfo = () => {
    // if (!api) {
    //   setChainInfo(undefined)
    //   return
    // }

    const chain = sorobanContext.activeChain ?? {name:"", networkPassphrase:"",networkUrl:"",sorobanRpcUrl:""}
    // const version = (await api.rpc.system.version())?.toString() || ''
    // const properties = ((await api.rpc.system.properties())?.toHuman() as any) || {}
    // const tokenSymbol = properties?.tokenSymbol?.[0] || 'UNIT'
    // const tokenDecimals = properties?.tokenDecimals?.[0] || 12
    const chainInfo = {
      Chain: chain.name,
      PassPhrase: chain.networkPassphrase,
      NetworkURL: chain.networkUrl,
      sorobanURL: chain.sorobanRpcUrl
      // Token: `${tokenSymbol} (${tokenDecimals} Decimals)`,
    }
    setChainInfo(chainInfo)
  }
  useEffect(fetchChainInfo, [sorobanContext])

  // Connection Loading Indicator
  // if (!api)
  //   return (
  //     <div tw="mt-8 mb-4 flex flex-col items-center justify-center space-y-3 text-center font-mono text-sm text-gray-400 sm:(flex-row space-x-3 space-y-0)">
  //       <Spinner size="sm" />
  //       <div>
  //         Connecting to {activeChain?.name} ({activeChain?.rpcUrls?.[0]})
  //       </div>
  //     </div>
  //   )

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Chain Info</h2>

        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          {/* Metadata */}
          {Object.entries(chainInfo ?? {}).map(([key, value]:[string, string]) => (
            <div key={key} tw="text-sm leading-7">
              {key}:
              <strong tw="float-right ml-6 truncate max-w-[15rem]" title={value}>
                {value}
              </strong>
            </div>
          ))}

          {/* <div tw="mt-3 flex items-center justify-center space-x-3"> */}
            {/* Explorer Link */}
            {
              <Link
                href={"https://stellar.expert/explorer/testnet/"}
                target="_blank"
                tw="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                TestNet Explorer <HiOutlineExternalLink />
              </Link>
            }
            {/* Faucet Link */}
            {/* {!!activeChain?.faucetUrls?.length && (
              <Link
                href={activeChain.faucetUrls[0]}
                target="_blank"
                tw="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                Faucet <HiOutlineExternalLink />
              </Link>
            )} */}
            {/* Contracts UI Link */}
            {/* {!!activeChain?.rpcUrls?.length && (
              <Link
                href={`https://contracts-ui.substrate.io/?rpc=${activeChain.rpcUrls[0]}`}
                target="_blank"
                tw="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
              >
                Contracts UI <HiOutlineExternalLink />
              </Link>
            )} */}
          {/* </div> */}
        </Card>

        {/* Mainnet Security Disclaimer */}
        {/* {!activeChain?.testnet && (
          <>
            <h2 tw="text-center font-mono text-red-400">Security Disclaimer</h2>

            <Card variant="outline" p={4} bgColor="red.500" borderColor="red.300" fontSize={'sm'}>
              You are interacting with un-audited mainnet contracts and risk all your funds. Never
              transfer tokens to this contract.
            </Card>
          </>
        )} */}
      </div>
    </>
  )
}
