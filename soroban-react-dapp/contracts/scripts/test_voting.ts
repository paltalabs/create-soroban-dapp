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
  const user1 = loadedConfig.getUser('USER_1');
  const user2 = loadedConfig.getUser('USER_2');
  if (network != "mainnet") await airdropAccount(admin);
  if (network != "mainnet") await airdropAccount(user1);
  if (network != "mainnet") await airdropAccount(user2);

  console.log("///   SETTING ADMIN    ///")
  const adminParams: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ];

  try {
    const adminResult = await invokeContract(
      'voting',
      addressBook,
      'set_admin',
      adminParams,
      admin
    );
    console.log(adminResult)
  } catch (error) {
    console.log('🚀 « error:', error);
  }

  console.log("///                 ///")
  console.log("///                 ///")

  console.log("///   ADD VOTER   ///")
  const newVoterParams: xdr.ScVal[] = [
    new Address(user1.publicKey()).toScVal(),
  ];

  try {
    const setVoterResponse = await invokeContract(
      'voting',
      addressBook,
      'add_voter',
      newVoterParams,
      admin
    );
    console.log('🚀 « setVoterResponse:', setVoterResponse);
  } catch (error) {
    console.log('🚀 « error:', error);
  }

  console.log("///                 ///")
  console.log("///                 ///")

  console.log("///   GETTING NEW VOTES    ///")
  try {
    const getVotesResponseBefore = await invokeContract(
      'voting',
      addressBook,
      'get_votes',
      [],
      admin,
      true
    );
  
    console.log("getVotesResponse BEFORE", scValToNative(getVotesResponseBefore.result.retval))
  } catch (error) {
    console.log('🚀 « error:', error);
  }

  console.log("///                 ///")
  console.log("///                 ///")

  console.log("///   VOTE 1    ///")
  const voteParams: xdr.ScVal[] = [
    new Address(user1.publicKey()).toScVal(),
    nativeToScVal("list_1", {type: "string"})
  ];

  try {
    const result = await invokeContract(
      'voting',
      addressBook,
      'vote',
      voteParams,
      user1
    );
    console.log("first vote result",result)
  } catch (error) {
    console.log('🚀 « error:', error);
  }

  console.log("///                 ///")
  console.log("///                 ///")

  console.log("///   VOTE 2    ///")
  const vote2Params: xdr.ScVal[] = [
    new Address(user2.publicKey()).toScVal(),
    nativeToScVal("list_2", {type: "string"})
  ];

  try {
    const result_2 = await invokeContract(
      'voting',
      addressBook,
      'vote',
      vote2Params,
      user2
    );
    console.log("second vote result", result_2)
  } catch (error) {
    console.log('🚀 « error:', error);
  }

  console.log("///   GETTING NEW VOTES    ///")
  try {
    const getVotesResponseAfter = await invokeContract(
      'voting',
      addressBook,
      'get_votes',
      [],
      admin,
      true
    );
    console.log("getVotesResponse AFTER", scValToNative(getVotesResponseAfter.result.retval))
  } catch (error) {
    console.log('🚀 « error:', error);
  }


}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testVotingContract(addressBook);