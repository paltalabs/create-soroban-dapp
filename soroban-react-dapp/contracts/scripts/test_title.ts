import { Address, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract, airdropAccount } from '../utils/contract.js';
import { config } from '../utils/env_config.js';

export async function testTitleContract(addressBook: AddressBook) {
  console.log('-------------------------------------------------------');
  console.log('Testing Title Contract');
  console.log('-------------------------------------------------------');

  const admin = loadedConfig.admin;
  const user_1 = loadedConfig.getUser("USER_1");
  const user_2 = loadedConfig.getUser("USER_2");

  if (network !== "mainnet") {
    await airdropAccount(admin);
    await airdropAccount(user_1);
    await airdropAccount(user_2);
  }

  //Set admin
  // console.log('-------------------------------------------------------');
  // console.log('Setting Admin');
  // console.log('-------------------------------------------------------');

  // const params_set_admin: xdr.ScVal[] = [
  //   new Address(admin.publicKey()).toScVal(),
  // ];

  // const result_set_admin = await invokeContract(
  //   'title',
  //   addressBook,
  //   'set_admin',
  //   params_set_admin,
  //   admin
  // );
  // console.log("Result of set_admin: ", result_set_admin);

  // Add user
  console.log('-------------------------------------------------------');
  console.log('Adding User');
  console.log('-------------------------------------------------------');

  const params_add_user: xdr.ScVal[] = [
    new Address(user_1.publicKey()).toScVal(),
  ];

  const result_add_user = await invokeContract(
    'title',
    addressBook,
    'add_user',
    params_add_user,
    admin  // The admin adds the user
  );
  console.log("Result of add_user: ", result_add_user);

  // Attempt to modify title with authorized user
  console.log('-------------------------------------------------------');
  console.log('Modifying Title with Authorized User');
  console.log('-------------------------------------------------------');

  const params_modify_title: xdr.ScVal[] = [
    new Address(user_1.publicKey()).toScVal(),
    nativeToScVal("New Title", { type: "string" })
  ];

  const result_modify_title = await invokeContract(
    'title',
    addressBook,
    'modify_title',
    params_modify_title,
    user_1
  );
  console.log("Result of modify_title: ", result_modify_title);

  // Get title after modification
  console.log('-------------------------------------------------------');
  console.log('Getting Title After Modification');
  console.log('-------------------------------------------------------');

  const result_get_title = await invokeContract(
    'title',
    addressBook,
    'get_title',
    [],
    admin, // Admin retrieves the title
    true  
  );
  if (result_get_title && result_get_title.result && result_get_title.result.retval) {
    console.log("Title after modification: ", scValToNative(result_get_title.result.retval));
  } else {
    console.error("Error: Unable to retrieve title, result is undefined or invalid.");
  }

  console.log("Title after modification: ", scValToNative(result_get_title.result.retval));

  // Attempt to modify title with unauthorized user
  console.log('-------------------------------------------------------');
  console.log('Modifying Title with Unauthorized User');
  console.log('-------------------------------------------------------');

  const params_modify_title_unauthorized: xdr.ScVal[] = [
    new Address(user_2.publicKey()).toScVal(),
    nativeToScVal("New Title", { type: "string" })
  ];

  try {
    const result_modify_title_unauthorized = await invokeContract(
      'title',
      addressBook,
      'modify_title',
      params_modify_title_unauthorized,
      user_2
    );
    console.log("Unexpected success in unauthorized modify_title: ", result_modify_title_unauthorized);
  } catch (e) {
    const error = e as Error;
    console.log("Expected failure in unauthorized modify_title: ", error.message);
  }

  // Get admin address
  console.log('-------------------------------------------------------');
  console.log('Getting Admin Address');
  console.log('-------------------------------------------------------');

  const result_address_admin = await invokeContract(
    'title',
    addressBook,
    'address_admin',
    [],
    admin, // Admin should be able to get the address
    true  
  );
  console.log("Admin address: ", scValToNative(result_address_admin.result.retval));
}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testTitleContract(addressBook);
