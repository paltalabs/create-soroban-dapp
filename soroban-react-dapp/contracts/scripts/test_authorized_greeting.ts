import { Address, Keypair, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
import { AddressBook } from '../utils/address_book.js';
import { invokeContract } from '../utils/contract.js';
import { config } from '../utils/env_config.js';

const network = process.argv[2];
const loadedConfig = config(network);

const addressBook = AddressBook.loadFromFile(network, loadedConfig);

export async function setAdmin(addressBook: AddressBook) {
  console.log('==================================================');
  console.log('Testing Admin Set');
  console.log('==================================================');

  const admin = loadedConfig.admin;
  const set_admin_params = setAdminParams(admin);
  const set_admin_result = await invokeContract('authorized_greeting', addressBook, 'set_admin', set_admin_params, admin);
  set_admin_result.status == "SUCCESS" ? null : getResponseMessage('adminNotSetCorrectly')
  
  const storedAdminResult = await invokeContract('authorized_greeting', addressBook, 'get_admin', [], admin, true);
  !storedAdminResult || !scValToNative(storedAdminResult.result.retval) ? getResponseMessage('adminSetFailure') : null

  const storedAdmin = scValToNative(storedAdminResult.result.retval);
  storedAdmin === admin.publicKey() ? getResponseMessage('adminSetSuccess') : getResponseMessage('adminNotSetCorrectly');
}

export async function addGreeterToAuthorizedList(addressBook: AddressBook) {
  console.log('==================================================');
  console.log('Testing Add Greeter to Authorized Greeters List');
  console.log('==================================================');
  
  const admin = loadedConfig.admin;
  const set_admin_params = setAdminParams(admin);
  const set_admin_result = await invokeContract('authorized_greeting', addressBook, 'set_admin', set_admin_params, admin);
  set_admin_result.status == "SUCCESS" ? null : getResponseMessage('adminNotSetCorrectly')
  
  const greeter = loadedConfig.getUser("GREETER")
  const add_greeter_params = addGreeterParams(greeter)
  const add_greeter_result = await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  add_greeter_result.status == "SUCCESS" ? null : getResponseMessage('greeterAddIncorrect')
  
  const authorizedGreeterListResult = await invokeContract('authorized_greeting', addressBook, 'get_authorized_greeter_list', [], admin);
  
  !authorizedGreeterListResult || !scValToNative(authorizedGreeterListResult.returnValue) ? getResponseMessage('greeterAddFailure') : null
  
  const authorizedGreeterList = scValToNative(authorizedGreeterListResult.returnValue);
  
  const greeterPublicKey = greeter.publicKey();
  authorizedGreeterList[greeterPublicKey] === true ? getResponseMessage('greeterAddSuccess') : getResponseMessage('greeterAddIncorrect');
}

export async function authorizedUserGreetSet(addressBook: AddressBook) {
  console.log('==================================================');
  console.log('Testing Set Greet Using An Authorized User');
  console.log('==================================================');

  const greetMessage = "POBLETACIO WAS HIRED!";
  
  const admin = loadedConfig.admin;
  const set_admin_params = setAdminParams(admin);
  const set_admin_result = await invokeContract('authorized_greeting', addressBook, 'set_admin', set_admin_params, admin);
  set_admin_result.status == "SUCCESS" ? null : getResponseMessage('adminNotSetCorrectly')
  
  const greeter = loadedConfig.getUser("GREETER")
  const add_greeter_params = addGreeterParams(greeter)
  const add_greeter_result = await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  add_greeter_result.status == "SUCCESS" ? null : getResponseMessage('greeterAddIncorrect')
  
  const set_greet_params = setGreetParams(greetMessage, greeter)
  const set_greet_result = await invokeContract('authorized_greeting', addressBook, 'set_greet', set_greet_params, greeter);
  set_greet_result.status == "SUCCESS" ? null : getResponseMessage('greetSetSuccess')

  const storedGreetResult = await invokeContract('authorized_greeting', addressBook, 'read_greet', [], greeter);
  
  !storedGreetResult || !scValToNative(storedGreetResult.returnValue) ? getResponseMessage('greetSetFailure') : null
  const storedGreet = scValToNative(storedGreetResult.returnValue);

  if (storedGreet === greetMessage) {
    getResponseMessage('greetSetSuccess');
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
    console.log("storedGreet -->", storedGreet.toUpperCase());
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
  } else {
    getResponseMessage('greetSetFailure');
  }
}

export async function unauthorizedUserGreeterSet(addressBook: AddressBook) {
  console.log('==================================================');
  console.log('Testing Unauthorized User Adding Greeter to Authorized Greeters List');
  console.log('==================================================');
  
  const admin = loadedConfig.admin;
  const set_admin_params = setAdminParams(admin);
  const set_admin_result = await invokeContract('authorized_greeting', addressBook, 'set_admin', set_admin_params, admin);
  set_admin_result.status == "SUCCESS" ? null : getResponseMessage('adminNotSetCorrectly')

  try {
    const greeter = loadedConfig.getUser("GREETER")
    const add_greeter_params = addGreeterParams(greeter)
    const add_greeter_result = await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
    add_greeter_result.status == "SUCCESS" ? null : getResponseMessage('greeterAddIncorrect')

    const unauthorizedUserAddingGreeter = await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, greeter);
    unauthorizedUserAddingGreeter.status == "FAILED" ? getResponseMessage('unauthorizedGreeterAddSuccess') : getResponseMessage('unauthorizedGreeterAddFailure');
  } catch (e) {
    getResponseMessage('unauthorizedGreeterAddFailure');
  }
}

export async function unauthorizedUserGreetSet(addressBook: AddressBook) {
  console.log('==================================================');
  console.log('Testing Unauthorized User Setting Greet');
  console.log('==================================================');
  
  const admin = loadedConfig.admin;
  const set_admin_params = setAdminParams(admin);
  await invokeContract('authorized_greeting', addressBook, 'set_admin', set_admin_params, admin);
  
  const greeter = loadedConfig.getUser("GREETER")
  const add_greeter_params = addGreeterParams(greeter)
  const add_greeter_result = await invokeContract('authorized_greeting', addressBook, 'add_greeter', add_greeter_params, admin);
  add_greeter_result.status == "SUCCESS" ? null : getResponseMessage('greeterAddIncorrect')
  
  try {
    const greetMessage = "I'm an unauthorized message";
    const set_greet_params = setGreetParams(greetMessage, greeter);
    
    // Check if the unauthorized greet set was unexpectedly successful
    const unauthorized_greeter = loadedConfig.getUser("UNAUTHORIZED_GREETER");
    const set_greet_result = await invokeContract('authorized_greeting', addressBook, 'set_greet', set_greet_params, unauthorized_greeter);
    set_greet_result.status == "FAILED" ? getResponseMessage('unauthorizedGreetSetSuccess') : getResponseMessage('unauthorizedGreetSetFailure');

  } catch (e) {
    getResponseMessage('unauthorizedGreetSetFailure');
  }
}

type MessageKey =
  | 'adminSetSuccess'
  | 'adminSetFailure'
  | 'adminNotSetCorrectly'
  | 'greeterAddSuccess'
  | 'greeterAddFailure'
  | 'greeterAddIncorrect'
  | 'greetSetSuccess'
  | 'greetSetFailure'
  | 'unauthorizedGreeterAddSuccess'
  | 'unauthorizedGreeterAddFailure'
  | 'unauthorizedGreetSetSuccess'
  | 'unauthorizedGreetSetFailure';

const getResponseMessage = (messageKey: MessageKey): void => {
  const messages = {
    adminSetSuccess: { message: "Admin was set correctly.✔️", type: "success" },
    greeterAddSuccess: { message: "Greeter was authorized correctly.✔️", type: "success" },
    greetSetSuccess: { message: "Greet message was set correctly.✔️", type: "success" },
    unauthorizedGreeterAddSuccess: { message: "Unauthorized user was not able to add a greeter.✔️", type: "success" },
    unauthorizedGreetSetSuccess: { message: "Unauthorized user was not able to set the greet message.✔️", type: "success" },
    adminSetFailure: { message: "Error: Admin not retrieved successfully.❌", type: "failure" },
    adminNotSetCorrectly: { message: "Error: Admin was not set correctly.❌", type: "failure" },
    greeterAddFailure: { message: "Error: Authorized Greeter List not retrieved successfully.❌", type: "failure" },
    greeterAddIncorrect: { message: "Error: Greeter was not added correctly.❌", type: "failure" },
    greetSetFailure: { message: "Error: Greet message not retrieved successfully.❌", type: "failure" },
    unauthorizedGreeterAddFailure: { message: "Error: Unauthorized user was able to add a greeter.❌", type: "failure" },
    unauthorizedGreetSetFailure: { message: "Error: Unauthorized user was able to set the greet message.❌", type: "failure" },
  };

  const { message, type } = messages[messageKey] || { message: "Message key not found.", type: "error" };

  if (type === "log") {
    console.log(message);
  } else {
    console.error(message);
  }
};

const setAdminParams = (admin: any) => {
  const set_admin_params: xdr.ScVal[] = [
    new Address(admin.publicKey()).toScVal(),
  ]
  return set_admin_params
}

const addGreeterParams = (greeter: any) => {
  const add_greeter_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
  ]
  return add_greeter_params
}

const setGreetParams = (greetMessage: any, greeter: any) => {
  const set_greet_params: xdr.ScVal[] = [
    new Address(greeter.publicKey()).toScVal(),
    nativeToScVal(greetMessage, { type: "string" }),
  ];
  return set_greet_params
}

await setAdmin(addressBook);
await addGreeterToAuthorizedList(addressBook);
await authorizedUserGreetSet(addressBook);
await unauthorizedUserGreeterSet(addressBook);
await unauthorizedUserGreetSet(addressBook);
