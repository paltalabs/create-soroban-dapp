import React from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useSorobanReact } from '@soroban-react/core';
import 'twin.macro';

interface ConnectButtonProps {
  network: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ network }) => {
  const { address, connect, disconnect, isLoading } = useSorobanReact();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet', error);
    }
  };

  return (
    <Button
      onClick={address ? handleDisconnect : handleConnect}
      isLoading={isLoading}
      colorScheme={address ? 'red' : 'blue'}
      tw="mt-4"
    >
      {address ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet'}
      {isLoading && <Spinner size="sm" tw="ml-2" />}
    </Button>
  );
};
