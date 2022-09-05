import { Provider, Wallets } from './main'
import { Transaction } from 'algosdk'

import signMyAlgo from './myAlgo/signTransactions'
import signPera from './pera/signTransactions'
import signAlgoSigner from './algoSigner/signTransactions'

export interface Txn {
  txn: Transaction
  signers: Array<string>
}


export default async function disconnect (provider: Provider, txns: Array<Array<Txn>>): Promise<Array<{ blob: Uint8Array, txID: string }>> {

  let myAlgoTxns: Array<Array<Txn>> = []
  let peraTxns: Array<Array<Txn>> = []
  let algoSignerTxns: Array<Array<Txn>> = []

  for (let i = 0; i < txns.length; i++) {

    let wallet: Wallets | null = null

    for (let t = 0; t < txns[i].length; t++) {

      if (!wallet && txns[i][t].signers.length > 0) {
        const foundAddress = provider.addresses.find((a) => a.address === txns[i][t].signers[0])

        if (foundAddress) {
          wallet = foundAddress.wallet
        }
      }
    }

    switch (wallet) {
      case Wallets.MYALGO:
        myAlgoTxns.push(txns[i])
        break
      case Wallets.PERA:
        peraTxns.push(txns[i])
        break
      case Wallets.ALGOSIGNER:
        algoSignerTxns.push(txns[i])
        break
    }
  }

  const signedTxns: Array<{ blob: Uint8Array, txID: string }> = []

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
    signedTxns.push(...signedAlgoSigner as unknown as Array<{ blob: Uint8Array, txID: string }>)
  }

  return signedTxns
}