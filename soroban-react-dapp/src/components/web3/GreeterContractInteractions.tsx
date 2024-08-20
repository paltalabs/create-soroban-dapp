import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'; // Import components from Chakra UI
import { FC, useCallback, useEffect, useState } from 'react'; // Import hooks and types from React
import { useForm } from 'react-hook-form'; // Import useForm hook for form handling
import toast from 'react-hot-toast'; // Import toast for displaying notifications
import 'twin.macro'; // Import Twin Macro for styling

import { useSorobanReact } from "@soroban-react/core"; // Import SorobanReact hook for interacting with Soroban
import * as StellarSdk from '@stellar/stellar-sdk'; // Import Stellar SDK for blockchain interaction

import Link from 'next/link'; // Import Link component for navigation

import { useRegisteredContract } from '@soroban-react/contracts'; // Import hook to interact with registered contracts
import { nativeToScVal } from '@stellar/stellar-sdk'; // Import helper function to convert native types to Stellar smart contract values

type UpdateGreetingValues = { newMessage: string } // Define type for the form values

export const GreeterContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact() // Get the Soroban context, which includes blockchain info

  const [, setFetchIsLoading] = useState<boolean>(false) // State to manage loading state for fetching the greeting
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false) // State to manage loading state for updating the greeting
  const { register, handleSubmit } = useForm<UpdateGreetingValues>() // Initialize form handling with react-hook-form

  const [fetchedGreeting, setGreeterMessage] = useState<string>() // State to store the fetched greeting message
  const [updateFrontend, toggleUpdate] = useState<boolean>(true) // State to trigger a UI update
  const [contractAddressStored, setContractAddressStored] = useState<string>() // State to store the contract address

  const contract = useRegisteredContract("greeting") // Get the registered contract by its name "greeting"

  const fetchGreeting = useCallback(async () => {
    if (!sorobanContext.server) return // Exit if no server is connected

    const currentChain = sorobanContext.activeChain?.name?.toLocaleLowerCase() // Get the active blockchain network's name
    if (!currentChain) {
      console.log("No active chain") // Log error if no chain is active
      toast.error('Wallet not connected. Try again…') // Show error if wallet is not connected
      return
    } else {
      const contractAddress = contract?.deploymentInfo.contractAddress // Get the contract's deployment address
      setContractAddressStored(contractAddress) // Store the contract address in state
      setFetchIsLoading(true) // Set loading state to true while fetching
      try {
        const result = await contract?.invoke({
          method: 'read_title', // Invoke the 'read_title' method on the contract
          args: [] // No arguments are required for this method
        })

        if (!result) return // Exit if no result is returned

        const result_string = StellarSdk.scValToNative(result as StellarSdk.xdr.ScVal) as string // Convert the result to a native string
        setGreeterMessage(result_string) // Store the fetched greeting in state
      } catch (e) {
        console.error(e) // Log error if fetching fails
        toast.error('Error while fetching greeting. Try again…') // Show error message on failure
        setGreeterMessage(undefined) // Clear the greeting message on failure
      } finally {
        setFetchIsLoading(false) // Set loading state to false after fetching is done
      }
    }
  }, [sorobanContext, contract])

  useEffect(() => { void fetchGreeting() }, [updateFrontend, fetchGreeting]) // Fetch greeting when the component mounts or when updateFrontend changes

  const { activeChain, server, address } = sorobanContext // Destructure properties from the Soroban context

  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!address) {
      toast.error('Wallet is not connected. Try again...') // Show error if wallet is not connected
      return
    } else if (!server) {
      toast.error('Server is not defined. Unable to connect to the blockchain') // Show error if server is undefined
      return
    } else {
      const currentChain = activeChain?.name?.toLocaleLowerCase() // Get the current chain name
      if (!currentChain) {
        toast.error('Wallet not connected. Try again…') // Show error if no active chain is found
        return
      } else {
        setUpdateIsLoading(true) // Set loading state to true while updating
        try {
          const result = await contract?.invoke({
            method: 'set_title', // Invoke the 'set_title' method on the contract
            args: [
              nativeToScVal(newMessage, { type: "string" }), // Convert newMessage to a Stellar smart contract value
              nativeToScVal(address, { type: "address" }) // Convert the user's address to a Stellar smart contract value
            ],
            signAndSend: true // Indicate that this transaction requires a signature and should be sent to the blockchain
          })

          if (result) {
            toast.success("New greeting successfully published!") // Show success message on successful update
          } else {
            toast.error("Unauthorized: You do not have permission to update the greeting.") // Show error if the update fails
          }
        } catch (e) {
          console.error(e) // Log error if updating fails
          toast.error("Unauthorized: You do not have permission to update the greeting.") // Show unauthorized error on failure
        } finally {
          setUpdateIsLoading(false) // Set loading state to false after updating is done
          toggleUpdate(!updateFrontend) // Toggle frontend update to trigger UI refresh
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
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]"> {/* Set up a flexbox container for the UI */}
        <h2 tw="text-center font-mono text-gray-400">Greeter Smart Contract</h2> {/* Display the contract name */}

        {/* Fetched Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100"> {/* Display a card with outline and padding */}
          <FormControl>
            <FormLabel>Fetched Greeting</FormLabel> {/* Label for the fetched greeting input */}
            <Input
              placeholder={fetchedGreeting} // Set the placeholder to the fetched greeting message
              disabled={true} // Disable the input field
            />
          </FormControl>
        </Card>

        {/* Update Greeting */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100"> {/* Display a card with outline and padding */}
          <form onSubmit={handleSubmit(updateGreeting)}> {/* Handle form submission to update the greeting */}
            <Stack direction="row" spacing={2} align="end"> {/* Set up a horizontal stack for the input and button */}
              <FormControl>
                <FormLabel>Update Greeting</FormLabel> {/* Label for the update greeting input */}
                <Input disabled={updateIsLoading} {...register('newMessage')} /> {/* Input field for the new greeting message */}
              </FormControl>
              <Button
                type="submit" // Set the button type to submit the form
                mt={4}
                colorScheme="purple" // Set the button color scheme to purple
                isDisabled={updateIsLoading} // Disable the button if updating is in progress
                isLoading={updateIsLoading} // Show loading state if the update is in progress
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card>

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">
          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."} {/* Display contract address with a link to Stellar Explorer */}
        </p>
      </div>
    </>
  )
}
