# Manual cloning

If you prefer to manually clone the repository instead of using the NPX script, follow these steps:

## Clone the Repository

**Clone the repository using the following command:**

`git clone git@github.com:paltalabs/create-soroban-dapp.git`

## Navigate to the Project Folder

The main project (dapp) will be located in a subfolder named `soroban-react-dapp`, not in the root directory. The root directory is occupied by the NPX script.

**Navigate to the subfolder:**

`cd soroban-react-dapp`

## Install Dependencies

Inside the `soroban-react-dapp` folder, install the necessary dependencies. You can use Yarn, npm, or pnpm as per your preference:

`yarn install` or `npm install` or `pnpm install`

> Important Note: When using this manual cloning technique, you will also clone the NPX script located in the root folder. This script will not be necessary for your manually cloned project. You can choose to keep only the `soroban-react-dapp` subfolder, which contains the actual Next.js project.
