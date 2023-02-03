import { Provider, Wallets } from './main'
import { Transaction } from 'algosdk'

import signMyAlgo from './myAlgo/signTransactions'
import signPera from './pera/signTransactions'
import signAlgoSigner from './algoSigner/signTransactions'
import signExodus from './exodus/signTransactions'

export interface Txn {
  blob: Uint8Array
  signers: Array<string>
  txID: string
}


export default async function signTxns (provider: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  let myAlgoTxns: Array<Array<Txn>> = []
  let peraTxns: Array<Array<Txn>> = []
  let algoSignerTxns: Array<Array<Txn>> = []
  let exodusTxns: Array<Array<Txn>> = []

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

      if (!wallet && txn.signers.length > 0) {
        const foundAddress = provider.addresses.find((a) => a.address === txn.signers[0])

        if (foundAddress) {
          wallet = foundAddress.wallet
        }
      }
    }

    switch (wallet) {
      case Wallets.MYALGO:
        myAlgoTxns.push(txnArray)
        break
      case Wallets.PERA:
        peraTxns.push(txnArray)
        break
      case Wallets.ALGOSIGNER:
        algoSignerTxns.push(txnArray)
        break
      case Wallets.EXODUS:
        exodusTxns.push(txnArray)
        break
    }
  }

  const signedTxns: Array<Txn> = []

  if (myAlgoTxns.length > 0) {
    const signedMyAlgo = await signMyAlgo(provider, myAlgoTxns)
    signedTxns.push(...signedMyAlgo)
  }

  if (peraTxns.length > 0) {
    const signedPera = await signPera(provider, peraTxns)
    signedTxns.push(...signedPera)
  }

  if (algoSignerTxns.length > 0) {
    const signedAlgoSigner = await signAlgoSigner(provider, algoSignerTxns)
    signedTxns.push(...signedAlgoSigner as unknown as Array<Txn>)
  }

  if (exodusTxns.length > 0) {
    const signedExodus = await signExodus(provider, exodusTxns)

    signedTxns.push(...signedExodus)
  }

  return signedTxns
}