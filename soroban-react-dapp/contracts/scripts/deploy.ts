import { AddressBook } from '../utils/address_book.js';
import { airdropAccount, deployContract, installContract} from '../utils/contract.js';
import { config } from '../utils/env_config.js';

export async function deployContracts(addressBook: AddressBook, contracts_to_deploy: Array<string>) {

  if (network != "mainnet") await airdropAccount(loadedConfig.admin);
  let account = await loadedConfig.horizonRpc.loadAccount(loadedConfig.admin.publicKey())
  let balance = account.balances[0].balance
  console.log('Current Admin account balance:', balance);
  
  console.log('-------------------------------------------------------');
  console.log('Deploying Contracts');
  console.log('-------------------------------------------------------');
  for (var contract_name of contracts_to_deploy) {
    console.log(`Deploying ${contract_name}: `)
    await installContract(contract_name, addressBook, loadedConfig.admin);
    // await bumpContractCode(contract_name, addressBook, loadedConfig.admin);
    let contractId = await deployContract(contract_name,contract_name, addressBook, loadedConfig.admin)
    // await bumpContractInstance(contract_name, addressBook, loadedConfig.admin);
    console.log(`Contract ID of ${contract_name} is ${contractId}\n\n`)
  }
  
}

const network = process.argv[2];
const contracts_to_deploy = process.argv.slice(3)
const loadedConfig = config(network);
const addressBook = AddressBook.loadFromFile(network,loadedConfig);

try {
  await deployContracts(addressBook, contracts_to_deploy);
}
catch (e) {
  console.error(e)
}
addressBook.writeToFile();
