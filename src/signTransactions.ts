import { Provider, Wallets } from './main'
import { Transaction } from 'algosdk'

import signMyAlgo from './myAlgo/signTransactions'
import signPera from './pera/signTransactions'
import signDefly from './defly/signTransactions'
import signAlgoSigner from './algoSigner/signTransactions'
import signExodus from './exodus/signTransactions'

export interface Txn {
  blob: Uint8Array
  signers: Array<string>
  txID?: string
  description?: string
  signature?: string
  authAddress?: string
}

export type TxnArray = Array<Array<Txn>>

export default async function signTxns<T extends Txn>(provider: Provider, txns: Array<Array<T>>): Promise<Array<Array<T>>> {

  let myAlgoTxns: Array<Array<T>> = []
  let peraTxns: Array<Array<T>> = []
  let deflyTxns: Array<Array<T>> = []
  let algoSignerTxns: Array<Array<T>> = []
  let exodusTxns: Array<Array<T>> = []

  for (let i = 0; i < txns.length; i++) {

    let wallet: Wallets | null = null

    const txnArray = txns[i]

    if (!txnArray) {
      throw new Error('Failed to parse transaction array.')
    }

    for (let t = 0; t < txnArray.length; t++) {

      const txn = txnArray[t]

      if (!txn) {
        throw new Error('Failed to parse transaction array.')
      }

      if (!wallet && txn.signers && txn.signers.length > 0) {
        const signers = txn.signers

        if (!signers) {
          return []
        }

        const foundAddress = provider.addresses.find((a) => a.address === signers[0])

        if (foundAddress) {
          wallet = foundAddress.wallet
        }
      }
    }

    switch (wallet) {
      case "MyAlgo":
        myAlgoTxns.push(txnArray)
        break
      case "PeraWallet":
        peraTxns.push(txnArray)
        break
      case "DeflyWallet":
        deflyTxns.push(txnArray)
        break
      case "AlgoSigner":
        algoSignerTxns.push(txnArray)
        break
      // case Wallets.EXODUS:
      //   exodusTxns.push(txnArray)
      //   break
    }
  }

  const signedTxns: Array<Array<T>> = []

  if (myAlgoTxns.length > 0) {
    const signedMyAlgo = await signMyAlgo(provider, myAlgoTxns)
    signedTxns.push(...signedMyAlgo)
  }

  if (peraTxns.length > 0) {
    const signedPera = await signPera(provider, peraTxns)
    signedTxns.push(...signedPera)
  }

  if (deflyTxns.length > 0) {
    const signedDefly = await signDefly(provider, deflyTxns)
    signedTxns.push(...signedDefly)
  }

  if (algoSignerTxns.length > 0) {
    const signedAlgoSigner = await signAlgoSigner(provider, algoSignerTxns)
    signedTxns.push(...signedAlgoSigner)
  }

  if (exodusTxns.length > 0) {
    const signedExodus = await signExodus(provider, exodusTxns)

    signedTxns.push(...signedExodus)
  }

  return signedTxns
}