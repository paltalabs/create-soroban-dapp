import { Address, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { airdropAccount, invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';
import { getCurrentTimePlusOneHour } from '../utils/tx.js';

export async function testVotingContract(addressBook: AddressBook) {
  console.log('-------------------------------------------------------');
  console.log('Testing Voting Contract');
  console.log('-------------------------------------------------------');
  
  console.log("Contract:", addressBook.getContractId('voting'))
  
  const admin = loadedConfig.admin;
  const user2 = loadedConfig.getUser('USER_2');
  if (network != "mainnet") await airdropAccount(admin);
  if (network != "mainnet") await airdropAccount(user2);

  const getVotesResponse = await invokeContract(
    'voting',
    addressBook,
    'get_votes',
    [],
    admin,
    true
  );

  console.log("getVotesResponse BEFORE", scValToNative(getVotesResponse.result.retval))

  console.log("///   VOTE    ///")
  const params: xdr.ScVal[] = [
    new Address(user2.publicKey()).toScVal(),
    nativeToScVal("differentvote", {type: "string"})
  ];

  const result = await invokeContract(
    'voting',
    addressBook,
    'vote',
    params,
    admin
  );
  console.log(result)

  console.log("///   GETTING NEW VOTES    ///")
  const getVotesResponseAfter = await invokeContract(
    'voting',
    addressBook,
    'get_votes',
    [],
    admin,
    true
  );

  console.log("getVotesResponse AFTER", scValToNative(getVotesResponseAfter.result.retval))

}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testVotingContract(addressBook);