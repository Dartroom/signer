import MyAlgoConnect from '@randlabs/myalgo-connect'
import { PeraWalletConnect } from "@perawallet/connect"

import { Wrapper } from "./types/algoSigner"

import connect, { ConnectSettigns } from './connect'

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

declare const AlgoSigner: Wrapper

export interface Provider {
  myAlgo: MyAlgoConnect
  pera: PeraWalletConnect
  algoSigner: Wrapper | undefined
  ledger: Ledgers
  addresses: Addresses
}

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

  async connectNewAddress (settings: ConnectSettigns) {
    const addresses = await connect(this, settings)
    return addresses
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