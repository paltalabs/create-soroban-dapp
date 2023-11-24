#!/usr/bin/env node
import fs from "fs-extra";
import {execa} from "execa";
import { fileURLToPath } from "url";
import path from "path";
import inquirer from 'inquirer';


const srcDir = path.join(fileURLToPath(path.dirname(import.meta.url)),"soroban-react-dapp");
const main = async () => {
    console.log("--------------------------------------- Welcome soroban dev! -------------------------------------");
    console.log("\nYou are creating a new soroban dapp. We wish you best of luck!\n");
    console.log("\nThe script will be setting the initial boilerplate for you.\n");
    console.log("\nWARNING: This next.js project uses `pnpm`as package manager, please make sure it is installed\n");
    console.log("--------------------------------------------------------------------------------------------------\n\n");
    inquirer.prompt([
        {
            name: 'name',
            message: 'What will be the name of your project?',
            default: 'my-soroban-dapp'
        },
        {
            name: 'install',
            message: 'Do you want us to install dependencies for you?',
            default: 'y'
        },
        {
            name: 'continue',
            message: 'Should we continue and set up the dapp?',
            default: 'y'
        },
      ])
      .then(async answers => {
            const projectDir = answers.name;
          if (answers.continue == 'y' || answers.continue == 'Y' || answers.continue == 'yes') {
              console.log("")
              console.log(`\nCreation of the ${projectDir} folder and initialization of the project\n`);
              try {
                  await execa("mkdir", [projectDir]);
                }
                catch (error) {
                    console.log(`---- ERROR Getting an error with creating the soroban-react-dapp dir... \n\n Maybe the ${answers.name} folder is already existing in this directory. Consider removing it.\n\n`);
                process.exit(1);
            }
            fs.copySync(srcDir, projectDir);
            
            if (answers.install == 'y' || answers.install == 'Y' || answers.install == 'yes') {
                console.log("")
                console.log("Installing packages with 'pnpm'");
                const subprocess = execa("pnpm", ["install"], {
                    cwd: projectDir
                });
                subprocess.stdout.pipe(process.stdout)
                subprocess.stderr.pipe(process.stderr)
                await subprocess
                console.log(`\n\nYou can now cd in ${projectDir} and run 'pnpm run dev' to start the app\n`);
                console.log(`\n------------------------------------ ENJOY -----------------------------------\n`);
            }
            else {
                console.log(`\nPerfect then, we are all set!`);
                console.log(`\n\nYou can now cd in ${projectDir} and run 'pnpm install' to install dependencies and then 'pnpm run dev' to start the app\n`);
                console.log(`\n------------------------------------ ENJOY -----------------------------------\n`);
            }
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