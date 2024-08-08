import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSorobanReact } from '@soroban-react/core';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { useRegisteredContract } from '@soroban-react/contracts';

type UpdateGreetingValues = { newMessage: string };

interface GreeterContractInteractionsProps {
  network: string;
}

export const GreeterContractInteractions: React.FC<GreeterContractInteractionsProps> = ({ network }) => {
  const sorobanContext = useSorobanReact();
  const [, setFetchIsLoading] = useState<boolean>(false);
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<UpdateGreetingValues>();
  const [fetchedGreeting, setGreeterMessage] = useState<string>();
  const [updateFrontend, toggleUpdate] = useState<boolean>(true);
  const [contractAddressStored, setContractAddressStored] = useState<string>();

  const contract = useRegisteredContract("greeting");

  const fetchGreeting = useCallback(async () => {
    if (!sorobanContext.server) return;

    const chain = sorobanContext.activeChain;
    if (!chain?.name) {
      console.log("No active chain");
      toast.error('Wallet not connected. Try again…');
      return;
    } else {
      const contractAddress = contract?.deploymentInfo.contractAddress;
      setContractAddressStored(contractAddress);
      setFetchIsLoading(true);
      try {
        const result = await contract?.invoke({
          method: 'read_title',
          args: []
        });

        if (!result) return;

        const resultString = nativeToScVal(result as any) as string;
        setGreeterMessage(resultString);
      } catch (e) {
        console.error(e);
        toast.error('Error while fetching greeting. Try again…');
        setGreeterMessage(undefined);
      } finally {
        setFetchIsLoading(false);
      }
    }
  }, [sorobanContext, contract]);

  useEffect(() => { void fetchGreeting(); }, [updateFrontend, fetchGreeting]);

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!sorobanContext.address) {
      console.log("Address is not defined");
      toast.error('Wallet is not connected. Try again...');
      return;
    } else if (!sorobanContext.server) {
      console.log("Server is not setup");
      toast.error('Server is not defined. Unable to connect to the blockchain');
      return;
    } else {
      const chain = sorobanContext.activeChain;
      if (!chain?.name) {
        console.log("No active chain");
        toast.error('Wallet not connected. Try again…');
        return;
      } else {
        setUpdateIsLoading(true);
        try {
          const result = await contract?.invoke({
            method: 'set_title',
            args: [nativeToScVal(newMessage, { type: "string" })],
            signAndSend: true
          });
          console.log('🚀 « result:', result);
          
          toast.success("New greeting successfully published!");
        } catch (e) {
          console.error(e);
          toast.error('Error while sending tx. Try again…');
        } finally {
          setUpdateIsLoading(false);
          toggleUpdate(!updateFrontend);
        }
      }
    }
  };

  if (!contract) {
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <p tw="text-center font-mono text-sm">No deployment found in the current chain</p>
          <p tw="text-center font-mono text-lg mt-4">Available deployments:</p>
          {sorobanContext?.deployments?.map((d, i) => (
            <p key={i} tw="text-center font-mono text-sm">- {d.networkPassphrase}</p>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
      <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>
      <Card variant="outline" p={4} bgColor="whiteAlpha.100">
        <FormControl>
          <FormLabel>Fetched Greeting</FormLabel>
          <Input
            placeholder={fetchedGreeting}
            disabled={true}
          />
        </FormControl>
      </Card>
      <Card variant="outline" p={4} bgColor="whiteAlpha.100">
        <form onSubmit={handleSubmit(updateGreeting)}>
          <Stack direction="row" spacing={2} align="end">
            <FormControl>
              <FormLabel>Update Greeting</FormLabel>
              <Input disabled={updateIsLoading} {...register('newMessage')} />
            </FormControl>
            <Button type="submit" colorScheme="blue" isLoading={updateIsLoading}>
              Update
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  );
};
