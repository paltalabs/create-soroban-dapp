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

type UpdateGreetingValues = { 
  name: string, 
  email: string, 
  skills: string, 
  experience: string, 
  education: string 
}

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()

  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()
  
  const [fetchedGreeting, setGreeterMessage] = useState<string>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  const contract = useRegisteredContract("cv")

  const fetchGreeting = useCallback(async () => {
    if (!sorobanContext.server) return

    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      console.log("No active chain")
      toast.error('Wallet not connected. Try again…')
      return
    } else {
      const contractAddress = contract?.deploymentInfo.contractAddress
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      try {
        const result = await contract?.invoke({
          method: 'add_skill',
          args: []
        })

        if (!result) return

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

  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ name, email, skills, experience, education }: UpdateGreetingValues) => {
    if (!address) {
      console.log("Address is not defined")
      toast.error('Wallet is not connected. Try again...')
      return
    } else if (!server) {
      console.log("Server is not setup")
      toast.error('Server is not defined. Unable to connect to the blockchain')
      return
    } else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      } else {
        setUpdateIsLoading(true)

        try {
          const result = await contract?.invoke({
            method: 'add_skill',
            args: [
              nativeToScVal(name, { type: "string" }),
              nativeToScVal(email, { type: "string" }),
              nativeToScVal(skills, { type: "string" }),
              nativeToScVal(experience, { type: "string" }),
              nativeToScVal(education, { type: "string" })
            ],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          toast.success("New greeting successfully published!")
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateIsLoading(false)
          toggleUpdate(!updateFrontend)
        } 
      }
    }
  }
  const initializeContract = async (ownerAddress: string) => {
    if (!contract || !ownerAddress) return;

    try {
        await contract.invoke({
            method: 'init',
            args: [nativeToScVal(ownerAddress, { type: "address" })],
            signAndSend: true
        });
        toast.success("Contract initialized successfully!");
    } catch (e) {
        console.error(e);
        toast.error('Error while initializing contract. Try again…');
    }
  }

  if (!contract) {
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2>
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <p tw="text-center font-mono text-sm">No deployment found in the current chain</p>
          <p tw="text-center font-mono text-lg mt-4">Available deployments:</p>
         
        </Card>
      </div>
    )
  }

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="black">
          <FormControl>
            <FormLabel>The last modified sorban vitae</FormLabel>
            <Input
              placeholder={fetchedGreeting}
              disabled={true}
            />
          </FormControl>
        </Card>

        {/* Update Greeting */}
        <Card variant="outline" p={4} bgColor="black">
          <form onSubmit={handleSubmit(updateGreeting)}>
            <Stack direction="column" spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input disabled={updateIsLoading} {...register('name')} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input disabled={updateIsLoading} {...register('email')} />
              </FormControl>
              <FormControl>
                <FormLabel>Skills</FormLabel>
                <Input disabled={updateIsLoading} {...register('skills')} />
              </FormControl>
              <FormControl>
                <FormLabel>Experience</FormLabel>
                <Input disabled={updateIsLoading} {...register('experience')} />
              </FormControl>
              <FormControl>
                <FormLabel>Education</FormLabel>
                <Input disabled={updateIsLoading} {...register('education')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="green"
                isDisabled={updateIsLoading}
                isLoading={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-green-300 bg-black">
          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."}
        </p>
      </div>
    </>
  )
}