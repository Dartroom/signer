# signer
[![CI](https://github.com/Dartroom/signer/actions/workflows/main.yml/badge.svg)](https://github.com/Dartroom/signer/actions/workflows/main.yml)
[![Publish](https://github.com/Dartroom/signer/actions/workflows/publish.yml/badge.svg)](https://github.com/Dartroom/signer/actions/workflows/publish.yml)
[![npm version](https://badge.fury.io/js/@dartroom%2Fsigner.svg)](https://badge.fury.io/js/@dartroom%2Fsigner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A package that aggregates multiple Algorand signing options into one interface. Handles signing and address/login management.

Integrates the following wallet apps:
- [AlgoSigner](https://github.com/PureStake/algosigner)
- [MyAlgo](https://github.com/randlabs/myalgo-connect)
- [PeraWallet](https://github.com/perawallet/connect)

## Documenation
- [Installation](#installation)
- [Setup](#setup)
  - [Options](#options)
- [Connect](#connect)
- [Sign transactions](#sign-transactions)

# Installation

```bash
npm install @dartroom/signer
```

# Setup

```ts
import { Wallet, Address } from '@dartroom/signer'

const wallet = new Wallet({
  ledger: "MAINNET"
})
```

## Options

#### **`ledger?: "MAINNET" | "TESTNET"`**

Some wallet apps require the specification of the network to use. (instead of reading the genesis hash from the transactions them selfs)

# Connect

The Dartroom Signer does not have any UI built-in. All methods are designed to be integrated with your own UI.

When you want to connect to the users' wallet app, you first let them choose between the available options. `AlgoSigner`, `MyAlgo` and `PeraWallet` are currently supported. The chosen options can be passed into the `connectNewAddress`, triggering the wallet connection process.

```ts
const addresses = await wallet.connectNewAddress({ wallet: "PeraWallet" })
```

The return value is an array of one or more addresses, depending on how many the users selected.

```ts
type AddressList = Array<{
  address: string
  wallet: Wallets
}>
```

The package supports multiple connections to different wallet apps. The users can stay connected to all three supported wallets a the same time.

In cases where the users need to choose a single address, you can store this configuration with the `setActive` function. This function will store the configuration in the LocalStorage of the browser.
The active wallet setting does not affect the signing of transactions. You can always sign transactions for any connect address, regardless of if it is the chosen one.

```ts
wallet.setActive({
  address: "FSQW3UTLB5IZ32ZE35MUDPNNAXHCBGMGAKXHR3ENQ5JMT43IB3BET7WPDE",
  wallet: "PeraWallet"
})

console.log(wallet.active) // { address: "FSQW3UTLB5IZ32ZE35MUDPNNAXHCBGMGAKXHR3ENQ5JMT43IB3BET7WPDE", wallet: "PeraWallet" }
```

Algon side storing the active wallet, the connect accounts and sessions are also stored. When you create a new instance of the `Wallet` class, it will always try to restore the last session.

# Sign transactions

```ts
const signedTxns = await wallet.signTransactions([
  [
    {
      blob: [],
      signers: ["FSQW3UTLB5IZ32ZE35MUDPNNAXHCBGMGAKXHR3ENQ5JMT43IB3BET7WPDE"]
    },
  ]
])
```
