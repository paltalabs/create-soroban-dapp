import { Address, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';

export async function testGreetingContract(addressBook: AddressBook) {
  console.log('-------------------------------------------------------');
  console.log('Testing Greeting Contract');
  console.log('-------------------------------------------------------');

  const admin = loadedConfig.admin;
  const user1 = loadedConfig.getUser("USER_1");

  const setAdminParams: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal()
  ]

  try {
    await invokeContract(
      'greeting',
      addressBook,
      'set_admin',
      setAdminParams,
      admin,
    )
  } catch (e) {
    console.log('Admin already set');
  }

  const currentAdmin = await invokeContract(
    'greeting',
    addressBook,
    'get_admin',
    [],
    admin,
    true
  )

  console.log('-------------------------------------------------------');
  console.log(`Expected Admin Public Key: ${admin.publicKey()}`);
  console.log(`Current Admin Public Key: ${scValToNative(currentAdmin.result.retval)}`);
  console.log('-------------------------------------------------------');

  const setAuthorizedUsersParams: xdr.ScVal[] = [
    new Address(user1.publicKey()).toScVal()
  ]

  await invokeContract(
    'greeting',
    addressBook,
    'set_authorized_user',
    setAuthorizedUsersParams,
    admin,
  )

  const currentAuthorizedUsers = await invokeContract(
    'greeting',
    addressBook,
    'get_authorized_users',
    [],
    admin,
    true
  );

  console.log('-------------------------------------------------------');
  console.log(`Expected Authorized Users: ${user1.publicKey()}`);
  console.log('Current Authorized Users: ', scValToNative(currentAuthorizedUsers.result.retval));
  console.log('-------------------------------------------------------');

  const setTitleParams: xdr.ScVal[] = [
    new Address(user1.publicKey()).toScVal(),
    nativeToScVal("Tomás Opazo - Paltalabs Dev :)", { type: 'string' })
  ]

  await invokeContract(
    'greeting',
    addressBook,
    'set_title',
    setTitleParams,
    user1,
  )

  const updatedTitle = await invokeContract(
    'greeting',
    addressBook,
    'get_title',
    [],
    user1,
    true
  )

  console.log('-------------------------------------------------------');
  console.log(`Expected Title: Tomás Opazo - Paltalabs Dev :)`);
  console.log(`Updated Title: ${scValToNative(updatedTitle.result.retval)}`);
  console.log('-------------------------------------------------------');
}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testGreetingContract(addressBook);