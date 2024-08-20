import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { useRegisteredContract } from '@soroban-react/contracts'
import { Address, nativeToScVal } from '@stellar/stellar-sdk'

type UpdateGreetingValues = { newMessage: string }
type AddEditorValues = { newEditor: string }
type RemoveEditorValues = { remover: string }

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()


  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateGreetingIsLoading, setUpdateGreetingIsLoading] = useState<boolean>(false)
  const [updateEditorIsLoading, setUpdateEditorIsLoading] = useState<boolean>(false)
  const { register: registerGreeting, handleSubmit: handleSubmitGreeting } = useForm<UpdateGreetingValues>()
  const { register: registerEditor, handleSubmit: handleSubmitAdmin } = useForm<AddEditorValues>()

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

  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isEditor, setIsEditor] = useState<boolean>(false)
  const [editors, setEditors] = useState<string[]>()

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

  // read the editors
  const readEditors = useCallback(async () => {
    const contractAddress = contract?.deploymentInfo.contractAddress
    setContractAddressStored(contractAddress)
    setFetchIsLoading(true)
    try {
      const result = await contract?.invoke({
        method: 'read_editors',
        args: []
      })

      if (!result) return

      const result_arr = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string[]
      setIsAdmin(result_arr.indexOf(sorobanContext.address!!) == 0)
      setIsEditor(result_arr.indexOf(sorobanContext.address!!) >= 0)
      setEditors(result_arr)
    } catch (e) {
      console.error(e)
      toast.error('Error while reading editors. Try again…')
    } finally {
      setFetchIsLoading(false)
    }
  }, [sorobanContext, contract])

  useEffect(() => {
    fetchGreeting()
    readEditors()
  }, [updateFrontend, fetchGreeting, readEditors])


  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!address) {
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        setUpdateGreetingIsLoading(true)

        try {
          const result = await contract?.invoke({
            method: 'set_title',
            args: [nativeToScVal(Address.fromString(address)), nativeToScVal(newMessage, { type: "string" })],
            signAndSend: true
          })

          if (true) {
            toast.success("New greeting successfully published!")
          }
          else {
            toast.error("Greeting unsuccessful...")
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateGreetingIsLoading(false)
          toggleUpdate(!updateFrontend)
        }
      }
    }
  }

  const addEditor = async ({ newEditor }: AddEditorValues) => {
    if (!address) {
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        setUpdateEditorIsLoading(true)

        try {
          const result = await contract?.invoke({
            method: 'add_editor',
            args: [nativeToScVal(Address.fromString(newEditor))],
            signAndSend: true
          })

          if (true) {
            toast.success("New Editor successfully added!")
          }
          else {
            toast.error("adding unsuccessful...")
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateEditorIsLoading(false)
          toggleUpdate(!updateFrontend)
        }
      }
    }
  }

  const removeEditor = async ({ remover }: RemoveEditorValues) => {
    if (!address) {
      toast.error('Wallet is not connected. Try again...')
      return
    }
    else if (!server) {
      toast.error('Server is not defined. Unabled to connect to the blockchain')
      return
    }
    else {
      const currentChain = activeChain?.name?.toLocaleLowerCase()
      if (!currentChain) {
        toast.error('Wallet not connected. Try again…')
        return
      }
      else {

        setUpdateEditorIsLoading(true)

        try {
          const result = await contract?.invoke({
            method: 'remove_editor',
            args: [nativeToScVal(Address.fromString(remover))],
            signAndSend: true
          })

          if (true) {
            toast.success("Editor successfully removed!")
          }
          else {
            toast.error("removing unsuccessful...")
          }
        } catch (e) {
          console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateEditorIsLoading(false)
          toggleUpdate(!updateFrontend)
        }

        // await sorobanContext.connect();
      }
    }
  }

  const trim = (string: string, sideLength: number = 16) => {
    return string.length > sideLength * 2 ? string.substring(0, sideLength) + '…'
      + string.substring(string.length - sideLength) : string
  }

  const adminManagement = (
    <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
      <Card variant="outline" p={4} bgColor="whiteAlpha.100">
        {editors?.map((editor, i) => (
          <div tw="flex justify-between" key={editor}>
            <p key={i} tw="text-center font-mono text-sm">- {trim(editor)}</p>
            {i !== 0 && <button onClick={() => {
              removeEditor({ remover: editor })
            }}>✕</button>}
          </div>
        ))}
        {/* Input for adding new admins */}
        <br />
        <hr tw="border border-gray-900" />
        <br />
        <form onSubmit={handleSubmitAdmin(addEditor)}>
          <Stack direction="row" spacing={2} align="end">
            <FormControl>
              <FormLabel>Add Editor</FormLabel>
              <Input disabled={updateEditorIsLoading} {...registerEditor('newEditor')} />
            </FormControl>
            <Button
              type="submit"
              mt={4}
              colorScheme="purple"
              isDisabled={updateEditorIsLoading}
              isLoading={updateEditorIsLoading}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  )
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
        {/* Admin section */}
        {isAdmin && adminManagement}

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
        {isEditor &&
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmit={handleSubmitGreeting(updateGreeting)}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Update Greeting</FormLabel>
                  <Input disabled={updateGreetingIsLoading} {...registerGreeting('newMessage')} />
                </FormControl>
                <Button
                  type="submit"
                  mt={4}
                  colorScheme="purple"
                  isDisabled={updateGreetingIsLoading}
                  isLoading={updateGreetingIsLoading}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </Card>
        }

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">

          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."}
        </p>
      </div>
    </>
  )
}