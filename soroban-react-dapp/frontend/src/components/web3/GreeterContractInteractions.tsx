import { ContractIds } from '@/deployments/deployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact, SorobanContextType } from "@soroban-react/core"
import * as SorobanClient from 'soroban-client';
import { useContractValue } from '@soroban-react/contracts'
import { contractTransaction, useSendTransaction } from '@soroban-react/contracts'


import contract_ids from '../../../../src/contract_ids.json'
import { useGreeting } from './useGreeting'
import React from 'react'
import { title } from 'process'

type UpdateGreetingValues = { newMessage: string }

function stringToScVal(title: string) {
  return SorobanClient.xdr.ScVal.scvString(title)
}

export const GreeterContractInteractions: FC = () => {
  // const { api, activeAccount, activeSigner } = useInkathon()
  const sorobanContext = useSorobanReact()
  
  // const [greeterMessage, setGreeterMessage] = useState<string>()
  // const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const { register, reset, handleSubmit } = useForm<UpdateGreetingValues>()

  const myGreeting = useGreeting({ sorobanContext })

  // Fetch Greeting
  // const fetchGreeting = async () => {
  //   if (!contract || !sorobanContext.server) return

  //   setFetchIsLoading(true)
  //   try {
  //     // const result = await contractQuery(api, '', contract, 'greet')

  //     const { output, isError, decodedOutput } = decodeOutput(result, contract, 'greet')
  //     if (isError) throw new Error(decodedOutput)
  //     setGreeterMessage(output)
  //   } catch (e) {
  //     console.error(e)
  //     toast.error('Error while fetching greeting. Try again…')
  //     setGreeterMessage(undefined)
  //   } finally {
  //     setFetchIsLoading(false)
  //   }
  // }
  // useEffect(() => {
  //   fetchGreeting()
  // }, [contract])

  // // Update Greeting
  // const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
  //   if (!activeAccount || !contract || !activeSigner || !api) {
  //     toast.error('Wallet not connected. Try again…')
  //     return
  //   }

  //   // Send transaction
  //   setUpdateIsLoading(true)
  //   try {
  //     // await contractTxWithToast(api, activeAccount.address, contract, 'setMessage', {}, [
  //     //   newMessage,
  //     // ])
  //     reset()
  //   } catch (e) {
  //     console.error(e)
  //   } finally {
  //     setUpdateIsLoading(false)
  //     fetchGreeting()
  //   }
  // }

  // if (!api) return null

  const { sendTransaction } = useSendTransaction()
  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues ) => {
    if (!activeChain || !address || !server) {
      console.log("No active chain")
      toast.error('Wallet not connected. Try again…')
      return
    }
    else {
      let currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {
        let contractId = (contract_ids as { [char: string]: { title_id: string } })[currentChain]?.title_id;
        const source = await server.getAccount(address)

        let transaction = contractTransaction({
          networkPassphrase: activeChain.networkPassphrase,
          source: source,
          contractAddress: contractId,
          method: 'set_title',
          args: [stringToScVal(newMessage)]
        })

        setUpdateIsLoading(true)

        let result = await sendTransaction(transaction, { sorobanContext })
        
        setUpdateIsLoading(false)

        console.log("handleSetNewGreeting: result: ", result)
        sorobanContext.connect();
      }
    }
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
              // placeholder={fetchIsLoading || !contract ? 'Loading…' : greeterMessage}
              placeholder={myGreeting}
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
                isLoading={updateIsLoading}
                disabled={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">
          {/* {contract ? contractAddress : 'Loading…'} */}
        </p>
      </div>
    </>
  )
}
