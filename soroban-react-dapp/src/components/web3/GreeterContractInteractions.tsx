import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { type FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact, SorobanContextType } from "@soroban-react/core"
import * as SorobanClient from 'soroban-client';
import { contractInvoke } from '@soroban-react/contracts'

import contract_ids from 'contract/contract_ids.json'
import { useGreeting } from './useGreeting'
import React from 'react'

type UpdateGreetingValues = { newMessage: string }

function stringToScVal(title: string) {
  return SorobanClient.xdr.ScVal.scvString(title)
}

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()
  
  // const [greeterMessage, setGreeterMessage] = useState<string>()
  // const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()

  const {isWrongConnection, fetchedGreeting} = useGreeting({ sorobanContext })

  // // Fetch Greeting
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


  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues ) => {
    if (!activeChain || !address || !server) {
      console.log("No active chain")
      toast.error('Wallet not connected. Try again…')
      return
    }
    else {
      const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {
        const contractAddress = (contract_ids as { [char: string]: { title_id: string } })[currentChain]?.title_id;

        setUpdateIsLoading(true)

        const result = await contractInvoke({
          contractAddress,
          method: 'set_title',
          args: [stringToScVal(newMessage)],
          sorobanContext,
          signAndSend: true
        })
        
        if (result) {
          toast.success("New greeting successfully published!")
        }
        else {
          toast.error("Greeting unsuccessful...")
        }

        setUpdateIsLoading(false)

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
              placeholder={isWrongConnection? 'Network could not be connected' : fetchedGreeting}
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
                <Input disabled={!updateIsLoading && !isWrongConnection} {...register('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={!updateIsLoading && !isWrongConnection}
                isLoading={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Contract Address */}
        {/* <p tw="text-center font-mono text-xs text-gray-600">
          {contractAddress}
        </p> */}
      </div>
    </>
  )
}
