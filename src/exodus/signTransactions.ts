import { Provider } from '../main'
import { Txn } from '../signTransactions'
import { decodeUnsignedTransaction } from 'algosdk'

export default async function sign ({ exodus }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

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

  const signedTxns = await exodus.signTransaction(binaryTxns) as Array<Uint8Array>

  return signedTxns.map((blob, i) => {

    const unsignedTxn = unsignedTxns[i]

    if (!unsignedTxn) {
      throw new Error('Failed to parse transaction array.')
    }

    return {
      blob: blob,
      signers: unsignedTxn.signers,
      txID: unsignedTxn.txID
    }
  })
}