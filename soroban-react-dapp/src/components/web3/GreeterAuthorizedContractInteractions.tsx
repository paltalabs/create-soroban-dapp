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

type UpdateGreetingValues = { newAuthorizedGreeter: string }

export const GreeterAuthorizedContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()

  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<UpdateGreetingValues>()

  const [fetchedGreeting, setGreeterMessage] = useState<string>()
  const [fetchedAdmin, setAdmin] = useState<string>()
  const [fetchedAuthorizedGreeters, setAuthorizedGreeters] = useState<string[]>([])
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  const contract = useRegisteredContract("authorized_greeting")

  // Generic function to fetch contract data
  const fetchContractData = useCallback(async (method: string, setter: (value: any) => void) => {
    if (!sorobanContext.server) return

    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    const contractAddress = contract?.deploymentInfo.contractAddress
    setContractAddressStored(contractAddress)
    setFetchIsLoading(true)
    try {
      const result = await contract?.invoke({
        method,
        args: []
      })

      if (result) {
        const parsedResult = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal)
        console.log(`🚀 ~ fetchContractData ~ parsedResult: ${method}; type:${typeof (parsedResult)}`, parsedResult)
        setter(parsedResult)
      }
    } catch (e) {
      console.error(e)
      toast.error(`Error while fetching ${method}. Try again…`)
      setter(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }, [sorobanContext, contract])

  useEffect(() => {
    fetchContractData('read_greet', setGreeterMessage)
    fetchContractData('get_admin', setAdmin)
    fetchContractData('get_authorized_greeter_list', (value) => {
      const greeterList = Object.keys(value as Record<string, boolean>);
      setAuthorizedGreeters(greeterList);
    });
  }, [fetchContractData, updateFrontend])

  const { activeChain, server, address } = sorobanContext

  const updateGreeting = async ({ newMessage }: any) => {
    if (!address) {
      toast.error('Wallet is not connected. Try again...')
      return
    }
    if (!server) {
      toast.error('Server is not defined. Unable to connect to the blockchain')
      return
    }
    
    const currentChain = activeChain?.name?.toLocaleLowerCase()
    if (!currentChain) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    if (newMessage.length > 32) {
      toast.error("Message exceeds 32 bytes. Please shorten it.");
      return;
    }
    
    setUpdateIsLoading(true)
    
    try {
      const set_greet_params: xdr.ScVal[] = [
        new StellarSdk.Address(address).toScVal(),
        nativeToScVal(newMessage, { type: "string" }),
      ];

      await contract?.invoke({
        method: 'set_greet',
        args: set_greet_params,
        signAndSend: true
      })

      toast.success("New greeting successfully published!")
      toggleUpdate(!updateFrontend)
    } catch (e) {
      console.error(e)
      console.log("🚀 ~ e:", e)
      toast.error('Error while sending tx. Try again…')
    } finally {
      setUpdateIsLoading(false)
    }
  }

  if (!contract) {
    return (
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Authorized Greeter Smart Contract</h2>
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
        <h2 tw="text-center font-mono text-gray-400">Authorized Greeter Smart Contract</h2>
        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Last Updated Greet</FormLabel>
            <Input
              placeholder={fetchedGreeting}
              disabled={true}
            />
          </FormControl>
        </Card>

        {/* IF ADMIN IS LOGGED IN ADD AUTHORIZED GREETERS AND FETCH AUTHORIZED GREETERS*/}
        {fetchedAdmin === address && (
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmit={handleSubmit(async (data: UpdateGreetingValues) => {
              const { newAuthorizedGreeter } = data;
              if (!contract) return
              try {
                setUpdateIsLoading(true)
                console.log("🚀 ~ <formonSubmit={handleSubmit ~ newAuthorizedGreeter:", newAuthorizedGreeter)
                const keypair = StellarSdk.Keypair.fromSecret(newAuthorizedGreeter);
                const publicKey = keypair.publicKey()
                const add_greeter_params: xdr.ScVal[] = [
                  new StellarSdk.Address(publicKey).toScVal(),
                ]
                console.log("🚀 ~ <formonSubmit={handleSubmit ~ add_greeter_params:", add_greeter_params)

                await contract.invoke({
                  method: 'add_greeter',
                  args: add_greeter_params,
                  signAndSend: true,
                })
                toast.success('Authorized greeter successfully added!')
                toggleUpdate(!updateFrontend)
              } catch (e) {
                console.error(e)
                toast.error('Error while authorizing greeter. Try again…')
              } finally {
                setUpdateIsLoading(false)
              }
            })}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Add Authorized Greeter</FormLabel>
                  <Input
                    disabled={updateIsLoading}
                    placeholder="Enter wallet address"
                    {...register('newAuthorizedGreeter')}
                  />
                </FormControl>
                <Button
                  type="submit"
                  mt={4}
                  colorScheme="purple"
                  isDisabled={updateIsLoading}
                  isLoading={updateIsLoading}
                >
                  Add
                </Button>
              </Stack>
            </form>

            <FormControl mt={4}>
              <FormLabel>Authorized Greeters</FormLabel>
              {fetchedAuthorizedGreeters.length > 0 ? (
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {fetchedAuthorizedGreeters.map((greeter) => (
                    <li key={greeter} style={{ marginBottom: '5px' }}>
                      {greeter}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading...</p>
              )}
            </FormControl>
          </Card>
        )}

        {/* Update Greeting */}
        {Array.isArray(fetchedAuthorizedGreeters) && address && fetchedAuthorizedGreeters.includes(address) && (
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmit={handleSubmit(updateGreeting)}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Update Greet</FormLabel>
                  <Input disabled={updateIsLoading} {...register('newAuthorizedGreeter')} />
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
        )}

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">
          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."}
        </p>
      </div>
    </>
  )
}
