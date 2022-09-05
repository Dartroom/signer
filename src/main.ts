import MyAlgoConnect from '@randlabs/myalgo-connect'
import { PeraWalletConnect } from "@perawallet/connect"

import { Wrapper } from "./types/algoSigner"

import connect, { ConnectSettings } from './connect'
import disconnect, { DisconnectSettings } from './disconnect'
import signTransaction, { Txn } from './signTransactions'

export enum Ledgers {
  MAINNET = 'MainNet',
  TESTNET = 'TestNet'
}

export enum Wallets {
  MYALGO = 'MyAlgo',
  PERA = 'PeraWallet',
  ALGOSIGNER = 'AlgoSigner'
}

export type Addresses = Array<{
  address: string
  wallet: Wallets
}>

export interface Provider {
  myAlgo: MyAlgoConnect
  pera: PeraWalletConnect
  algoSigner: Wrapper | undefined
  ledger: Ledgers
  addresses: Addresses
}

declare var AlgoSigner: any;

export class Wallet {

  myAlgo: MyAlgoConnect
  pera: PeraWalletConnect
  algoSigner: Wrapper | undefined
  ledger: Ledgers
  addresses: Addresses

  constructor (options?: { ledger?: Ledgers}) {
    this.myAlgo = new MyAlgoConnect()
    this.pera = new PeraWalletConnect({ shouldShowSignTxnToast: false })
    this.algoSigner = this.setAlgoSigner()
    this.ledger = options?.ledger || Ledgers.MAINNET
    this.addresses = this.getLocalAccounts()
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

  private setLocalAccounts () {
    localStorage.setItem('accounts', JSON.stringify(this.addresses))
  }

  private getLocalAccounts () {
    let accounts = []
    let local = localStorage.getItem('accounts')

    if (local) {
      accounts = JSON.parse(local)
    }

    return accounts
  }

  private setAlgoSigner () {
    try {
      const algoSigner = AlgoSigner
      return algoSigner
    } catch {
      return undefined
    }
  }
}