### Create and build your own contracts

The contracts workflow happens in the `contracts/` folder. Here you can see that the greeting contract is present already.

Every new contract should be in its own folder, and the folder should be named the same name as the name of the contract in its `cargo.toml` file. You can check how the `tweaked_greeting` contract is changed from the `greeting` contract and you can also start from this to build your own contract.

To build the contracts you can simply invoke the `make` command which will recursively build all contracts by propagating the `make` command to subfolders. Each contract needs to have its own `Makefile` for this to work. The `Makefile` from the greeting contract is a generic one and can be copied and paste to use with any of your new contract.

If you are not familiar or comfortable with Makefiles you can simply go in the directory of the contract you want to compile and run 

```bash
# This will create the target wasm blob under target/wasm32-unknown-unknown/release/contract_name.wasm
cargo build --target wasm32-unknown-unknown --release
```

> If it's your first time manipulating soroban contracts you might need to add the `wasm32-unknown-unknown` target to rust. For this run `rustup target add wasm32-unknown-unknown`. <br/>Follow instructions you find online if not working ( search for "add target wasm32-unknown-unknown to rust" ).