import "dotenv/config";
import { xdr } from '@stellar/stellar-sdk';
import {
  createToolkit,
  airdropAccount,
  deployContract,
  installContract,
} from "soroban-toolkit";

export const toolkitLoader = createToolkit({
  adminSecret: process.env.ADMIN_SECRET_KEY!,
  contractPaths: {
    greeting: "./greeting/target/wasm32-unknown-unknown/release/greeting.wasm"
  },
  customNetworks: [],
  verbose: "full",
});


export async function deployContracts(contracts_to_deploy: Array<string>) {

  if (network != "mainnet") await airdropAccount(toolkit, toolkit.admin);

  let account = await toolkit.horizonRpc.loadAccount(toolkit.admin.publicKey());
  console.log("publicKey", toolkit.admin.publicKey());
  let balance = account.balances.filter((item) => item.asset_type == "native");
  console.log("Current Admin account balance:", balance[0].balance);

  console.log('-------------------------------------------------------');
  console.log('Deploying Contracts');
  console.log('-------------------------------------------------------');


  for (var contract_name of contracts_to_deploy) {
    await installContract(toolkit, contract_name, undefined, toolkit.admin);
    const factoryInitParams: xdr.ScVal[]= [];

    let contractId = await deployContract(
      toolkit,
      contract_name,contract_name,
      factoryInitParams,
      toolkit.admin
    );
    
    console.log(`Contract ID of ${contract_name} is ${contractId}\n\n`)
  }

  
}

const network = process.argv[2];
const toolkit = toolkitLoader.getNetworkToolkit(network);
const contracts_to_deploy = process.argv.slice(3)


try {
  await deployContracts(contracts_to_deploy);
}
catch (e) {
  console.error(e)
}
toolkit.addressBook.writeToFile();

