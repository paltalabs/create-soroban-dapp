import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal, xdr } from '@stellar/stellar-sdk'

type UpdateGreetingValues = { newMessage: string }

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()

  // Two options are existing for fetching data from the blockchain
  // The first consists on using the useContractValue hook demonstrated in the useGreeting.tsx file
  // This hook simulate the transation to happen on the bockchain and allow to read the value from it
  // Its main advantage is to allow for updating the value display on the frontend without any additional action
  // const {isWrongConnection, fetchedGreeting} = useGreeting({ sorobanContext })

  // The other option, maybe simpler to understand and implement is the one implemented here
  // Where we fetch the value manually with each change of the state.
  // We trigger the fetch with flipping the value of updateFrontend or refreshing the page

  const [fetchedGreeting, setGreeterMessage] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  // Retrieve the deployed contract object from contract Registry
  const contract = useRegisteredContract("greeting")

  // Fetch Greeting
  const fetchGreeting = useCallback(async () => {
    if (!sorobanContext.server) return

    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      console.log("No active chain")
      toast.error('Wallet not connected. Try again…')
      return
    }
    else {
      const contractAddress = contract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      try {
        const result = await contract?.invoke({
          method: 'read_title',
          args: []
        })

        if (!result) return

        // Value needs to be cast into a string as we fetch a ScVal which is not readable as is.
        // You can check out the scValConversion.tsx file to see how it's done
        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string
        setGreeterMessage(result_string)
      } catch (e) {
        console.error(e)
        toast.error('Error while fetching greeting. Try again…')
        setGreeterMessage(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  }, [sorobanContext, contract])

  useEffect(() => { void fetchGreeting() }, [updateFrontend, fetchGreeting])


  const { activeChain, server, address, activeConnector } = sorobanContext

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!address || !server || !activeChain || !activeConnector) {
      toast.error('Wallet not connected or missing configuration. Try again...');
      return;
    }
  
    setUpdateIsLoading(true);
  
    try {
      const account = await server.getAccount(address);
      
      const contract = new StellarSdk.Contract(contractAddressStored || '');
      const tx = new StellarSdk.TransactionBuilder(account, { 
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: activeChain.networkPassphrase
      })
        .addOperation(contract.call("set_title", nativeToScVal(newMessage, {type: "string"})))
        .setTimeout(30)
        .build();
  
      // Simulate the transaction
      const simulation = await server.simulateTransaction(tx);
      
      if ('results' in simulation) {
        // Instead of assembleTransaction, prepare the transaction for signing
        const preparedTransaction = tx; // Use the built transaction directly
  
        const signedTransaction = await activeConnector.signTransaction(
          preparedTransaction.toXDR(),
          { networkPassphrase: activeChain.networkPassphrase }
        );
        
        const txResponse = await server.sendTransaction(StellarSdk.TransactionBuilder.fromXDR(signedTransaction, activeChain.networkPassphrase));
        
        if (txResponse.status === "PENDING") {
          let txResult = await server.getTransaction(txResponse.hash);
          
          while (txResult.status === "NOT_FOUND") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            txResult = await server.getTransaction(txResponse.hash);
          }
          
          if (txResult.status === "SUCCESS") {
            toast.success("New greeting successfully published!");
            toggleUpdate(!updateFrontend);
          } else {
            toast.error("Transaction failed. Please try again.");
          }
        }
      } else {
        console.error('Transaction simulation failed:', simulation);
        toast.error('Transaction simulation failed. Please try again.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error while sending tx. Try again…');
    } finally {
      setUpdateIsLoading(false);
    }
  };



  if (!contract) {
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <p tw="text-center font-mono text-sm">No deployment found in the current chain</p>
          <p tw="text-center font-mono text-lg mt-4">Available deployments:</p>
          {
            sorobanContext?.deployments?.map((d, i) => (
              <p key={i} tw="text-center font-mono text-sm">- {d.networkPassphrase}</p>
            ))
          }
        </Card>
      </div>
    )
  }

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Fetched Greeting</FormLabel>
            <Input
              placeholder={fetchedGreeting}
              disabled={true}
            />
          </FormControl>
        </Card>

        {/* Update Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleSubmit(updateGreeting)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Update Greeting</FormLabel>
                <Input disabled={updateIsLoading} {...register('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={updateIsLoading}
                isLoading={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">

          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."}
        </p>
      </div>
    </>
  )
}