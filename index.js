#!/usr/bin/env node
import fs from "fs-extra";
import {execa} from "execa";
import { fileURLToPath } from "url";
import path from "path";
import inquirer from 'inquirer';

const projectDir = "./soroban-react-dapp/";
const srcDir = path.join(fileURLToPath(path.dirname(import.meta.url)),"test-react-create-app");
const main = async () => {
    console.log("------------------------------ Welcome soroban dev! ----------------------------");
    console.log("\nYou are creating a new soroban dapp. We wish you best of luck!\n");
    console.log("\nThe script will be setting the initial boilerplate for you.\n");
    console.log("--------------------------------------------------------------------------------\n\n");
    inquirer.prompt([
        {
            name: 'continue',
            message: 'Shall we continue?',
            default: 'y'
        },
      ])
      .then(async answers => {
          if (answers.continue == 'y' || answers.continue == 'Y' || answers.continue == 'yes') {
              console.log("")
              console.log("\nCreation of the 'soroban-react-dapp' folder and initialization of the project\n");
              try {
                  await execa("mkdir", [projectDir]);
                }
                catch (error) {
                    console.log("---- ERROR Getting an error with creating the soroban-react-dapp dir... \n\n Maybe the soroban-react-folder is already existing in this directory. Consider removing it.\n\n");
                process.exit(1);
            }
            fs.copySync(srcDir, projectDir);
            inquirer.prompt([
                {
                    name: 'install',
                    message: 'Do you want us to install dependencies for you?',
                    default: 'y'
                },
            ])
            .then(async answers => {
                if (answers.install == 'y' || answers.install == 'Y' || answers.install == 'yes') {
                    console.log("")
                    console.log("Installing packages with 'yarn'");
                    await execa("yarn", [], {
                        cwd: projectDir
                    });
                    console.log("\n\nYou can now cd in 'soroban-react-dapp' and run 'yarn dev' to start the app\n");
                    console.log("\n------------------------------------ ENJOY -----------------------------------\n");
                }
                else {
                    
                    console.log("\n              Perfect then, we are all set!");
                    console.log("\n\nYou can now cd in 'soroban-react-dapp' to install dependencies and then 'yarn dev' to launch the app.\n");
                    console.log("\n------------------------------------ ENJOY -----------------------------------\n");
                }
              });
        }
        else {
            console.log("OK aborting...");
        }
    });
    
}

main().catch((err) => {
    console.log("Error happened: ",err);
    process.exit(1);
});