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
    console.log("--------------------------------------------------------------------------------------------------\n\n");
    inquirer.prompt([
        {
            name: 'name',
            message: 'What will be the name of your project?',
            default: 'my-soroban-dapp'
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Please select your favourite package manager',
            choices: [
                'yarn',
                'npm',
                'pnpm'
            ]
        },
        {
            type: 'confirm',
            name: 'install',
            message: 'Do you want us to install dependencies for you?',
            default: 'y'
        },
        {
            type: 'confirm',
            name: 'continue',
            message: 'Should we continue and set up the dapp?',
            default: 'y'
        }
      ])
      .then(async answers => {
            const projectDir = answers.name;
          if (answers.continue) {
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

            switch(answers.packageManager){
                case 'pnpm': {
                    install_string = "pnpm install"
                    dev_string = "pnpm run dev"
                    break;
                }
                case 'yarn': {
                    install_string = "yarn"
                    dev_string = "yarn dev"
                    break;
                }
                case 'npm': {
                    install_string = "npm install"
                    dev_string = "npm run dev"
                    break;
                }
            }

            var install_string
            var dev_string
            
            if (answers.install) {
                console.log("")
                console.log(`Installing packages with '${answers.packageManager}'`);
                var subprocess
                switch(answers.packageManager) {
                    case 'pnpm': {
                        subprocess = execa("pnpm", ["install"], {
                            cwd: projectDir
                        });
                        subprocess.stdout.pipe(process.stdout)
                        subprocess.stderr.pipe(process.stderr)
                        break;
                    }
                    case 'yarn': {
                        subprocess = execa("yarn", {
                            cwd: projectDir
                        });
                        subprocess.stdout.pipe(process.stdout)
                        subprocess.stderr.pipe(process.stderr)
                        break;
                    }
                    case 'npm': {
                        subprocess = execa("npm", ["install"], {
                            cwd: projectDir,
                            stderr: 'inherit'
                        });
                        break;
                    }
                }
                await subprocess
                console.log(`\n\nYou can now cd in '${projectDir}' and run '${dev_string}' to start the app\n`);
                console.log(`\n------------------------------------ ENJOY -----------------------------------\n`);
            }
            else {
                console.log(`\nPerfect then, we are all set!`);
                console.log(`\n\nYou can now cd in '${projectDir}' and run '${install_string}' to install dependencies and then '${dev_string}' to start the app\n`);
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