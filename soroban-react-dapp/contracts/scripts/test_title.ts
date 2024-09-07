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
  const new_admin = loadedConfig.getUser("NEW_ADMIN");

  if (network !== "mainnet") {
    await airdropAccount(admin);
    await airdropAccount(user_1);
    await airdropAccount(user_2);
    await airdropAccount(new_admin);
  }

  // Set admin
  console.log('-------------------------------------------------------');
  console.log('Setting Admin');
  console.log('-------------------------------------------------------');

  const params_set_admin = [
    new Address(admin.publicKey()).toScVal(),
  ];

  const result_set_admin = await invokeContract(
    'title',
    addressBook,
    'set_admin',
    params_set_admin,
    admin
  );
  console.log("Result of set_admin: ", result_set_admin);

  // Add user
  console.log('-------------------------------------------------------');
  console.log('Adding User');
  console.log('-------------------------------------------------------');

  const params_add_user = [
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

  // Modify title with authorized user
  console.log('-------------------------------------------------------');
  console.log('Modifying Title with Authorized User');
  console.log('-------------------------------------------------------');

  const params_modify_title = [
    new Address(user_1.publicKey()).toScVal(),
    nativeToScVal("PrincesitoDan", { type: "string" })
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

  // Attempt to modify title with unauthorized user
  console.log('-------------------------------------------------------');
  console.log('Modifying Title with Unauthorized User');
  console.log('-------------------------------------------------------');

  const params_modify_title_unauthorized = [
    new Address(user_2.publicKey()).toScVal(),
    nativeToScVal("New Title Unauthorized", { type: "string" })
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
    const error = e;
    console.log("Expected failure in unauthorized modify_title: ", error);
  }

  // Modify admin
  console.log('-------------------------------------------------------');
  console.log('Modifying Admin');
  console.log('-------------------------------------------------------');

  const params_modify_admin = [
    new Address(new_admin.publicKey()).toScVal(),
  ];

  const result_modify_admin = await invokeContract(
    'title',
    addressBook,
    'modify_admin',
    params_modify_admin,
    admin // Current admin makes the change
  );
  console.log("Result of modify_admin: ", result_modify_admin);

  // Add new user by new admin
  console.log('-------------------------------------------------------');
  console.log('Adding User by New Admin');
  console.log('-------------------------------------------------------');

  const params_add_user_by_new_admin = [
    new Address(user_2.publicKey()).toScVal(),
  ];

  const result_add_user_by_new_admin = await invokeContract(
    'title',
    addressBook,
    'add_user',
    params_add_user_by_new_admin,
    new_admin // The new admin adds the user
  );
  console.log("Result of add_user_by_new_admin: ", result_add_user_by_new_admin);

  // Get users list
  console.log('-------------------------------------------------------');
  console.log('Getting List of Authorized Users');
  console.log('-------------------------------------------------------');

  const result_get_users = await invokeContract(
    'title',
    addressBook,
    'get_users',
    [],
    new_admin, // New admin retrieves the list of users
    true  
  );
  if (result_get_users && result_get_users.result && result_get_users.result.retval) {
    const users = scValToNative(result_get_users.result.retval);
    console.log("Authorized users: ", users);
  } else {
    console.error("Error: Unable to retrieve users, result is undefined or invalid.");
  }

  // Attempt to add a user by the initial admin (should fail)
  console.log('-------------------------------------------------------');
  console.log('Attempting to Add User by Initial Admin (Should Fail)');
  console.log('-------------------------------------------------------');

  const params_add_user_by_initial_admin = [
    new Address(user_2.publicKey()).toScVal(),
  ];

  try {
    const result_add_user_by_initial_admin = await invokeContract(
      'title',
      addressBook,
      'add_user',
      params_add_user_by_initial_admin,
      admin // Initial admin attempts to add the user
    );
    console.log("Unexpected success in add_user by initial admin: ", result_add_user_by_initial_admin);
  } catch (e) {
    const error = e;
    console.log("Expected failure in add_user by initial admin: ", error);
  }
}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testTitleContract(addressBook);
