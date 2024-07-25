import { Box, Button, Card, FormControl, FormLabel, Input, Stack, VStack, Text, Tooltip, RadioGroup, Radio } from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { Address, nativeToScVal, xdr } from '@stellar/stellar-sdk'

import { Mercury, scValToJs } from 'mercury-sdk'

type VoteSelectionType = { selectedOption: string };

interface Votes {
  [key: string]: string;
}

interface IndividualVotesProps {
  votes: Votes | undefined;
}

const IndividualVotes: React.FC<IndividualVotesProps> = ({ votes }) => {
  if (!votes) return;

  return (
    <Card variant="outline" p={4} bgColor="whiteAlpha.100">
      <FormControl>
        <FormLabel>Individual Votes</FormLabel>
        <VStack align="start" spacing={4}>
          {Object.entries(votes).map(([address, list], index) => (
            <Box key={index} bg="whiteAlpha.200" p={4} borderRadius="md" width="100%">
              <Tooltip label={address} fontSize="md">
                <Text fontWeight="bold" isTruncated maxW="sm">{address}</Text>
              </Tooltip>
              <Text color="gray.500">{list}</Text>
            </Box>
          ))}
        </VStack>
      </FormControl>
    </Card>
  );
};

interface VoteSummaryProps {
  votes: Votes | undefined;
}

const VoteSummary: React.FC<VoteSummaryProps> = ({ votes }) => {
  if (!votes) return;
  const voteSummary = Object.values(votes).reduce((summary, list) => {
    summary[list] = (summary[list] || 0) + 1;
    return summary;
  }, {} as { [key: string]: number });

  return (
    <Card variant="outline" p={4} bgColor="whiteAlpha.100">
      <FormControl>
        <FormLabel>Vote Summary</FormLabel>
        <VStack align="start" spacing={4}>
          {Object.entries(voteSummary).map(([list, count], index) => (
            <Box key={index} bg="whiteAlpha.200" p={4} borderRadius="md" width="100%">
              <Text fontWeight="bold">{list}</Text>
              <Text color="gray.500">{count} votes</Text>
            </Box>
          ))}
        </VStack>
      </FormControl>
    </Card>
  );
};

interface VoteFormProps {
  updateIsLoading: boolean;
  voteOnContract: (data: any) => void;
}

const options = ['list_1', 'list_2', 'list_3'];

export const VotingContractInteractions: FC = () => {
  const sorobanContext = useSorobanReact()
  const { activeChain, server, address } = sorobanContext
  console.log('🚀 « sorobanContext:', sorobanContext);

  const [, setFetchIsLoading] = useState<boolean>(false)
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>(false)
  const { register, handleSubmit, setValue, watch } = useForm<VoteSelectionType>();
  const selectedOption = watch('selectedOption');

  const [fetchedVotes, setVotes] = useState<Votes>()
  const [updateFrontend, toggleUpdate] = useState<boolean>(true)
  const [contractAddressStored, setContractAddressStored] = useState<string>()

  // Retrieve the deployed contract object from contract Registry
  const contract = useRegisteredContract("voting")

  const mercuryInstance = new Mercury({
    backendEndpoint: "https://api.mercurydata.app",
    graphqlEndpoint: "https://api.mercurydata.app",
    email: "",
    password: ""
  })

  // Fetch Greeting
  const fetchVoting = useCallback(async () => {
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
        // TODO:
        // Should read votes from `contract` show both possible solutions contractInvoke and contract?.invoke

        // const result = await contractInvoke({
        //   contractAddress: "CDBZMC3JZNWN7GCJOJX3VN2K4GBNY7L3LKXUT2T7ILKYTYWKSPDQMBVC",
        //   method: "get_votes",
        //   args: [],
        //   signAndSend: false,
        //   sorobanContext
        // })


        const result = await contract?.invoke({
          method: "get_votes",
          signAndSend: false
        })
        const parsedResult = StellarSdk.scValToNative(result as xdr.ScVal)

        setVotes(parsedResult)
      } catch (e) {
        console.error(e)
        toast.error('Error while fetching votes. Try again…')
        setVotes(undefined)
      } finally {
        setFetchIsLoading(false)
      }
    }
  }, [sorobanContext, contract])

  useEffect(() => { void fetchVoting() }, [updateFrontend, fetchVoting])



  const voteOnContract = async ({ selectedOption }: VoteSelectionType) => {
    console.log('🚀 « selectedOption:', selectedOption);
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
          // TODO:
          // Should define params scval[] and vote using contractInvoke or contract?.invoke
          const voteParams: xdr.ScVal[] = [
            new Address(address).toScVal(),
            nativeToScVal(selectedOption, { type: "string" })
          ]

          const result = await contract?.invoke({
            method: "vote",
            args: voteParams,
            signAndSend: true,
          })

          console.log('🚀 « result:', result);

          if (true) {
            toast.success("New vote successfully published!")
          }
          else {
            toast.error("Greeting unsuccessful...")

          }
        } catch (e) {
          // console.error(e)
          toast.error('Error while sending tx. Try again…')
        } finally {
          setUpdateIsLoading(false)
          toggleUpdate(!updateFrontend)
        }
      }
    }
  }

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Voting Smart Contract</h2>

        {/* Fetched Votes */}
        <VStack spacing={4} align="stretch">
          <IndividualVotes votes={fetchedVotes} />
          <VoteSummary votes={fetchedVotes} />
        </VStack>

        {/* Vote Component */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleSubmit(voteOnContract)}>
            <FormControl>
              <FormLabel>Vote</FormLabel>
              <RadioGroup
                value={selectedOption}
                onChange={(value) => setValue('selectedOption', value)}
              >
                <Stack direction="column" spacing={2}>
                  {options.map((option) => (
                    <Radio key={option} value={option} {...register('selectedOption')}>
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
            <Button
              type="submit"
              mt={4}
              colorScheme="purple"
              isDisabled={updateIsLoading}
              isLoading={updateIsLoading}
            >
              Vote
            </Button>
          </form>
        </Card>
        {/* Mercury Data */}
        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <p >
            Mercury Data
          </p>
          <Button
            onClick={async () => {
              const myQuery = `
            query MyQuery {
              entryUpdateByContractId(
                contract: "CB4L6XZ3OHC6GYXSSI5L5QBOP7QQZ3MI4PFATBYY46CKIKP4NNZDMHKC"
                lastN: 1
              ) {
                nodes {
                  contractId
                  keyXdr
                  txInfoByTx {
                    txHash
                    memo
                    opCount
                    fee
                    ledgerByLedger {
                      closeTime
                      sequence
                    }
                  }
                  valueXdr
                }
              }
            }
            `
              const data = await mercuryInstance.getCustomQuery({
                request: myQuery
              })
              console.log('🚀 ~ onClick={ ~ data:', data);
              const base64Xdr = data?.data?.entryUpdateByContractId?.nodes[0]?.valueXdr
              const parsedData: any = StellarSdk.xdr.ScVal.fromXDR(base64Xdr, 'base64');
              const jsValues = scValToJs(parsedData)
              console.log('🚀 ~ onClick={ ~ jsValues:', jsValues);
              const element = jsValues.storage()[0].val();
              console.log('🚀 ~ onClick={ ~ element:', element);
              const humanReadable = scValToJs(element)
              console.log('🚀 ~ onClick={ ~ humanReadable:', humanReadable);

            }}
          >
            Fetch Data
          </Button>
        </Card>
        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">

          {contractAddressStored ? <Link href={"https://stellar.expert/explorer/testnet/contract/" + contractAddressStored} target="_blank">{contractAddressStored}</Link> : "Loading address.."}
        </p>
      </div>
    </>
  )
}