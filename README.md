<!-- # @create-soroban-dapp.

@create-soroban-dapp is both a npx script and a boilerplate dapp for kickstarting any of your ideas for a Soroban-based Dapp.

Largely inspired by the [ink!athon](https://github.com/scio-labs/inkathon) project by [Scio Labs](https://github.com/scio-labs) and by [@create-t3-app](https://github.com/t3-oss/create-t3-app) by [T3 Open Source](https://github.com/t3-oss) for the script mechanisms.

Check the [`LIVE VERSION`](https://create-soroban-dapp.vercel.app/) of the dapp utilizing already deployed testnet contract!

***Read the docs [here](create-soroban-dapp.paltalabs.io)***  📚📚

# Introduction

`@create-soroban-dapp` is composed of two things:

- A boilerplate dapp utilizing the [@soroban-react](https://github.com/paltalabs/soroban-react).

- A npx script allowing any developer to quickstart its project via the command line and `npx create-soroban-dapp`

# Usage:

Simply use

`npx create-soroban-dapp@latest`

or

`npm create soroban-dapp@latest`

Then, cd inside the new project repository.

# Troubleshooting

## If npm create script malfunctions

The script in its early stage is likely to not function perfectly on every different os and configuration. If the script happens to not function properly 'please report to @benjaminsalon' on the stellar developer discord channel.

## Manual cloning

It is also possible to use the dapp boilerplate via manually cloning the repo:

`git clone git@github.com:paltalabs/create-soroban-dapp.git`

The dapp will then not be in the root folder, this folder is occupied by the npx script. You will find the dapp in the sub folder 'soroban-react-dapp':

`cd soroban-react-dapp`

From there, it is a normal nextjs app:

`yarn` or `npm install` or `pnpm install`


# Set up your secrets!
When deploying our contracts, we will need to the secret key of the deployer account. This secret key will be in a ignored file in `./contracts/.env`.

To set up your secrets do
```bash
cp contracts/.env.example contracts/.env
```
If you are already inside the contracts folder (due to being inside the Docker Container), just do `cp .env.example .env`

And then edit the `.env` file, that will look like this:
```bash
# Stellar accounts Secret Keys
ADMIN_SECRET_KEY=

# RPC Setup
MAINNET_RPC_URL=
```
You can generate new Accounts and Private Keys from https://laboratory.stellar.org/#account-creator?network=test

If you plan to deploy in Mainnet, you will also need a Mainnet RPC Provider. Find one in https://app.validationcloud.io/ or in https://nownodes.io/


# Get those containers up!

We will use docker-compose to get the containers up and running. This will rise a container for a local Stellar blockchain and another container with soroban-preview, which has all the necessary dependancies to deploy and interact with the contracts. Along with the dapp container that will run the front-end of the dapp.

```bash
# move to the right directory
cd soroban-react-dapp/

# Then, run the containers
docker compose up -d

# To get inside the soroban-preview container
bash run.sh
# or
# docker exec --tty --interactive soroban-contracts bash
```
Inside the container we can now compile the contracts, install the packages and deploy the contracts.

```bash
# move to the contracts folder
cd contracts

# build
make build

# Install dependencies and deploy the contract
yarn install
yarn deploy testnet greeting
```
Now we can run our frontend

```bash
# move to the parent folder
cd ..
# install the dependencies
yarn
# run the frontend in development mode
yarn dev
 -->

# @create-soroban-dapp

`@create-soroban-dapp` is both an `npx` script and a boilerplate dApp for kickstarting any of your ideas for a Soroban-based DApp.

Largely inspired by the [ink!athon](https://github.com/scio-labs/inkathon) project by [Scio Labs](https://github.com/scio-labs) and by [@create-t3-app](https://github.com/t3-oss/create-t3-app) by [T3 Open Source](https://github.com/t3-oss) for the script mechanisms.

Check the [`LIVE VERSION`](https://create-soroban-dapp.vercel.app/) of the dApp utilizing already deployed testnet contracts!

**_Read the docs [here](https://create-soroban-dapp.paltalabs.io)_** 📚📚

## Introduction

`@create-soroban-dapp` is composed of two key components:

- A boilerplate dApp utilizing the [@soroban-react](https://github.com/paltalabs/soroban-react) library.
- An `npx` script allowing any developer to quickly start their project via the command line using `npx create-soroban-dapp`.

## Usage

To create a new Soroban dApp project, simply use one of the following commands:

```bash
npx create-soroban-dapp@latest
```

or

```bash
npm create soroban-dapp@latest
```

After the script completes, navigate into your newly created project directory:

```bash
cd your-project-name
```

## Troubleshooting

### If the `npm create` Script Malfunctions

The script, in its early stage, might not function perfectly on every OS and configuration. If it fails to run properly, please report the issue to `@benjaminsalon` on the Stellar developer Discord channel.

### Manual Cloning

If the script fails or if you prefer manual setup, you can clone the repository directly:

```bash
git clone git@github.com:paltalabs/create-soroban-dapp.git
```

After cloning, the dApp will not be in the root folder. Instead, you'll find it in the `soroban-react-dapp` subfolder:

```bash
cd soroban-react-dapp
```

From there, it functions like a standard Next.js app:

```bash
yarn install
# or npm install
# or pnpm install
```

## Set Up Your Secrets!

When deploying contracts, you'll need the secret key of the deployer account. This secret key will be stored in an ignored file located at `./contracts/.env`.

To set up your secrets, run:

```bash
cp contracts/.env.example contracts/.env
```

If you're already inside the contracts folder (e.g., within the Docker Container), run:

```bash
cp .env.example .env
```

Then, edit the `.env` file lcoated in `soroban-react-dapp/contracts` to include your secret keys and RPC URLs. The `.env` file should look like this:

```bash
# Stellar accounts Secret Keys
ADMIN_SECRET_KEY=

# RPC Setup
MAINNET_RPC_URL=
```

You can generate new accounts and private keys from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).

If you plan to deploy on the mainnet, you'll also need a Mainnet RPC Provider. You can find one at [Validation Cloud](https://app.validationcloud.io/) or [NowNodes](https://nownodes.io/).

## Get Those Containers Up!

We will use Docker Compose to set up and run the necessary containers. This includes a container for a local Stellar blockchain and another container with Soroban Preview, which contains all the dependencies needed to deploy and interact with the contracts.

### 1. Move to the Right Directory

First, navigate to the `soroban-react-dapp/` directory where the `docker-compose.yml` file is located:

```bash
cd soroban-react-dapp/
```

### 2. Setting up the containers

#### 2.1 Copy the .env File
To give a custom name to the project, copy the `.env.example` file to `.env` using:

````
cp .env.example .env
````

#### 2.2 Naming the containers
then, edit the `.env` file in your `soroban-react-dapp` folder to include your project ID:

```bash
PROJECT_ID=your-project-id
```

> [!NOTE]
> By default the containers name will be something like `soroban-preview-${dirname-timestamp}` and `soroban-contracts-${dirname-timestamp}`.

### 3 Run the Containers

To bring up the necessary containers, run:

```bash
bash run.sh
```

This command will start the following services:

- **soroban-preview**: Provides the Soroban environment required to compile, deploy, and interact with your contracts. This container will have the terminal attached to it, allowing for direct interaction with the Soroban environment.
- **stellar**: Runs a local Stellar blockchain with Soroban support enabled. This service will run in the background, providing the necessary infrastructure for the Soroban environment.

### 4. Compile and Deploy Contracts

Once inside the `soroban-preview` container, navigate to the `contracts/` directory to compile and deploy your contracts:

```bash
# Move to the contracts folder
cd contracts

# Build the contracts
make build

# Install dependencies and deploy the contract
yarn install
yarn deploy testnet greeting
```

### 5. Run the Frontend

After deploying the contracts, you can start the frontend of your dApp:

```bash
# Move to the parent folder
cd ..

# Install the dependencies
yarn

# Run the frontend in development mode
yarn dev
```

### 6. Stopping the Containers

To stop the containers when you're done, run:

```bash
docker compose down
```

### 7. Explanation of the `docker-compose.yml` Configuration

Here’s a breakdown of the `docker-compose.yml` file:

- **soroban-preview**:

  - **image**: Uses the `esteblock/soroban-preview:21.0.1` image.
  - **container_name**: The container name is dynamically set based on the `${PROJECT_ID}`.
  - **volumes**: Maps the current directory to `/workspace` inside the container.
  - **ipc: host**: Shares the IPC namespace with the host.
  - **ports**: Exposes port `3000` on the host, which will be used for the frontend.
  - **networks**: The container is connected to the `create-soroban-network`.
  - **command**: Keeps the container running by executing `tail -f /dev/null`.

- **stellar**:

  - **image**: Uses the `stellar/quickstart` image with Soroban support.
  - **container_name**: The container name is dynamically set based on the `${PROJECT_ID}`.
  - **networks**: Connected to the `create-soroban-network`.
  - **ports**: Exposes port `8000` on the host, used for interacting with the Stellar blockchain.
  - **command**: Runs Stellar with Soroban RPC and diagnostic events enabled.

- **networks**:
  - **create-soroban-network**: A custom bridge network for container communication.

This setup ensures a fully functional development environment for Soroban dApp development.
