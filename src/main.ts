import MyAlgoConnect from '@randlabs/myalgo-connect'
// import { PeraWalletConnect } from "@perawallet/connect"

import { Wrapper } from "./types/algoSigner"

import connect, { ConnectSettings } from './connect'
import disconnect, { DisconnectSettings } from './disconnect'
import signTransaction, { Txn } from './signTransactions'
import setActive, { ActiveSettings } from './active'

export enum Ledgers {
  MAINNET = 'MainNet',
  TESTNET = 'TestNet'
}

export enum Wallets {
  MYALGO = 'MyAlgo',
  PERA = 'PeraWallet',
  ALGOSIGNER = 'AlgoSigner',
  EXODUS = 'Exodus'
}

export interface Address {
  address: string
  wallet: Wallets
}

export type Addresses = Array<Address>

export interface Provider {
  myAlgo: MyAlgoConnect
  pera: {}
  algoSigner: Wrapper | undefined
  exodus: any | undefined
  ledger: Ledgers
  addresses: Addresses
  active: Address | undefined
}

declare var AlgoSigner: any;
declare var exodus: any;

export class Wallet {

  myAlgo: MyAlgoConnect
  pera: {}
  algoSigner: Wrapper | undefined
  exodus: any | undefined
  ledger: Ledgers
  addresses: Addresses
  active: Address

  constructor (options?: { ledger?: Ledgers}) {
    this.myAlgo = new MyAlgoConnect()
    this.pera = {}
    this.algoSigner = this.setAlgoSigner()
    this.exodus = this.setExodus()
    this.ledger = options?.ledger || Ledgers.MAINNET
    this.addresses = this.getLocalAccounts()
    this.active = this.getActive()
  }

  async connectNewAddress (settings: ConnectSettings) {
    const addresses = await connect(this, settings)
    return addresses
  }

  async disconnectAddress (settings: DisconnectSettings) {
    await disconnect(this, settings)
  }

  async signTransactions (txns: Array<Array<Txn>>) {
    return await signTransaction(this, txns)
  }

  setActive (settings: ActiveSettings) {
    return setActive(this, settings)
  }

  private setLocalAccounts () {
    localStorage.setItem('@dartsigner-accounts', JSON.stringify(this.addresses))
  }

  private getLocalAccounts () {
    let accounts = []
    let local = localStorage.getItem('@dartsigner-accounts')

    if (local) {
      accounts = JSON.parse(local)
    }

    return accounts
  }

  private getActive () {
    let active
    let local = localStorage.getItem('@dartsigner-active')

    if (local) {
      active = JSON.parse(local)
    }

    return active
  }

  private setAlgoSigner () {
    try {
      const algoSigner = AlgoSigner
      return algoSigner
    } catch {
      return undefined
    }
  }

  private setExodus () {
    try {
      const exodusSigner = exodus.algorand

      exodusSigner.on('disconnect', this.disconnectAddress({ wallet: Wallets.EXODUS }))

      return exodusSigner
    } catch {
      return undefined
    }
  }
}