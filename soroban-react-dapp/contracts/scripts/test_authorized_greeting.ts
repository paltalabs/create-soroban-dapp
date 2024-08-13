import { Address, Keypair, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';

const getInitParams = () => {
  const admin = loadedConfig.admin
  const initialize_params: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ]
  return { initialize_params, admin }
}

export async function testInitializeAdmin(addressBook: AddressBook) {
  console.log('===============================');
  console.log('Testing Initialize Admin');
  console.log('===============================');
  
  const { initialize_params, admin } = getInitParams()
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);
  
  const storedAdminResult = await invokeContract('authorized_greeting', addressBook, 'get_admin', [], admin, true);
  
  if (!storedAdminResult || !scValToNative(storedAdminResult.result.retval)) {
    console.error("Error: Admin not retrieved successfully.");
    return;
  }
  
  const storedAdmin = scValToNative(storedAdminResult.result.retval);
  
  if (storedAdmin === admin.publicKey()) {
    console.log("Admin was set correctly.");
  } else {
    console.error("Admin was not set correctly.");
  }
}

export async function testAddGreeterToAuthorizedGreetersList(addressBook: AddressBook) {
  console.log('===============================');
  console.log('Testing Add Greeter to Authorized Greeters List');
  console.log('===============================');
  
  const { initialize_params, admin } = getInitParams()
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);
  
  const greeter = loadedConfig.getUser("GREETER_1")
  const add_greeter_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
  ]
  
  await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  
  const authorizedGreeterListResult = await invokeContract('authorized_greeting', addressBook, 'get_authorized_greeter_list', [], admin);
  
  if (!authorizedGreeterListResult || !scValToNative(authorizedGreeterListResult.returnValue)) {
    console.error("Error: Authorized Greeter List not retrieved successfully.");
    return;
  }
  
  const authorizedGreeterList = scValToNative(authorizedGreeterListResult.returnValue);
  
  const greeterPublicKey = greeter.publicKey();
  console.assert(authorizedGreeterList[greeterPublicKey] === true, "Greeter was not added correctly");
  
  console.log("Greeter was added correctly.");
}

export async function testSetGreetUsingAnAuthorizedUser(addressBook: AddressBook) {
  console.log('===============================');
  console.log('Testing Set Greet Using An Authorized User');
  console.log('===============================');
  
  const greeter = loadedConfig.getUser("GREETER_1");
  const greetMessage = "Pobletacio was hired!";
  
  const { initialize_params, admin } = getInitParams()
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);
  
  const add_greeter_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
  ];
  
  await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  
  const set_greet_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
    nativeToScVal(greetMessage, { type: "string" }),
  ];
  
  await invokeContract('authorized_greeting', addressBook, 'set_greet', set_greet_params, greeter);
  const storedGreetResult = await invokeContract('authorized_greeting', addressBook, 'read_greet', [], greeter);
  
  if (!storedGreetResult || !scValToNative(storedGreetResult.returnValue)) {
    console.error("Error: Greet message not retrieved successfully.");
    return;
  }
  
  const storedGreet = scValToNative(storedGreetResult.returnValue);
  
  console.assert(storedGreet === greetMessage, "Greet message was not set correctly");
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀",)
  console.log("Greet message was set correctly");
  console.log("storedGreet -->", storedGreet.toUpperCase());
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀",)
}

export async function testUnauthorizedUserAddingGreeterToAGreetersWhiteList(addressBook: AddressBook) {
  console.log('===============================');
  console.log('Testing Unauthorized User Adding Greeter to an Authorized Greeter List');
  console.log('===============================');
  
  const { initialize_params, admin } = getInitParams()
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);

  const greeter = loadedConfig.getUser("GREETER_1");
  
  try {
    const add_greeter_params: xdr.ScVal[] = [
      new Address(greeter.publicKey()).toScVal(),
    ];
    // A SIMPLE GREETER CANT ADD HIMSELF TO A GREETERS WHITE LIST
    await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, greeter);
    console.assert(false, "Unauthorized user wasnt able to add a greeter");
  } catch (e) {
    console.log("Unauthorized user was not able to add a greeter as expected.");
  }
}

export async function testUnauthorizedUserSetGreet(addressBook: AddressBook) {
  console.log('===============================');
  console.log('Testing Unauthorized User Setting Greet');
  console.log('===============================');
  
  const { initialize_params, admin } = getInitParams()
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);

  const greeter = loadedConfig.getUser("GREETER_1");
  const unauthorized_greeter = loadedConfig.getUser("GREETER_2");
  const greetMessage = "Hello, Soroban!";
  
  const add_greeter_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
  ];
  
  await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  
  try {
    const set_greet_params: xdr.ScVal[] = [
      new Address(greeter.publicKey()).toScVal(),
      nativeToScVal(greetMessage, { type: "string" }),
    ];

    await invokeContract('authorized_greeting', addressBook, 'set_greet', set_greet_params, unauthorized_greeter);
    console.assert(false, "Unauthorized user wasnt able to set the greet message");
  } catch (e) {
    console.log("Unauthorized user was not able to set the greet message as expected.");
  }
}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

await testInitializeAdmin(addressBook);
await testAddGreeterToAuthorizedGreetersList(addressBook);
await testSetGreetUsingAnAuthorizedUser(addressBook);
await testUnauthorizedUserAddingGreeterToAGreetersWhiteList(addressBook);
await testUnauthorizedUserSetGreet(addressBook);
