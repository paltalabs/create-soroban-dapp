import { Button, Card, FormControl, FormLabel, Input, Stack, Textarea } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal } from '@stellar/stellar-sdk'

type UpdateGreetingValues = { 
  name: string, 
  email: string, 
  skills: string, 
  experience: string, 
  education: string 
}
type CV = {
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
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
      console.log(contractAddress);
      setContractAddressStored(contractAddress)
      setFetchIsLoading(true)
      
    }
  }, [sorobanContext, contract])

  useEffect(() => { void fetchGreeting() }, [updateFrontend, fetchGreeting])

  const { activeChain, server, address } = sorobanContext
  const fetchCV = async () => {
    if (!address || !contract) return;

    try {
        const result = await contract.invoke({
            method: 'get_cv',
            args: [nativeToScVal(address, { type: "address" })],
        });
        console.log(result);

        const cv = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as CV; // Cast to CV interface
        const cvString = `Name: ${cv.name}\nEmail: ${cv.email}\nSkills: ${cv.skills.join(', ')}\nExperience: ${cv.experience.join(', ')}\nEducation: ${cv.education.join(', ')}`;

        console.log(cvString);
        setGreeterMessage(cvString); // Actualiza el estado con el CV obtenido
    } catch (e) {
        console.error(e);
        toast.error('Error al obtener el CV. Intenta de nuevo…');
    }
};

useEffect(() => {
  if (address) {
      void fetchCV(); // Llama a la nueva función al conectarse
  }
}, [address, contract]);
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
          // Initialize contract
          await contract?.invoke({
            method: 'init',
            args: [nativeToScVal(address, { type: "address" })],
            signAndSend: true
          });

          // Update name and email
          await contract?.invoke({
            method: 'update_cv',
            args: [
              nativeToScVal(address, { type: "address" }), // owner
              nativeToScVal(name, { type: "string" }),
              nativeToScVal(email, { type: "string" })
            ],
            signAndSend: true
          });

          // Add skills, experience, and education
          await contract?.invoke({
            method: 'add_skill',
            args: [
              nativeToScVal(address, { type: "address" }), // owner
              nativeToScVal(skills, { type: "string" })
            ],
            signAndSend: true
          });

          await contract?.invoke({
            method: 'add_experience',
            args: [
              nativeToScVal(address, { type: "address" }), // owner
              nativeToScVal(experience, { type: "string" })
            ],
            signAndSend: true
          });

          await contract?.invoke({
            method: 'add_education',
            args: [
              nativeToScVal(address, { type: "address" }), // owner
              nativeToScVal(education, { type: "string" })
            ],
            signAndSend: true
          });

          toast.success("CV updated successfully!");
        } catch (e) {
          console.error(e)
          toast.error('Error while updating CV. Try again…')
        } finally {
          setUpdateIsLoading(false)
          toggleUpdate(!updateFrontend)
        } 
      }
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
        <Card variant="outline" p={4} bgColor="black" tw="relative" >          
          <FormControl>
            <FormLabel>The last modified sorban vitae</FormLabel>
            <Textarea
              placeholder={fetchedGreeting}
              disabled={true}
              resize="none" 
              tw="bg-transparent text-white" // Asegúrate de que el texto sea legible
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