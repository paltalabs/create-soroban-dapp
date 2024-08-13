import { Address, Keypair, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';

function createKeypair(): Keypair {
  return Keypair.random();
}

export async function testInitialize(addressBook: AddressBook) {
  console.log('Testing Initialize');
  const admin = loadedConfig.admin

  const initialize_params: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ]

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

export async function testAddGreeter(addressBook: AddressBook) {
  console.log('Testing Add Greeter');
  
  const admin = loadedConfig.admin
  const initialize_params: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ]
  
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

export async function testSetGreet(addressBook: AddressBook) {
  console.log('Testing Set Greet');
  
  const admin = loadedConfig.admin;
  console.log("🚀 ~ testSetGreet ~ admin:", admin.publicKey())
  const greeter = loadedConfig.getUser("GREETER_1");
  console.log("🚀 ~ testSetGreet ~ greeter:", greeter.publicKey())
  const greetMessage = "Pobletacio was hired!";
  
  const initialize_params: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ];
  
  await invokeContract('authorized_greeting', addressBook, 'initialize', initialize_params, admin);

  const add_greeter_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
  ];
  
  await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);

  const set_greet_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
    nativeToScVal(greetMessage, { type: "string" }),
  ];
  
  const setGreetResult = await invokeContract('authorized_greeting', addressBook, 'set_greet', set_greet_params, greeter);
  console.log("🚀 ~ testSetGreet ~ setGreetResult:", setGreetResult)

  const storedGreetResult = await invokeContract('authorized_greeting', addressBook, 'read_greet', [], greeter);
  
  if (!storedGreetResult || !scValToNative(storedGreetResult.returnValue)) {
    console.error("Error: Greet message not retrieved successfully.");
    return;
  }

  const storedGreet = scValToNative(storedGreetResult.returnValue);

  console.assert(storedGreet === greetMessage, "Greet message was not set correctly");
  console.log("Greet message was set correctly.");
}

export async function testUnauthorizedAddGreeter(addressBook: AddressBook) {
  console.log('Testing Unauthorized Add Greeter');
  
  const admin = createKeypair();
  const greeter = createKeypair();
  const unauthorizedUser = createKeypair();

  await invokeContract('authorized_greeting', addressBook, 'initialize', [nativeToScVal(admin.publicKey())], admin);

  try {
    await invokeContract('authorized_greeting', addressBook, 'add_greeter', [nativeToScVal(greeter.publicKey())], unauthorizedUser);
    console.assert(false, "Unauthorized user was able to add a greeter");
  } catch (e) {
    console.log("Unauthorized user was not able to add a greeter as expected.");
  }
}

export async function testUnauthorizedSetGreet(addressBook: AddressBook) {
  console.log('Testing Unauthorized Set Greet');
  
  const admin = createKeypair();
  const greeter = createKeypair();
  const unauthorizedUser = createKeypair();
  const greetMessage = "Hello, Soroban!";

  await invokeContract('authorized_greeting', addressBook, 'initialize', [nativeToScVal(admin.publicKey())], admin);

  await invokeContract('authorized_greeting', addressBook, 'add_greeter', [nativeToScVal(greeter.publicKey())], admin);

  try {
    await invokeContract('authorized_greeting', addressBook, 'set_greet', [nativeToScVal(greeter.publicKey()), nativeToScVal(greetMessage)], unauthorizedUser);
    console.assert(false, "Unauthorized user was able to set the greet message");
  } catch (e) {
    console.log("Unauthorized user was not able to set the greet message as expected.");
  }
}

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

// await testInitialize(addressBook);
// await testAddGreeter(addressBook);
await testSetGreet(addressBook);
await testUnauthorizedAddGreeter(addressBook);
await testUnauthorizedSetGreet(addressBook);
