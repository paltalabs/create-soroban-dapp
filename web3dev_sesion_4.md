# Guide Session 4 

## Pre-requisites
- Have completed the previous sessions
- Have a deployed contract on Soroban.

## Introduction
In this session we will review how to retrieve data from the Blockchain.

## Steps
1. Open the project created in the previous session.
2. Create a login on [Mercury](https://test.mercurydata.app/)
3. Create a Subscription for Ledger Entry on Mercury with a deployed instance of the voting contract and `AAAAFA==` as key_xdr
4. Go to graphql play around on explorer
5. Install mercury-sdk
    ```bash
    bash run.sh
    yarn add @mercury-sdk
    ```
6. Import mercury where I am going to use it
    ```javascript
    import { mercury } from '@mercury-sdk';
    ```
7. Create an Instance of Mercury
    ```javascript
    const mercuryInstance = new Mercury({
        backendEndpoint: "https://api.mercurydata.app/",
        graphqlEndpoint: "https://api.mercurydata.app/graphql",
        email: process.env.MERCURY_EMAIL,
        password: process.env.MERCURY_PASSWORD,
        });
    ```