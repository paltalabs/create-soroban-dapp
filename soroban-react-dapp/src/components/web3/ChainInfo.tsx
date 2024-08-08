import React, { useEffect, useState } from 'react';
import { Card, Link } from '@chakra-ui/react';
import { useSorobanReact } from '@soroban-react/core';
import 'twin.macro';

interface ChainInfo {
  Chain: string | undefined;
  PassPhrase: string;
  NetworkURL: string;
  sorobanURL: string | undefined;
}

export const ChainInfo: React.FC = () => {
  const sorobanContext = useSorobanReact();
  const [chainInfo, setChainInfo] = useState<ChainInfo>();

  useEffect(() => {
    const fetchChainInfo = () => {
      const chain = sorobanContext.activeChain ?? { name: "", networkPassphrase: "", networkUrl: "", sorobanRpcUrl: "" };
      const chainInfo = {
        Chain: chain.name,
        PassPhrase: chain.networkPassphrase,
        NetworkURL: chain.networkUrl,
        sorobanURL: chain.sorobanRpcUrl,
      };
      setChainInfo(chainInfo);
    };

    fetchChainInfo();
  }, [sorobanContext.activeChain]);

  return (
    <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
      <h2 tw="text-center font-mono text-gray-400">Chain Info</h2>
      <Card variant="outline" p={4} bgColor="whiteAlpha.100">
        {Object.entries(chainInfo ?? {}).map(([key, value]: [string, string]) => (
          <div key={key} tw="text-sm leading-7">
            {key}:
            <strong tw="float-right ml-6 truncate max-w-[15rem]" title={value}>
              {value}
            </strong>
          </div>
        ))}
        <Link
          href={"https://stellar.expert/explorer/testnet/"}
          target="_blank"
          tw="flex items-center justify-center gap-1 text-center text-sm text-gray-400 hover:text-white"
        >
          TestNet Explorer
        </Link>
      </Card>
    </div>
  );
};
