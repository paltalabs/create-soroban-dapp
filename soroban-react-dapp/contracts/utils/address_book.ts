import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AddressBook {
  private ids: Map<string, string>;
  private hashes: Map<string, string>;
  private fileName: string;
  private deployments: Array<any>;
  private loadedConfig: any;
  private deploymentsFilePath: string;

  constructor(ids: Map<string, string>, hashes: Map<string, string>, fileName: string, loadedConfig: any) {
    this.ids = ids;
    this.hashes = hashes;
    this.fileName = fileName;

    this.loadedConfig = loadedConfig;
    const dirPath = path.join(__dirname, '../../');
    this.deploymentsFilePath = path.join(dirPath, 'deployments.json');
    if (!existsSync(this.deploymentsFilePath)) {
      writeFileSync(this.deploymentsFilePath, JSON.stringify([]));
    }
    this.deployments = JSON.parse(readFileSync(this.deploymentsFilePath, 'utf-8'));
  }

  /**
   * Load the address book from a file or create a blank one
   *
   * @param network - The network to load the contracts for
   * @returns Contracts object loaded based on the network
   */
  static loadFromFile(network: string, loadedConfig: any, folder: string = '.soroban') {
    const fileName = `../../${folder}/${network}.contracts.json`;
    try {
      const contractFile = readFileSync(path.join(__dirname, fileName));
      const contractObj = JSON.parse(contractFile.toString());
      return new AddressBook(
        new Map(Object.entries(contractObj.ids)),
        new Map(Object.entries(contractObj.hashes)),
        fileName,
        loadedConfig
      );
    } catch {
      // unable to load file, it likely doesn't exist
      return new AddressBook(new Map(), new Map(), fileName, loadedConfig);
    }
  }

  updateDeployments(contractkey: string) {
    var updated = false;
    this.deployments.forEach((deploymentInfo: any) => {
      if (deploymentInfo.contractId == contractkey && deploymentInfo.networkPassphrase == this.loadedConfig.passphrase){
        deploymentInfo.contractAddress = this.ids.get(contractkey);
        updated = true;
      }
    })

    if (!updated) {
      this.deployments.push({
        contractId: contractkey,
        networkPassphrase: this.loadedConfig.passphrase,
        contractAddress: this.ids.get(contractkey)
      })
    }
  }

  /**
   * Write the current address book to a file
   */
  writeToFile() {
    const dirPath = path.join(__dirname, '../../.soroban/');
    const filePath = path.join(__dirname, this.fileName);

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const newFile = JSON.stringify(
      {
        ids: this.ids,
        hashes: this.hashes
      },
      (key, value) => {
        if (value instanceof Map) {
          return Object.fromEntries(value);
        } else {
          // Use strict inequality
          return value;
        }
      },
      2
    );

    writeFileSync(filePath, newFile);
    
    // Do the same with updated deployments.json
    const newDeploymentFile = JSON.stringify(
      this.deployments,
      (key, value) => {
        if (value instanceof Map) {
          return Object.fromEntries(value);
        } else {
          // Use strict inequality
          return value;
        }
      },
      2
    )
    
    writeFileSync(this.deploymentsFilePath, newDeploymentFile);
  }

  /**
   * Get the hex encoded contractId for a given contractKey
   * @param contractKey - The name of the contract
   * @returns Hex encoded contractId
   */
  getContractId(contractKey: string) {
    const contractId = this.ids.get(contractKey);

    if (contractId != undefined) {
      return contractId;
    } else {
      console.error(`unable to find address for ${contractKey} in ${this.fileName}`);
      throw Error();
    }
  }

  /**
   * Set the hex encoded contractId for a given contractKey
   * @param contractKey - The name of the contract
   * @param contractId Hex encoded contractId
   */
  setContractId(contractKey: string, contractId: string) {
    this.ids.set(contractKey, contractId);

    // We update the deployments.json file used for contract registry
    this.updateDeployments(contractKey)
  }

  /**
   * Get the hex encoded wasmHash for a given contractKey
   * @param contractKey - The name of the contract
   * @returns Hex encoded wasmHash
   */
  getWasmHash(contractKey: string) {
    const washHash = this.hashes.get(contractKey);

    if (washHash != undefined) {
      return washHash;
    } else {
      console.error(`unable to find hash for ${contractKey} in ${this.fileName}`);
      throw Error();
    }
  }

  /**
   * Set the hex encoded wasmHash for a given contractKey
   * @param contractKey - The name of the contract
   * @param wasmHash - Hex encoded wasmHash
   */
  setWasmHash(contractKey: string, wasmHash: string) {
    this.hashes.set(contractKey, wasmHash);
  }
}
