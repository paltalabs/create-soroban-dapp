import { Address, nativeToScVal, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';
import { getCurrentTimePlusOneHour } from '../utils/tx.js';

export async function testSoroswapAdapter(addressBook: AddressBook) {
  console.log('-------------------------------------------------------');
  console.log('Testing');
  console.log('-------------------------------------------------------');

  const params: xdr.ScVal[] = [
    nativeToScVal("gg", {type: "string"})
  ];

  await invokeContract(
    'greeting',
    addressBook,
    'set_title',
    params,
    loadedConfig.admin
  );

}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testSoroswapAdapter(addressBook);