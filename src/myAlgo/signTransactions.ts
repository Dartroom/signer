import { Provider } from '../main'
import { Txn } from '../signTransactions'
import MyAlgoConnect, { WalletTransaction } from '@randlabs/myalgo-connect'
import { decodeUnsignedTransaction } from 'algosdk'

export default async function sign ({ }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {
  const myAlgo = new MyAlgoConnect()

  const binaryTxns: Array<Uint8Array> = []
  const unsignedTxns: Array<Txn> = []

  for (let g = 0; g < txns.length; g++) {

    const txnArray = txns[g]

    if (!txnArray) {
      throw new Error('Failed to parse transaction array.')
    }

    for (let t = 0; t < txnArray.length; t++) {

      const txn = txnArray[t]

      if (!txn) {
        throw new Error('Failed to parse transaction array.')
      }

      binaryTxns.push(decodeUnsignedTransaction(txn.blob).toByte())
      unsignedTxns.push(txn)
    }
  }

  const signedTxns = await myAlgo.signTransaction(binaryTxns)

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {

      const unsignedTxn = unsignedTxns[i]

      if (!unsignedTxn) {
        throw new Error('Failed to parse transaction array.')
      }

      return {
        blob: new Uint8Array(Buffer.from(txn.blob.buffer)),
        txID: unsignedTxn.txID,
        signers: unsignedTxn.signers
      }
    })
  } else {
    throw new Error('')
  }
}