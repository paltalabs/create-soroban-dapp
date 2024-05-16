# Contract folder organization

In the contracts folder you will find all the Rust contracts you are using for your dapp as well as the deploy scripts and the registry of all deployed contract in `deployments.json`:

```
contracts/
    contract1/
        src/
            lib.rs
            test.rs
        Cargo.toml
        Makefile
    contract2/
    ...
    scripts/
        deploy.ts
    utils/
    Makefile
```

You will also find some makefiles which are used in the deploy scripts to automatically recompile the contracts if they have been updated.

The contract folder is a typescript package in itself and its dependencies need to be installed in order to build the scripts.