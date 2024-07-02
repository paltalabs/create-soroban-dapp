# Soroban DApp Setup Documentation

## Table of Contents
- [Soroban DApp Setup Documentation](#soroban-dapp-setup-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Dependencies](#dependencies)
  - [Installation Instructions](#installation-instructions)
    - [Step-by-Step Instructions to Install the dependencies](#step-by-step-instructions-to-install-the-dependencies)
    - [Docker](#docker)
      - [Steps to Install Docker](#steps-to-install-docker)
  - [Tutorial: Building and Running `esteblock/soroban-preview-docker` Image](#tutorial-building-and-running-esteblocksoroban-preview-docker-image)
    - [Step-by-Step Instructions](#step-by-step-instructions)


## Introduction
This documentation provides detailed steps to successfully set up and deploy your Soroban-based decentralized application (DApp) using **@create-soroban-dapp**. This guide ensures you can quickly start your project with a robust boilerplate DApp built on **@soroban-react**.
 

`@create-soroban-dapp` is both an npx script and a boilerplate DApp, inspired by the ink!athon project by Scio Labs and @create-t3-app by T3 Open Source for script mechanisms.



Read the docs here 📚📚

## Dependencies
To successfully set up a Soroban DApp, you need to have the following dependencies installed:

- **Docker**: Required for containerized environment setup.

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
  

## Tutorial: Building and Running `esteblock/soroban-preview-docker` Image

This tutorial will guide you through the process of building and running the `esteblock/soroban-preview-docker` image with version 21.0.1.

### Step-by-Step Instructions


1. Clone repo:
   ```bash
   git clone https://github.com/esteblock/soroban-preview-docker.git
   ```
1. **Build the Docker Image:**
   ```bash
   docker build -t esteblock/soroban-preview:21.0.1 .
   ```

2. **Run the Docker Image:**
   ```bash
   bash quickstart.sh standalone
   ```
