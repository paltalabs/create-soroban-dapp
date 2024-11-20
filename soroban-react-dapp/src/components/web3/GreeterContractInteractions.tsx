import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, TxResponse, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal, xdr } from '@stellar/stellar-sdk'

type UpdateGreetingValues = { userAddress: string, newMessage: string, }
type UpdateUserValues = { newMessage: string, is_add: boolean }

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const [addUserIsLoading, setAddUserIsLoading] = useState<boolean>(false)
  const [removeUserIsLoading, setRemoveUserIsLoading] = useState<boolean>(false)
  const { register: updateTitle, handleSubmit: handleUpdateTitle } = useForm<UpdateGreetingValues>()
  const { register: addUser, handleSubmit: handleAddUser } = useForm<UpdateGreetingValues>()
  const { register: removeUser, handleSubmit: handleRemoveUser } = useForm<UpdateGreetingValues>()
  
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
  const contract = useRegisteredContract("access_control")

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
          method: 'get_admin_title',
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
  },[sorobanContext,contract])

  useEffect(() => {void fetchGreeting()}, [updateFrontend,fetchGreeting])


  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ userAddress, newMessage }: UpdateGreetingValues ) => {
    if (!address) {
      console.log("Address is not defined")
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      console.log("Server is not setup")
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        setUpdateIsLoading(true)

        try {
          const result = await contract?.invoke({
            method: 'set_title',
            args: [new StellarSdk.Address(userAddress).toScVal(), nativeToScVal(newMessage, {type: "string"})],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          if ((result as TxResponse).status === "SUCCESS") {
            toast.success("New title successfully published!")
          }
          else {
            toast.error("New title unsuccessful...")
            
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateIsLoading(false)
          toggleUpdate(!updateFrontend)
        } 

        // await sorobanContext.connect();
      }
    }
  }

  const addUserAddress = async ({ newMessage }: any ) => {
    await updateUser({ newMessage, is_add: true});
  }

  const removeUserAddress = async ({ newMessage }: any ) => {
    await updateUser({ newMessage, is_add: false});
  }

  const updateUser = async ({ newMessage, is_add }: UpdateUserValues ) => {
    if (!address) {
      console.log("Address is not defined")
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      console.log("Server is not setup")
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        console.log("No active chain")
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        if (is_add) {
          setAddUserIsLoading(true)
        } else {
          setRemoveUserIsLoading(true);
        }

        console.log(contract);
        
        try {
          const result = await contract?.invoke({
            method: 'set_user',
            args: [new StellarSdk.Address(newMessage).toScVal(), nativeToScVal(is_add)],
            signAndSend: true
          })
          console.log('🚀 « result:', result);
          
          if ((result as TxResponse).status === "SUCCESS") {
            toast.success("successfully published!")
          }
          else {
            toast.error("unsuccessful...")
            
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          if (is_add) {
            setAddUserIsLoading(false)
          } else {
            setRemoveUserIsLoading(false);
          }
          toggleUpdate(!updateFrontend)
        } 

        // await sorobanContext.connect();
      }
    }
  }

  if(!contract){
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Access Control Smart Contract</h2>
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
        <h2 tw="text-center font-mono text-gray-400">Access Control Smart Contract</h2>

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Admin Title</FormLabel>
            <Input
              placeholder={fetchedGreeting}
              disabled={true}
            />
          </FormControl>
        </Card>

        {/* Add User */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleAddUser(addUserAddress)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Add User</FormLabel>
                <Input placeholder="Input user address" disabled={addUserIsLoading} {...addUser('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={addUserIsLoading}
                isLoading={addUserIsLoading}
              >
                Add
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Remove User */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleRemoveUser(removeUserAddress)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Remove User</FormLabel>
                <Input placeholder="Input user address" disabled={removeUserIsLoading} {...removeUser('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={removeUserIsLoading}
                isLoading={removeUserIsLoading}
              >
                Remove
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Update Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleUpdateTitle(updateGreeting)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Update Title</FormLabel>
                <Input tw="my-2" placeholder="Input user address" disabled={updateIsLoading} {...updateTitle('userAddress')} />
                <Input placeholder="Input the title" disabled={updateIsLoading} {...updateTitle('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isDisabled={updateIsLoading}
                isLoading={updateIsLoading}
              >
                Apply
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