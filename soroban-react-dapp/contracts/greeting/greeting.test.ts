import { expect } from 'chai';
import { config } from "../utils/env_config.js";
import { AddressBook } from "../utils/address_book.js";
import { deployContract,invokeContract } from "../utils/contract.js";
import { Keypair } from "@stellar/stellar-sdk";
const network = "testnet"; //https://horizon-testnet.stellar.org;
const loadFromFile = config(network);
const Mykeys = Keypair.fromSecret(loadFromFile.admin.secret());//Contains accourding keys with. env file
describe('Greeting Contract deployment test', function () {
    const addressBook = AddressBook.loadFromFile(network, loadFromFile);
    const currentContractHash = addressBook.getContractId("greeting");//
    const wasmHash = addressBook.getWasmHash("greeting");
    it('--Confirmation of the deployment on horizon testnet', async function () {
        const contractId = await deployContract(currentContractHash, wasmHash, addressBook, Mykeys);
        expect(contractId).to.be.a('string');
        expect(contractId).to.have.lengthOf.at.least(2);
        expect(contractId).not.to.be.null;
    });
    it('--Invoking the contract', async function() {
        const contractInfo = await invokeContract(currentContractHash, addressBook, "read_title", [], Mykeys);
        expect(contractInfo).to.be.a('object');
        expect(contractInfo.status).to.equal('SUCCESS');
    });
});