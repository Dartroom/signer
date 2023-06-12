import MyAlgoConnect from '@randlabs/myalgo-connect'
// import WalletConnect from "@walletconnect/client"
import buffer from 'buffer'
import { PeraWalletConnect } from "@perawallet/connect"

import { Wrapper } from "./types/algoSigner"
import AlgoWrapper from "./types/algoSignerAlgo"

import connect, { ConnectSettings } from './connect'
import disconnect, { DisconnectSettings } from './disconnect'
import signTransaction, { type Txn } from './signTransactions'
import setActive, { ActiveSettings } from './active'

export type Ledgers = 'MAINNET' | 'TESTNET'

export const WalletList = ["MyAlgo", "PeraWallet", "AlgoSigner"] as const

export type Wallets = typeof WalletList[number]

export interface Address {
  address: string
  wallet: Wallets
}

export type Addresses = Array<Address>

// Wallet Connect implementation
export interface Pera {
  // connector: WalletConnect
  uri?: string
  deeplink?: string
}

export interface Provider {
  myAlgo: MyAlgoConnect
  pera: PeraWalletConnect
  algoSigner: { algoSigner: Wrapper, algorand: AlgoWrapper } | undefined
  exodus: any | undefined
  ledger: Ledgers
  addresses: Addresses
  active: Address | undefined
}

declare var AlgoSigner: any;
declare var algorand: any;
declare var exodus: any;

export class Wallet {

  myAlgo: MyAlgoConnect
  pera: PeraWalletConnect;
  algoSigner: { algoSigner: Wrapper, algorand: AlgoWrapper } | undefined
  exodus: any | undefined
  ledger: Ledgers
  addresses: Addresses
  active: Address

  constructor (options?: { ledger?: Ledgers}) {
    this.myAlgo = new MyAlgoConnect()
    this.pera = new PeraWalletConnect({ 
      shouldShowSignTxnToast: false,
      chainId: options?.ledger ? (options.ledger === 'TESTNET' ? 416002 : 416001) : 416001
    })
    this.algoSigner = this.setAlgoSigner()
    // this.exodus = this.setExodus()
    this.ledger = options?.ledger || 'MAINNET'
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

  async signTransactions<T extends Txn>(txns: Array<Array<T>>): Promise<Array<Array<T>>> {
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
      const algo = algorand
      return {
        algoSigner: algoSigner,
        algorand: algo
      }
    } catch {
      return undefined
    }
  }

  // private setExodus () {
  //   try {
  //     const exodusSigner = exodus.algorand

  //     exodusSigner.on('disconnect', this.disconnectAddress({ wallet: Wallets.EXODUS }))

  //     return exodusSigner
  //   } catch {
  //     return undefined
  //   }
  // }

  // Wallet Connect implementation
  // private setPera () {
  //   if (typeof window.global !== "undefined") {
  //     // Pollyfill for Buffer
  //     // @ts-ignore
  //     window.global = window

  //     const { Buffer } = buffer

  //     // @ts-ignore
  //     if (!window.Buffer) window.Buffer = Buffer
  //   } else {
  //     const { Buffer } = buffer

  //     // @ts-ignore
  //     if (!window.Buffer) window.Buffer = Buffer
  //   }

  //   // const connector = new WalletConnect({
  //   //   bridge: "https://bridge.walletconnect.org"
  //   // })

  //   // if (connector.connected) {
  //   //   return {
  //   //     connector: connector,
  //   //     uri: connector.uri,
  //   //     deeplink: `algorand://` + connector.uri.split(':')[1]
  //   //   }
  //   // } else {
  //   //   return {
  //   //     connector: connector
  //   //   }
  //   // }
  // }
}