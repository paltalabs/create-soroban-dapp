# Soroban DApp Setup Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Dependencies](#dependencies)
3. [Installation Instructions](#installation-instructions)
4. [Script Execution Instructions](#script-execution-instructions)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Updating `preview_version.json`](#updating-preview_versionjson)
7. [Updating `quickstart.sh`](#updating-quickstartsh)
8. [Tutorial: Building and Running `esteblock/soroban-preview-docker` Image](#tutorial-building-and-running-esteblocksoroban-preview-docker-image)
9. [Acceptance Criteria](#acceptance-criteria)


## Introduction
This documentation provides detailed steps to successfully set up and deploy your Soroban-based decentralized application (DApp) using **@create-soroban-dapp**. This guide ensures you can quickly start your project with a robust boilerplate DApp built on **@soroban-react**.
 

`@create-soroban-dapp` is both an npx script and a boilerplate DApp, inspired by the ink!athon project by Scio Labs and @create-t3-app by T3 Open Source for script mechanisms.



Read the docs here 📚📚

## Dependencies
To successfully set up a Soroban DApp, you need to have the following dependencies installed:

- **Docker**: Required for containerized environment setup.
- **Node.js**: Version 12 or higher.
- **npm** or **yarn**: Package managers for managing Node.js packages.


## Installation Instructions
### Step-by-Step Instructions to Install the dependencies

### Docker
Docker is an essential tool for containerization, which allows you to package and run your applications in isolated environments.

#### Steps to Install Docker

1. **Download Docker:**
   - Visit the [Docker official website](https://www.docker.com/products/docker-desktop) and download Docker Desktop for your operating system.

2. **Install Docker:**
   - Follow the installation instructions provided on the Docker website for your specific OS.

3. **Verify Installation:**
   - Open a terminal or command prompt and run the following command to verify Docker is installed correctly:
     ```bash
     docker --version
     ```
   - You should see the Docker version information if the installation was successful.
  



### Node.js 

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, and npm (Node Package Manager) is the default package manager for Node.js.

#### Windows

1. **Download Node.js:**
   - Visit the [Node.js download page](https://nodejs.org/).
   - Download the Windows Installer (MSI) for the latest LTS (Long Term Support) version.

2. **Install Node.js:**
   - Run the downloaded `.msi` installer.
   - Follow the installation prompts and accept the license agreement.
   - Choose the installation path (default is recommended).
   - Ensure that the "Install npm" option is checked.

3. **Verify Installation:**
   - Open Command Prompt and run the following commands:
     ```sh
     node --version
     npm --version
     ```
   - You should see the installed versions of Node.js and npm.

#### macOS

1. **Download Node.js:**
   - Visit the [Node.js download page](https://nodejs.org/).
   - Download the macOS Installer (PKG) for the latest LTS version.

2. **Install Node.js:**
   - Open the downloaded `.pkg` installer.
   - Follow the installation prompts and accept the license agreement.

3. **Verify Installation:**
   - Open Terminal and run the following commands:
     ```sh
     node --version
     npm --version
     ```
   - You should see the installed versions of Node.js and npm.

#### Linux

1. **Use NodeSource Binaries (recommended for most distributions):**

   - Open Terminal and run the following commands to install Node.js and npm:
     ```sh
     curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

2. **Verify Installation:**
   - Run the following commands:
     ```sh
     node --version
     npm --version
     ```
   - You should see the installed versions of Node.js and npm.

### Installing Yarn

Yarn is an alternative package manager to npm, known for its speed and reliability.

#### Windows

1. **Install via npm:**
   - Open Command Prompt and run:
     ```sh
     npm install --global yarn
     ```

2. **Verify Installation:**
   - Run the following command:
     ```sh
     yarn --version
     ```
   - You should see the installed version of Yarn.

#### macOS

1. **Install via Homebrew:**
   - Open Terminal and run:
     ```sh
     brew install yarn
     ```

2. **Verify Installation:**
   - Run the following command:
     ```sh
     yarn --version
     ```
   - You should see the installed version of Yarn.

#### Linux

1. **Install via npm:**
   - Open Terminal and run:
     ```sh
     npm install --global yarn
     ```

2. **Verify Installation:**
   - Run the following command:
     ```sh
     yarn --version
     ```
   - You should see the installed version of Yarn.

### Example Commands for Using npm and Yarn

- **Installing a Package (e.g., Express):**
  ```sh
  npm install express
  # or
  yarn add express
  ```

- **Running a Script:**
  ```sh
  npm run <script-name>
  # or
  yarn run <script-name>
  ```

- **Updating Packages:**
  ```sh
  npm update
  # or
  yarn upgrade
  ```

By following these steps, you will have Docker, Node.js, npm, and Yarn installed on your system, 


## Tutorial: Building and Running `esteblock/soroban-preview-docker` Image
This tutorial will guide you through the process of building and running the `esteblock/soroban-preview-docker` image with version 21.0.1.

### Step-by-Step Instructions

1. **Build the Docker Image:**
   ```bash
   docker build -t esteblock/soroban-preview:21.0.1 .
   ```

2. **Run the Docker Image:**
   ```bash
   bash quickstart.sh standalone
   ```

## Acceptance Criteria
To ensure the documentation is effective, users should be able to deploy a greeting contract to the testnet by following the updated documentation. All steps should be clear and concise, and the deployment process should work as expected.
By following this documentation, you should be able to set up, configure, and run your Soroban DApp seamlessly. Enjoy building your decentralized applications with Soroban! If you encounter any issues, feel free to reach out to the community or the maintainers for support.